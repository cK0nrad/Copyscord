import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, isAdmin, server } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  const [banList] = await server.aggregate([
    { $match: { _id: longServerID } },
    {
      $lookup: {
        from: "users",
        localField: "bans.id",
        foreignField: "_id",
        as: "banList",
      },
    },
    { $unwind: "$banList" },
    {
      $lookup: {
        from: "users",
        localField: "bans.author",
        foreignField: "_id",
        as: "banner",
      },
    },
    { $unwind: "$banner" },
    {
      $group: {
        _id: null,
        bans: {
          $push: {
            banned: {
              id: "$banList._id",
              username: "$banList.username",
              userCode: "$banList.userCode",
              logoUrl: "$banList.logoUrl",
            },
            author: {
              id: "$banner._id",
              username: "$banner.username",
              userCode: "$banner.userCode",
              logoUrl: "$banner.logoUrl",
            },
          },
        },
      },
    },
  ]);
  if (!banList) return res.send([]);
  if (!banList.bans) return res.send([]);
  return res.send(banList.bans);
};
export default controller;
