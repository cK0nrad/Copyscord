import { Request, Response } from "express";
import { checkID, isAuthorized, memberOfServer, server, messages, unauthorized } from "../../../util";
import { Long } from "mongodb";
import { Server, category, channelList } from "../../../interface";
import config from "../../../../config";

interface query {
  serverId: Long;
  channelId: Long;
  $expr?: Object;
}

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  let limit = 0;

  if (parseInt(req.query.limit as string) > 500) return res.status(400).send({ error: config.locale[6003], errorCode: 6003 });
  if (parseInt(req.query.limit as string) < 0) return res.status(400).send({ error: config.locale[6004], errorCode: 6004 });
  limit = !req.query.limit ? 50 : parseInt(req.query.limit as string);

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

  let query: query = {
    serverId: Long.fromString(req.params.id),
    channelId: Long.fromString(req.params.channelId),
  };

  if (req.query.from) {
    if (!checkID(req.query.from as string)) return res.status(400).send({ error: config.locale[5001], errorCode: 5001 });
    query.$expr = { $lt: ["$_id", Long.fromString(req.query.from as string)] };
  }

  let [fetchedMessages] = await messages.aggregate([
    { $match: query },
    { $sort: { _id: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "from",
      },
    },
    { $unwind: "$from" },
    {
      $group: {
        _id: 0,
        message: {
          $push: {
            id: "$_id",
            authorId: "$from._id",
            username: "$from.username",
            userCode: "$from.userCode",
            userLogo: "$from.logoUrl",
            channel: "$channelId",
            server: "$serverId",
            date: "$date",
            content: "$content",
          },
        },
      },
    },
  ]);

  if (!fetchedMessages) return res.send([]);
  return res.send(fetchedMessages.message);
};

export default controller;
