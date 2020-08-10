import { Request, Response } from "express";
import { checkID, unauthorized, isAuthorized, memberOfServer, isAdmin, server } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.name) return res.status(400).send({ error: config.locale[3003], errorCode: 3003 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!(await isAdmin(authorization._id, Long.fromString(req.params.id)))) return unauthorized(res);

  let update = await server.update(
    { _id: Long.fromString(req.params.id) },
    {
      $set: {
        "channels.$[a].channelsList.$[b].name": req.query.name,
      },
    },
    {
      arrayFilters: [
        {
          "a.channelsList.id": Long.fromString(req.params.channelId),
        },
        {
          "b.id": Long.fromString(req.params.channelId),
        },
      ],
    }
  );

  if (!update.nModified) return res.status(404).send({ error: config.locale[7002], errorCode: 7002 });

  SocketEventEmitter.emit("updateChannel", {
    serverID: req.params.id,
    channelID: req.params.channelId,
    newChannelName: req.query.name as string,
  });
  return res.send({
    id: req.params.channelId,
    name: req.query.name,
  });
};

export default controller;
