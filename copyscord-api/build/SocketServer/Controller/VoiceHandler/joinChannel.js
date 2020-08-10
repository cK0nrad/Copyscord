"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../WebAPI/util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../config");
const voiceManage_1 = require("../voiceManage");
const voiceManage_2 = require("../voiceManage");
const WebRtcTransportOptions = {
    listenIps: [config_1.default.publicIp],
};
const handler = async ([serverId, channelId, authorizationToken], socket, io, worker) => {
    if (!serverId)
        return socket.emit("problem", "no server id"), socket.disconnect(true), { error: true };
    if (!channelId)
        return socket.emit("problem", "no channel id"), socket.disconnect(true), { error: true };
    if (!util_1.checkID(serverId))
        return socket.emit("problem", { error: config_1.default.locale[4001], errorCode: 4001 }), socket.disconnect(true), { error: true };
    if (!util_1.checkID(channelId))
        return socket.emit("problem", { error: config_1.default.locale[3001], errorCode: 3001 }), socket.disconnect(true), { error: true };
    let authorization = await util_1.isAuthorized(authorizationToken);
    if (!authorization)
        return socket.emit("problem", "unauthorized"), socket.disconnect(true), { error: true };
    if (voiceManage_2.userList.has(authorization._id.toString()))
        return socket.emit("problem", "disconnect the previous socket."), socket.disconnect(true), { error: true };
    const userId = authorization._id.toString();
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(serverId)))
        return socket.emit("problem", "server not found"), socket.disconnect(true), { error: true };
    if (!(await util_1.channelExist(mongodb_1.Long.fromString(channelId), serverId, 1)))
        return socket.emit("problem", "channel not found"), socket.disconnect(true), { error: true };
    if (serverId === channelId)
        return socket.emit("problem", "serverId must be different than channelId"), socket.disconnect(true), { error: true };
    if (await util_1.HEXISTS("channelList", serverId)) {
        let channelList = JSON.parse(await util_1.HGET("channelList", serverId));
        if (!channelList[channelId])
            channelList[channelId] = [];
        channelList[channelId].push(userId);
        await util_1.HSET("channelList", serverId, JSON.stringify(channelList));
    }
    else {
        let json = {};
        json[channelId] = [userId];
        await util_1.HSET("channelList", serverId, JSON.stringify(json));
    }
    if (!(await util_1.HEXISTS("instanceList", serverId))) {
        await util_1.HSET("instanceList", serverId, config_1.default.publicIp + ":" + config_1.default.voiceSocketPort);
    }
    else if ((await util_1.HGET("instanceList", serverId)) !== config_1.default.publicIp + ":" + config_1.default.voiceSocketPort) {
        return socket.emit("problem", "wrong node"), socket.disconnect(true), { error: true };
    }
    //Event: newVoiceUser(ServerID, ChannelID)
    let router;
    if (io.sockets.adapter.rooms.hasOwnProperty(channelId)) {
        router = voiceManage_1.routerList.get(channelId);
        socket.join(channelId);
    }
    else {
        router = await worker.createRouter({
            mediaCodecs: [
                {
                    kind: "audio",
                    mimeType: "audio/opus",
                    clockRate: 48000,
                    channels: 2,
                },
            ],
        });
        voiceManage_1.routerList.set(channelId, router);
        socket.join(channelId);
    }
    let transportConsumer = await router.createWebRtcTransport(WebRtcTransportOptions);
    let transportProducer = await router.createWebRtcTransport(WebRtcTransportOptions);
    voiceManage_2.userList.set(userId, { id: authorization._id, username: authorization.username, logoUrl: authorization.logoUrl });
    socket.emit("rtpCapabilities", {
        routerRtpCapabilities: router.rtpCapabilities,
        receiverTransportOption: {
            id: transportConsumer.id,
            iceParameters: transportConsumer.iceParameters,
            iceCandidates: transportConsumer.iceCandidates,
            dtlsParameters: transportConsumer.dtlsParameters,
        },
        senderTransportOption: {
            id: transportProducer.id,
            iceParameters: transportProducer.iceParameters,
            iceCandidates: transportProducer.iceCandidates,
            dtlsParameters: transportProducer.dtlsParameters,
        },
    });
    socket.emit("statusUpdate", 1);
    return { transportConsumer, transportProducer, userID: userId };
};
exports.default = handler;
