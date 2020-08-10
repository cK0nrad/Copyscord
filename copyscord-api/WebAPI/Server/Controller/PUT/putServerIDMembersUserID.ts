import { Request, Response } from "express";
import { unauthorized, isAuthorized, checkID, memberOfServer, isAdmin, isOwner, server } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.role) return res.status(400).send({ error: config.locale[5010], errorCode: 5010 });

  let role: number = parseInt(req.query.role as string);
  if (1 < role || 0 > role || isNaN(role)) return res.status(400).send({ error: config.locale[5011], errorCode: 5011 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.userId)) return res.status(400).send({ error: config.locale[5001], errorCode: 5001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  const longUserID = Long.fromString(req.params.userId);

  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);
  if (await isOwner(longUserID, longServerID)) return unauthorized(res);

  const serverUpdate = await server.update(
    { _id: Long.fromString(req.params.id) },
    {
      $set: {
        "members.$[a].role": role,
      },
    },
    {
      arrayFilters: [
        {
          "a.id": longUserID,
        },
      ],
    }
  );

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("updateUser", {
    userID: req.params.userId,
    role,
    serverID: req.params.id,
  });
  return res.send({ id: req.params.userId, role: req.query.role });
};
export default controller;
