import joinChannel from "./VoiceHandler/joinChannel";
import connectVoice from "./VoiceHandler/connectVoice";
import produceUser from "./VoiceHandler/produceUser";
import consumeUser from "./VoiceHandler/consumeUser";
import { HDEL, HSET, HGET, server, users } from "../../WebAPI/util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../server";

export const producerList = new Map();
export const routerList = new Map();
export const userList = new Map();

export const producerListReceiver = new Map();
export const producerListSender = new Map();

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
  let channelID: string, serverID: string, userID: string;

  //STATE: 0 -> Client ask to join the channel
  socket.on("joinChannel", async ({ serverId, channelId, authorizationToken }) => {
    if (currentState !== 0)
      return (
        socket.emit("problem", "already connected, reset the connection to change channel"),
        socket.disconnect(true),
        { error: true }
      );
    let error: boolean;
    ({ transportConsumer, transportProducer, error, userID } = await joinChannel(
      [serverId, channelId, authorizationToken],
      socket,
      io,
      voiceRouter
    ));
    if (error) return console.log("error joinChannel()");
    socket.join(serverId);
    userID = userID;
    channelID = channelId;
    serverID = serverId;
    currentState = 1;
  });

  //STATE: 1 -> Client ask to connect to the channel
  socket.on("connectMe", async ({ type, dtlsParameters }) => {
    let { transportProducer: producer, transportConsumer: consumer, error } = await connectVoice(
      { type, dtlsParameters },
      transportProducer,
      transportConsumer,
      socket
    );
    if (error) return socket.emit("problem", "you are already connected"), socket.disconnect(true), { error: true };
    else {
      transportProducer = producer;
      transportConsumer = consumer;
      return (currentState = 2);
    }
  });

  //STATE: 2 -> Client is connected to channel, he can ask to receive and send audio now
  socket.on("produceMe", async ({ producerOptions }) => {
    if (currentState !== 2 && currentState !== 3)
      return (
        socket.emit("problem", "you need to join and connect to the channel before produce audio"),
        socket.disconnect(true),
        { error: true }
      );
    await produceUser(producerOptions, transportProducer, serverID, channelID, socket, userID);
    let user = userList.get(userID);
    SocketEventEmitter.emit("newVoiceUser", {
      serverID,
      channelID,
      username: user.username,
      logoUrl: user.logoUrl,
      id: user.id,
    });
    socket.to(channelID).emit("newUser", [user, producerList.get(serverID).get(channelID).get(userID)]);

    currentState = 3;
  });
  socket.on("consumeMe", async ({ rtpCapabilities, producerId }) => {
    if (currentState !== 2 && currentState !== 3)
      return (
        socket.emit("problem", "you need to join and connect to the channel before consuming audio"),
        socket.disconnect(true),
        { error: true }
      );
    await consumeUser(producerId, rtpCapabilities, routerList.get(channelID), socket, transportConsumer, userID);
    currentState = 3;
  });
  socket.on("producerList", () => {
    if (currentState !== 3)
      return (
        socket.emit("problem", "you need to be produced before fetching list of other producer"),
        socket.disconnect(true),
        { error: true }
      );
    let me = producerList.get(serverID).get(channelID).get(userID);
    let producerInChannel = producerList.get(serverID).get(channelID);

    socket.emit("producerList", [Array.from(producerInChannel.values()), me]);
  });

  socket.on("muteMe", () => {
    if (producerListSender.has(userID)) producerListSender.get(userID).pause();
  });
  socket.on("unmuteMe", () => {
    if (producerListSender.has(userID)) producerListSender.get(userID).resume();
  });

  socket.on("deafMe", () => {
    if (producerListReceiver.has(userID)) producerListReceiver.get(userID).forEach((x) => x.pause());
  });
  socket.on("undeafMe", () => {
    if (producerListReceiver.has(userID)) producerListReceiver.get(userID).forEach((x) => x.resume());
  });

  socket.on("disconnect", async () => {
    if (serverID && channelID) {
      // Remove audio producer
      userList.delete(userID);
      if (
        producerList.has(serverID) &&
        producerList.get(serverID).has(channelID) &&
        producerList.get(serverID).get(channelID).has(userID)
      ) {
        socket.to(channelID).emit("removeProducer", producerList.get(serverID).get(channelID).get(userID));
        producerList.get(serverID).get(channelID).delete(userID);
      }
      transportProducer.close();
      transportConsumer.close();

      // Remove from redis
      let channelList = JSON.parse(await HGET("channelList", serverID));
      if (!io.sockets.adapter.rooms.hasOwnProperty(channelID)) {
        delete channelList[channelID];
        await HSET("channelList", serverID, JSON.stringify(channelList));
        routerList.get(channelID).close();
        routerList.delete(channelID);
      } else {
        let userIndex = channelList[channelID].indexOf(userID);
        channelList[channelID].splice(userIndex, 1);
        if (userIndex > -1) {
          await HSET("channelList", serverID, JSON.stringify(channelList));
        }
      }

      if (producerListReceiver.has(userID)) producerListReceiver.delete(userID);
      if (producerListSender.has(userID)) producerListSender.delete(userID);
      //Remove from everyone on the server
      SocketEventEmitter.emit("removeVoiceUser", {
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
    producerList.forEach((entry, key) => {
      HDEL("channelList", key);
      HDEL("instanceList", key);
    });
    process.exit();
  });
});

export default manager;
