"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.producerListSender = exports.producerListReceiver = exports.userList = exports.routerList = exports.producerList = void 0;
const joinChannel_1 = require("./VoiceHandler/joinChannel");
const connectVoice_1 = require("./VoiceHandler/connectVoice");
const produceUser_1 = require("./VoiceHandler/produceUser");
const consumeUser_1 = require("./VoiceHandler/consumeUser");
const util_1 = require("../../WebAPI/util");
const server_1 = require("../server");
exports.producerList = new Map();
exports.routerList = new Map();
exports.userList = new Map();
exports.producerListReceiver = new Map();
exports.producerListSender = new Map();
/*
currentState:
  0: Nothing already done
  1: producer/consumer created
  2: producer/consumer connected
  3: producer/consumer ready to send/receive
*/
const manager = (socket, io, voiceRouter) => {
    let currentState = 0;
    let transportConsumer, transportProducer;
    let channelID, serverID, userID;
    //STATE: 0 -> Client ask to join the channel
    socket.on("joinChannel", async ({ serverId, channelId, authorizationToken }) => {
        if (currentState !== 0)
            return (socket.emit("problem", "already connected, reset the connection to change channel"),
                socket.disconnect(true),
                { error: true });
        let error;
        ({ transportConsumer, transportProducer, error, userID } = await joinChannel_1.default([serverId, channelId, authorizationToken], socket, io, voiceRouter));
        if (error)
            return console.log("error joinChannel()");
        socket.join(serverId);
        userID = userID;
        channelID = channelId;
        serverID = serverId;
        currentState = 1;
    });
    //STATE: 1 -> Client ask to connect to the channel
    socket.on("connectMe", async ({ type, dtlsParameters }) => {
        let { transportProducer: producer, transportConsumer: consumer, error } = await connectVoice_1.default({ type, dtlsParameters }, transportProducer, transportConsumer, socket);
        if (error)
            return socket.emit("problem", "you are already connected"), socket.disconnect(true), { error: true };
        else {
            transportProducer = producer;
            transportConsumer = consumer;
            return (currentState = 2);
        }
    });
    //STATE: 2 -> Client is connected to channel, he can ask to receive and send audio now
    socket.on("produceMe", async ({ producerOptions }) => {
        if (currentState !== 2 && currentState !== 3)
            return (socket.emit("problem", "you need to join and connect to the channel before produce audio"),
                socket.disconnect(true),
                { error: true });
        await produceUser_1.default(producerOptions, transportProducer, serverID, channelID, socket, userID);
        let user = exports.userList.get(userID);
        server_1.SocketEventEmitter.emit("newVoiceUser", {
            serverID,
            channelID,
            username: user.username,
            logoUrl: user.logoUrl,
            id: user.id,
        });
        socket.to(channelID).emit("newUser", [user, exports.producerList.get(serverID).get(channelID).get(userID)]);
        currentState = 3;
    });
    socket.on("consumeMe", async ({ rtpCapabilities, producerId }) => {
        if (currentState !== 2 && currentState !== 3)
            return (socket.emit("problem", "you need to join and connect to the channel before consuming audio"),
                socket.disconnect(true),
                { error: true });
        await consumeUser_1.default(producerId, rtpCapabilities, exports.routerList.get(channelID), socket, transportConsumer, userID);
        currentState = 3;
    });
    socket.on("producerList", () => {
        if (currentState !== 3)
            return (socket.emit("problem", "you need to be produced before fetching list of other producer"),
                socket.disconnect(true),
                { error: true });
        let me = exports.producerList.get(serverID).get(channelID).get(userID);
        let producerInChannel = exports.producerList.get(serverID).get(channelID);
        socket.emit("producerList", [Array.from(producerInChannel.values()), me]);
    });
    socket.on("muteMe", () => {
        if (exports.producerListSender.has(userID))
            exports.producerListSender.get(userID).pause();
    });
    socket.on("unmuteMe", () => {
        if (exports.producerListSender.has(userID))
            exports.producerListSender.get(userID).resume();
    });
    socket.on("deafMe", () => {
        if (exports.producerListReceiver.has(userID))
            exports.producerListReceiver.get(userID).forEach((x) => x.pause());
    });
    socket.on("undeafMe", () => {
        if (exports.producerListReceiver.has(userID))
            exports.producerListReceiver.get(userID).forEach((x) => x.resume());
    });
    socket.on("disconnect", async () => {
        if (serverID && channelID) {
            // Remove audio producer
            exports.userList.delete(userID);
            if (exports.producerList.has(serverID) &&
                exports.producerList.get(serverID).has(channelID) &&
                exports.producerList.get(serverID).get(channelID).has(userID)) {
                socket.to(channelID).emit("removeProducer", exports.producerList.get(serverID).get(channelID).get(userID));
                exports.producerList.get(serverID).get(channelID).delete(userID);
            }
            transportProducer.close();
            transportConsumer.close();
            // Remove from redis
            let channelList = JSON.parse(await util_1.HGET("channelList", serverID));
            if (!io.sockets.adapter.rooms.hasOwnProperty(channelID)) {
                delete channelList[channelID];
                await util_1.HSET("channelList", serverID, JSON.stringify(channelList));
                exports.routerList.get(channelID).close();
                exports.routerList.delete(channelID);
            }
            else {
                let userIndex = channelList[channelID].indexOf(userID);
                channelList[channelID].splice(userIndex, 1);
                if (userIndex > -1) {
                    await util_1.HSET("channelList", serverID, JSON.stringify(channelList));
                }
            }
            if (exports.producerListReceiver.has(userID))
                exports.producerListReceiver.delete(userID);
            if (exports.producerListSender.has(userID))
                exports.producerListSender.delete(userID);
            //Remove from everyone on the server
            server_1.SocketEventEmitter.emit("removeVoiceUser", {
                serverID,
                channelID,
                id: userID,
            });
        }
    });
};
//To prevent sync problem:
let signal = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"];
signal.forEach((signal) => {
    process.on(signal, (err) => {
        console.log(err);
        exports.producerList.forEach((entry, key) => {
            util_1.HDEL("channelList", key);
            util_1.HDEL("instanceList", key);
        });
        process.exit();
    });
});
exports.default = manager;
