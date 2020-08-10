import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, dm, users } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.messageId)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });
  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  let updatedMessage = await dm.findOneAndUpdate(
    {
      _id: Long.fromString(req.params.messageID),
      fromId: authorization._id,
      toId: Long.fromString(req.params.id),
    },
    { $set: { content: req.query.content } }
  );
  if (!updatedMessage) return res.status(404).send({ error: config.locale[6002], errorCode: 6002 });

  const updateUser = await users.update(
    { _id: authorization._id },
    { $set: { "dmList.$[a].lastMessage": Date.now() } },
    {
      arrayFilters: [
        {
          "a.id": Long.fromString(req.params.id),
        },
      ],
    }
  );
  if (!updateUser.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("updateDM", {
    serverID: "@me",
    channelID: req.params.id,
    authorID: authorization._id.toString(),
    messageID: updatedMessage._id.toString(),
    newContent: updatedMessage.content,
  });

  return res.send({
    id: updatedMessage._id,
    oldContent: updatedMessage.content,
    author: updatedMessage.fromId,
  });
};

export default controller;
