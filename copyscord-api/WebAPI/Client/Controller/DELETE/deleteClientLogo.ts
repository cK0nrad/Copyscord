import { Request, Response } from "express";
import { unauthorized, isAuthorized, users } from "../../../util";
import { readdirSync, unlinkSync } from "fs";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  readdirSync(__dirname + "/../../../../../logoDelivery/logo/" + authorization._id).forEach((file) => {
    unlinkSync(__dirname + "/../../../../../logoDelivery/logo/" + authorization._id + "/" + file);
  });

  let userUpdate = await users.update({ _id: authorization._id }, { $set: { logoUrl: "/logo/default.png" } });
  if (!userUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  SocketEventEmitter.emit("updateUser", {
    userID: authorization._id.toString(),
    logoUrl: "/logo/default.png",
    serverList: authorization.server.concat(authorization.friend),
  });
  return res.send({
    logoUrl: "/logo/default.png",
  });
};

export default controller;
