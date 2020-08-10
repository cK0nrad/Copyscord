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
  const [categoryList] = await server.aggregate([
    { $match: { _id: longServerID } },
    { $unwind: "$channels" },
    {
      $group: {
        _id: "$_id",
        category: {
          $push: {
            id: "$channels.categoryId",
            name: "$channels.categoryName",
          },
        },
      },
    },
  ]);

  if (!categoryList) return res.status(404).send({ error: config.locale[7002], errorCode: 7002 });
  return res.send(categoryList.category);
};
export default controller;
