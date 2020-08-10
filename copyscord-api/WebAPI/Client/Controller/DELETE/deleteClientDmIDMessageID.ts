import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, dm } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.messageID)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });
  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  let deleted = await dm.remove({
    _id: Long.fromString(req.params.messageID),
    fromId: authorization._id,
    toId: Long.fromString(req.params.id),
  });

  if (!deleted.deletedCount) return res.status(404).send({ error: config.locale[6002], errorCode: 6002 });
  SocketEventEmitter.emit("deleteDM", {
    serverID: "@me",
    channelID: req.params.id,
    authorID: authorization._id.toString(),
    messageID: req.params.messageID,
  });
  return res.send({
    id: req.params.messageID,
  });
};

export default controller;
