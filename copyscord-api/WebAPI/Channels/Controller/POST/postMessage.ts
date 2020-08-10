import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server, messages } from "../../../util";
import { Long } from "mongodb";
import uniqueID from "../../../uniqueID";
import { Server, category, channelList } from "../../../interface";
import config from "../../../../config";
import { SocketEventEmitter } from "../../../../SocketServer/server";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.content) return res.status(400).send({ error: config.locale[6005], errorCode: 6005 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);
  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  let currentServer: Server = await server.findOne({ _id: Long.fromString(req.params.id) });
  if (
    !currentServer.channels.some((category: category) =>
      category.channelsList.some(
        (channel: channelList) => channel.id.equals(Long.fromString(req.params.channelId)) && channel.type === 0
      )
    )
  )
    return res.status(404).send({ error: config.locale[3002], errorCode: 3002 });

  let messsageID = BigInt("0b" + uniqueID.generate(config.serverID)).toString();
  let date = Date.now();
  let newMessage = await messages.insert({
    _id: Long.fromString(messsageID),
    serverId: Long.fromString(req.params.id),
    channelId: Long.fromString(req.params.channelId),
    userId: authorization._id,
    content: req.query.content,
    date: date,
  });

  if (!newMessage) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("newMessage", {
    serverID: req.params.id,
    messageID: messsageID,
    authorID: authorization._id.toString(),
    authorName: authorization.username,
    authorLogo: authorization.logoUrl,
    authorCode: authorization.userCode,
    channelID: req.params.channelId,
    date,
    content: req.query.content as string,
  });

  return res.send({
    id: messsageID,
    serverId: req.params.id,
    channelId: req.params.channelId,
    content: req.query.content,
    date: date,
  });
};

export default controller;
