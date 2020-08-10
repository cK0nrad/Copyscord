import { Long } from "mongodb";
import { Request, Response } from "express";
import { readdirSync, existsSync, unlinkSync } from "fs";
import { unauthorized, checkID, isAuthorized, memberOfServer, isAdmin, server } from "../../../util";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longUserID = Long.fromString(req.params.id);
  if (!memberOfServer(authorization, longUserID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!(await isAdmin(authorization._id, longUserID))) return unauthorized(res);

  if (existsSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id)) {
    readdirSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id).forEach((file) => {
      unlinkSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id + "/" + file);
    });
  }

  const serverUpdate = await server.findOneAndUpdate({ _id: longUserID }, { $set: { logoUrl: "default" } });
  if (!serverUpdate) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  let members = [];
  serverUpdate.members.forEach((x) => members.push(x.id));

  SocketEventEmitter.emit("updateServer", {
    serverID: req.params.id,
    name: "",
    logoUrl: "default",
    members,
  });
  return res.send({
    logoUrl: "default",
  });
};
export default controller;
