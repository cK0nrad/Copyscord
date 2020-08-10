import { Request, Response } from "express";
import { unauthorized, isAuthorized, users } from "../../../util";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.status) return res.status(400).send({ error: config.locale[10009], errorCode: 10009 });
  let statusInt = parseInt(req.query.status as string);
  if (statusInt > 3 || statusInt < 0) return res.status(400).send({ error: config.locale[10010], errorCode: 10010 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);
  if (authorization.status === statusInt) return res.send({ status: statusInt });

  let userUpdate = await users.update({ _id: authorization._id }, { $set: { status: statusInt } });
  if (!userUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  SocketEventEmitter.emit("updateUser", {
    userID: authorization._id.toString(),
    status: statusInt,
    serverList: authorization.server.concat(authorization.friend),
  });
  return res.send({ status: req.query.status });
};

export default controller;
