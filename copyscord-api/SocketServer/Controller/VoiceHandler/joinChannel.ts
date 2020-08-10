import { checkID, isAuthorized, memberOfServer, channelExist, HGET, HEXISTS, HSET } from "../../../WebAPI/util";
import { Long } from "mongodb";
import config from "../../../config";
import { routerList } from "../voiceManage";
import { userList } from "../voiceManage";
const WebRtcTransportOptions = {
  listenIps: [config.publicIp],
};
const handler = async ([serverId, channelId, authorizationToken], socket, io, worker) => {
  if (!serverId) return socket.emit("problem", "no server id"), socket.disconnect(true), { error: true };
  if (!channelId) return socket.emit("problem", "no channel id"), socket.disconnect(true), { error: true };

  if (!checkID(serverId))
    return socket.emit("problem", { error: config.locale[4001], errorCode: 4001 }), socket.disconnect(true), { error: true };
  if (!checkID(channelId))
    return socket.emit("problem", { error: config.locale[3001], errorCode: 3001 }), socket.disconnect(true), { error: true };

  let authorization = await isAuthorized(authorizationToken);
  if (!authorization) return socket.emit("problem", "unauthorized"), socket.disconnect(true), { error: true };
  if (userList.has(authorization._id.toString()))
    return socket.emit("problem", "disconnect the previous socket."), socket.disconnect(true), { error: true };

  const userId = authorization._id.toString();
  if (!memberOfServer(authorization, Long.fromString(serverId)))
    return socket.emit("problem", "server not found"), socket.disconnect(true), { error: true };
  if (!(await channelExist(Long.fromString(channelId), serverId, 1)))
    return socket.emit("problem", "channel not found"), socket.disconnect(true), { error: true };

  if (serverId === channelId)
    return socket.emit("problem", "serverId must be different than channelId"), socket.disconnect(true), { error: true };

  if (await HEXISTS("channelList", serverId)) {
    let channelList = JSON.parse(await HGET("channelList", serverId));
    if (!channelList[channelId]) channelList[channelId] = [];
    channelList[channelId].push(userId);
    await HSET("channelList", serverId, JSON.stringify(channelList));
  } else {
    let json = {};
    json[channelId] = [userId];
    await HSET("channelList", serverId, JSON.stringify(json));
  }

  if (!(await HEXISTS("instanceList", serverId))) {
    await HSET("instanceList", serverId, config.publicIp + ":" + config.voiceSocketPort);
  } else if ((await HGET("instanceList", serverId)) !== config.publicIp + ":" + config.voiceSocketPort) {
    return socket.emit("problem", "wrong node"), socket.disconnect(true), { error: true };
  }

  //Event: newVoiceUser(ServerID, ChannelID)
  let router;
  if (io.sockets.adapter.rooms.hasOwnProperty(channelId)) {
    router = routerList.get(channelId);
    socket.join(channelId);
  } else {
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
    routerList.set(channelId, router);
    socket.join(channelId);
  }
  let transportConsumer = await router.createWebRtcTransport(WebRtcTransportOptions);
  let transportProducer = await router.createWebRtcTransport(WebRtcTransportOptions);
  userList.set(userId, { id: authorization._id, username: authorization.username, logoUrl: authorization.logoUrl });
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
export default handler;
