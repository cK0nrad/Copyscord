import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });

  let authorization = await isAuthorized(req.headers.authorization);

  if (!authorization) return unauthorized(res);
  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  let [serverInstace] = await server.aggregate([
    {
      $match: { _id: Long.fromString(req.params.id) },
    },
    {
      $unwind: "$channels",
    },
    {
      $unwind: "$channels.channelsList",
    },
    {
      $match: { "channels.channelsList.id": Long.fromString(req.params.channelId) },
    },
    {
      $group: {
        _id: null,
        channel: {
          $push: {
            id: "$channels.channelsList.id",
            name: "$channels.channelsList.name",
            type: "$channels.channelsList.type",
          },
        },
      },
    },
  ]);

  if (!serverInstace) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!serverInstace.channel) return res.status(404).send({ error: config.locale[3002], errorCode: 3002 });
  return res.send(serverInstace.channel[0]);
};

export default controller;
