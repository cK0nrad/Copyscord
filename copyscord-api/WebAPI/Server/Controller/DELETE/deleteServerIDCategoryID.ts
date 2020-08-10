import { Request, Response } from "express";
import { unauthorized, isAuthorized, checkID, memberOfServer, server, isAdmin } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.categoryId)) return res.status(400).send({ error: config.locale[7001], errorCode: 7001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  const longCategoryID = Long.fromString(req.params.categoryId);

  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  const serverUpdate = await server.update(
    {
      _id: longServerID,
      "channels.categoryId": longCategoryID,
    },
    {
      $pull: {
        channels: {
          categoryId: longCategoryID,
        },
      },
    }
  );

  if (!serverUpdate.nModified) return res.status(404).send({ error: config.locale[7002], errorCode: 7002 });
  SocketEventEmitter.emit("deleteCategory", {
    serverID: req.params.id,
    categoryID: req.params.categoryId,
  });
  return res.send({
    id: req.params.categoryId,
  });
};
export default controller;
