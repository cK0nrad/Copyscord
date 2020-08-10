import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, isAdmin, server } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);
  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  if (!(await isAdmin(authorization._id, Long.fromString(req.params.id)))) return unauthorized(res);

  let channelID = Long.fromString(req.params.channelId);

  let updated = await server.update(
    {
      _id: Long.fromString(req.params.id),
      "channels.channelsList.id": channelID,
    },
    {
      $pull: {
        "channels.$.channelsList": {
          id: channelID,
        },
      },
    }
  );

  if (!updated.nModified) return res.status(404).send({ error: config.locale[3002], errorCode: 3002 });

  SocketEventEmitter.emit("deleteChannel", {
    serverID: req.params.id,
    channelID: req.params.channelId,
  });

  return res.send({
    id: req.params.channelId,
  });
};

export default controller;
