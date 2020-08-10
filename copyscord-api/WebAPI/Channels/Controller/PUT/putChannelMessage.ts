import { Request, Response } from "express";
import { checkID, isAuthorized, memberOfServer, messages, unauthorized } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.content) return res.status(400).send({ error: config.locale[6005], errorCode: 6005 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });
  if (!checkID(req.params.messageId)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  let updatedMessage = await messages.update(
    {
      _id: Long.fromString(req.params.messageId),
      serverId: Long.fromString(req.params.id),
      channelId: Long.fromString(req.params.channelId),
      userId: authorization._id,
    },
    {
      $set: {
        content: req.query.content,
      },
    }
  );

  if (!updatedMessage.nModified) return res.status(404).send({ error: config.locale[6002], errorCode: 6002 });
  SocketEventEmitter.emit("updateMessage", {
    serverID: req.params.id,
    messageID: req.params.messageId,
    authorID: authorization._id.toString(),
    channelID: req.params.channelId as string,
    newContent: req.query.content as string,
  });

  return res.send({
    id: req.params.messageId,
    channelId: req.params.channelId,
    serverId: req.params.id,
    content: req.query.content,
  });
};

export default controller;
