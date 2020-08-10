import { Request, Response } from "express";
import { unauthorized, users, isAuthorized } from "../../../util";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!authorization.dmList[0]) return res.send([]);

  let [dmList] = await users.aggregate([
    { $match: { _id: authorization._id } },
    { $unwind: "$dmList" },
    {
      $lookup: {
        from: "users",
        localField: "dmList.id",
        foreignField: "_id",
        as: "dmListLookup",
      },
    },
    { $unwind: "$dmListLookup" },
    {
      $group: {
        _id: 0,
        friends: {
          $push: {
            id: "$dmListLookup._id",
            name: "$dmListLookup.username",
            logoUrl: "$dmListLookup.logoUrl",
            status: "$dmListLookup.status",
            code: "$dmListLookup.userCode",
            lastMessage: "$dmList.lastMessage",
          },
        },
      },
    },
  ]);

  return res.send(dmList.friends);
};

export default controller;
