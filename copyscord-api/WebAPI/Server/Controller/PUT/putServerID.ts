import { Request, Response } from "express";
import { unauthorized, server, isAuthorized, isAdmin, checkID } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.name) return res.status(400).send({ error: config.locale[4005], errorCode: 4005 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);

  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  const serverUpdate = await server.findOneAndUpdate({ _id: longServerID }, { $set: { name: req.query.name } });

  if (!serverUpdate) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  let members = [];
  serverUpdate.members.forEach((x) => members.push(x.id));

  SocketEventEmitter.emit("updateServer", {
    serverID: req.params.id,
    name: req.query.name as string,
    logoUrl: "",
    members,
  });
  return res.send({ id: req.params.id, name: req.query.name });
};
export default controller;
