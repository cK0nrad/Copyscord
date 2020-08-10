import { Request, Response } from "express";
import { unauthorized, isAuthorized, users } from "../../../util";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const [serverList] = await users.aggregate([
    { $match: { _id: authorization._id } },
    { $unwind: { path: "$server", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "serverList",
        localField: "server",
        foreignField: "_id",
        as: "serverList",
      },
    },
    { $unwind: "$serverList" },
    {
      $group: {
        _id: 0,
        servers: {
          $push: {
            id: "$serverList._id",
            name: "$serverList.name",
            logoUrl: "$serverList.logoUrl",
          },
        },
      },
    },
  ]);

  if (!serverList) return res.status(404).send({ error: config.locale[9001], errorCode: 9001 });
  return res.send(serverList.servers);
};
export default controller;
