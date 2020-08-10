import { Request, Response } from "express";
import { unauthorized, isAuthorized, users } from "../../../util";
import imageType from "image-type";
import { readdirSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { v4 } from "uuid";
import * as sharp from "sharp";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.file) return res.status(400).send({ error: config.locale[12001], errorCode: 12001 });
  if (req.file.size > config.maxImageSize) return res.status(400).send({ error: config.locale[12002], errorCode: 12002 });

  let logo = req.file.buffer;
  if (!imageType(logo)) return res.status(400).send({ error: config.locale[12003], errorCode: 12003 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const logoUrl = v4();
  const userID = authorization._id.toString();
  if (!existsSync(__dirname + "/../../../../../logoDelivery/logo/" + userID))
    mkdirSync(__dirname + "/../../../../../logoDelivery/logo/" + userID);

  await sharp(logo)
    .resize(128, 128)
    .toFormat("png")
    .toFile(__dirname + "/../../../../../logoDelivery/logo/" + userID + "/" + logoUrl + ".png");

  readdirSync(__dirname + "/../../../../../logoDelivery/logo/" + userID).forEach((file) => {
    if (file !== logoUrl + ".png") unlinkSync(__dirname + "/../../../../../logoDelivery/logo/" + userID + "/" + file);
  });

  let userUpdate = await users.update(
    { _id: authorization._id },
    { $set: { logoUrl: "/logo/" + userID + "/" + logoUrl + ".png" } }
  );

  if (!userUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  SocketEventEmitter.emit("updateUser", {
    userID: authorization._id.toString(),
    logoUrl: "/logo/" + userID + "/" + logoUrl + ".png",
    serverList: authorization.server.concat(authorization.friend),
  });
  return res.send({
    logoUrl: "/logo/" + userID + "/" + logoUrl + ".png",
  });
};

export default controller;
