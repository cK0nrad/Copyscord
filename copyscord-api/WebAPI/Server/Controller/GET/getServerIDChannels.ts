import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  //0: Text channel, 1: Voice channel, 2: all
  let channelType: number;
  if (!req.query.type) channelType = 2;
  else channelType = parseInt(req.query.type as string);

  if (channelType > 2 || channelType < 0) return res.status(400).send({ error: config.locale[3006], errorCode: 3006 });

  let query: object | number;
  if (channelType === 2) {
    query = { $in: [0, 1] };
  } else {
    query = channelType;
  }

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  const [channelList] = await server.aggregate([
    { $match: { _id: longServerID } },
    { $unwind: "$channels" },
    { $unwind: "$channels.channelsList" },
    { $match: { "channels.channelsList.type": query } },
    {
      $group: {
        _id: null,
        channels: {
          $push: {
            id: "$channels.channelsList.id",
            name: "$channels.channelsList.name",
            type: "$channels.channelsList.type",
          },
        },
      },
    },
  ]);

  if (!channelList) return res.status(404).send({ error: config.locale[3002], errorCode: 3002 });
  return res.send(channelList.channels);
};
export default controller;
