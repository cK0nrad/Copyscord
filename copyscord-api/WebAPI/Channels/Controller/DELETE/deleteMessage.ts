import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, isAdmin, messages } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

interface query {
  _id: Long;
  serverId: Long;
  channelId: Long;
  userId?: Long;
}

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });
  if (!checkID(req.params.messageId)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ eerror: config.locale[4002], errorCode: 4002 });

  let query: query = {
    _id: Long.fromString(req.params.messageId),
    serverId: Long.fromString(req.params.id),
    channelId: Long.fromString(req.params.channelId),
  };

  if (!(await isAdmin(authorization._id, Long.fromString(req.params.id)))) {
    query.userId = authorization._id;
  }

  let deletedMessage = messages.findOneAndDelete(query);
  if (!deletedMessage) return res.status(404).send({ error: config.locale[6002], errorCode: 6002 });

  SocketEventEmitter.emit("deleteMessage", {
    serverID: req.params.id,
    messageID: req.params.messageId,
    authorID: authorization._id.toString(),
    channelID: req.params.channelId as string,
  });
  return res.send({
    id: req.params.messageId,
  });
};

export default controller;
