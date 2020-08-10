import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, isAdmin, server } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const LongServerID = Long.fromString(req.params.id);

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);
  if (!(await isAdmin(authorization._id, LongServerID))) return unauthorized(res);

  const [inviteList] = await server.aggregate([
    {
      $match: { _id: LongServerID },
    },
    { $unwind: "$invite" },
    {
      $lookup: {
        from: "users",
        localField: "invite.author",
        foreignField: "_id",
        as: "inviter",
      },
    },
    { $unwind: "$inviter" },
    {
      $group: {
        _id: 0,
        inviter: {
          $push: {
            invite: "$invite.invite",
            id: "$inviter._id",
            username: "$inviter.username",
            userCode: "$inviter.userCode",
            logoUrl: "$inviter.logoUrl",
            date: "$invite.date",
          },
        },
      },
    },
  ]);

  if (!inviteList) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  if (!inviteList.inviter) return res.send([]);
  return res.send(inviteList.inviter);
};
export default controller;
