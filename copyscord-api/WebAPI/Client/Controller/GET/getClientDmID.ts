import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, dm } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  let limit = 50;
  if (req.query.limit) limit = parseInt(req.query.limit as string);

  if (limit > config.maxMessagePerFetch) return res.status(400).send({ error: config.locale[6003], errorCode: 6003 });
  if (limit < 0) return res.status(400).send({ error: config.locale[6004], errorCode: 6004 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  let query = {
    fromId: {
      $in: [authorization._id, Long.fromString(req.params.id)],
    },
    toId: {
      $in: [authorization._id, Long.fromString(req.params.id)],
    },
  };

  if (req.query.from) {
    if (!checkID(req.params.from as string)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });
    query["$expr"] = { $lt: ["$_id", Long.fromString(req.query.from as string)] };
  }

  let [messages] = await dm.aggregate([
    { $match: query },
    { $sort: { _id: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "fromId",
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
            date: "$date",
            content: "$content",
          },
        },
      },
    },
  ]);

  if (!messages) return res.send([]);
  return res.send(messages.message);
};

export default controller;
