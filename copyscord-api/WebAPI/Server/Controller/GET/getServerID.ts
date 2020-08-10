import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);

  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  const [fetchedServer] = await server.aggregate([
    { $match: { _id: longServerID } },
    {
      $lookup: {
        from: "users",
        localField: "members.id",
        foreignField: "_id",
        as: "memberList",
      },
    },

    { $unwind: "$memberList" },
    {
      $addFields: {
        "memberList.role": { $arrayElemAt: ["$members.role", { $indexOfArray: ["$members.id", "$memberList._id"] }] },
      },
    },
    {
      $group: {
        _id: 0,
        id: { $first: "$_id" },
        name: { $first: "$name" },
        logoUrl: { $first: "$logoUrl" },
        channels: { $first: "$channels" },
        members: {
          $push: {
            id: "$memberList._id",
            username: "$memberList.username",
            userCode: "$memberList.userCode",
            logoUrl: "$memberList.logoUrl",
            role: "$memberList.role",
            status: "$memberList.status",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  if (!fetchedServer || !fetchedServer.id) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  return res.send(fetchedServer);
};
export default controller;
