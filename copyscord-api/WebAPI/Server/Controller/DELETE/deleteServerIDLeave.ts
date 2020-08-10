import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, isOwner, server, users } from "../../../util";
import { Long } from "mongodb";
import { Server } from "../../../interface";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(400).send({ error: config.locale[4010], errorCode: 4010 });

  const owner = await isOwner(authorization._id, Long.fromString(req.params.id));
  if (owner) return res.status(400).send({ error: config.locale[4009], errorCode: 4009 });

  const serverUpdate: Server = await server.findOneAndUpdate(
    { _id: Long.fromString(req.params.id) },
    { $pull: { members: { id: authorization._id } } }
  );
  if (!serverUpdate) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  const userUpdate = await users.update({ _id: authorization._id }, { $pull: { server: serverUpdate._id } });
  if (!userUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("deleteUser", {
    serverID: req.params.id,
    userID: authorization._id.toString(),
  });
  return res.send({ serverName: serverUpdate.name });
};
export default controller;
