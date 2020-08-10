import { Request, Response } from "express";
import { unauthorized, isAuthorized, invites, server, users, memberOfServer } from "../../../util";
import config from "../../../../config";
import { Server } from "../../../interface";
import { SocketEventEmitter } from "../../../../SocketServer/server";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.invitation) return res.status(400).send({ error: config.locale[9002], errorCode: 9002 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (authorization.server.length >= config.maxServerPerUser)
    return res.status(403).send({ error: config.locale[9003], errorCode: 9003 });

  const inviteFound = await invites.findOne({ invite: req.query.invitation });
  if (!inviteFound || inviteFound.unavailable) return res.status(404).send({ error: config.locale[9001], errorCode: 9001 });

  const currentServer: Server = await server.findOne({ _id: inviteFound.server });
  if (!currentServer) return res.status(404).send({ error: config.locale[9001], errorCode: 9001 });

  if (currentServer.bans.some((x) => x.id.equals(authorization._id)))
    return res.status(400).send({ error: config.locale[4003], errorCode: 4003 });

  if (memberOfServer(authorization, currentServer._id))
    return res.status(400).send({ error: config.locale[4004], errorCode: 4004 });

  const serverUpdate = await server.update(
    { _id: currentServer._id },
    { $push: { members: { id: authorization._id, role: 0 } } }
  );

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  const userUpdate = await users.update({ _id: authorization._id }, { $push: { server: currentServer._id } });
  if (!userUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  SocketEventEmitter.emit("newUser", {
    serverID: currentServer._id.toString(),
    userID: authorization._id.toString(),
    username: authorization.username,
    userCode: authorization.userCode,
    logoUrl: authorization.logoUrl,
    status: authorization.status,
  });
  return res.send({ serverName: currentServer.name, logoUrl: currentServer.logoUrl, id: currentServer._id });
};
export default controller;
