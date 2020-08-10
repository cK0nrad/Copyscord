import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, server, users, memberOfServer } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  if (!memberOfServer(authorization, longServerID)) return unauthorized(res);

  const serverUpdate = await server.findOneAndDelete({
    _id: longServerID,
    owner: authorization._id,
  });

  if (!serverUpdate) return unauthorized(res);
  let members = [];
  serverUpdate.members.forEach((x) => members.push(x.id));

  const usersUpdate = await users.findOneAndUpdate({ _id: { $in: members } }, { $pull: { server: serverUpdate._id } });
  if (!usersUpdate) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  SocketEventEmitter.emit("deleteServer", {
    serverID: req.params.id,
    members,
  });
  return res.send({ id: serverUpdate._id });
};
export default controller;
