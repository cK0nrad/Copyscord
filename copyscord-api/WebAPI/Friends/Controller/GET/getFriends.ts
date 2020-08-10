import { Request, Response } from "express";
import { unauthorized, users, isAuthorized } from "../../../util";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);
  let [friendList] = await users.aggregate([
    { $match: { _id: authorization._id } },
    { $unwind: "$friend" },
    {
      $lookup: {
        from: "users",
        localField: "friend",
        foreignField: "_id",
        as: "userFriendList",
      },
    },
    { $unwind: "$userFriendList" },
    {
      $group: {
        _id: null,
        friend: {
          $push: {
            id: { $toString: "$userFriendList._id" },
            name: "$userFriendList.username",
            code: "$userFriendList.userCode",
            logoUrl: "$userFriendList.logoUrl",
            status: "$userFriendList.status",
          },
        },
      },
    },
  ]);

  if (!friendList) return res.send([]);
  return res.send(friendList.friend);
};

export default controller;
