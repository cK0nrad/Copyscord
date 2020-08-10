import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.userId)) return res.status(400).send({ error: config.locale[5001], errorCode: 5001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  const [memberFound] = await server.aggregate([
    { $match: { _id: longServerID } },
    { $unwind: "$members" },
    { $match: { "members.id": Long.fromString(req.params.userId) } },
    {
      $lookup: {
        from: "users",
        localField: "members.id",
        foreignField: "_id",
        as: "membersFetch",
      },
    },
    { $unwind: "$membersFetch" },
    {
      $group: {
        _id: null,
        members: {
          $push: {
            id: "$membersFetch._id",
            username: "$membersFetch.username",
            userCode: "$membersFetch.userCode",
            logoUrl: "$membersFetch.logoUrl",
            role: "$members.role",
          },
        },
      },
    },
  ]);

  if (!memberFound) return res.status(404).send({ error: config.locale[5003], errorCode: 5003 });
  return res.send(memberFound.members[0]);
};
export default controller;
