import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, isAdmin, server } from "../../../util";
import imageType from "image-type";
import * as sharp from "sharp";
import { readdirSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { v4 } from "uuid";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.file) return res.status(400).send({ error: config.locale[12001], errorCode: 12001 });
  if (req.file.size > config.maxImageSize) return res.status(400).send({ error: config.locale[12002], errorCode: 12002 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  let logo = req.file.buffer;
  if (!imageType(logo)) return res.status(400).send({ error: config.locale[12003], errorCode: 12003 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  let logoUrl = v4();
  if (!existsSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id))
    mkdirSync(__dirname + "/../../../../../logoDelivery" + req.params.id);

  await sharp(logo)
    .resize(128, 128)
    .toFormat("png")
    .toFile(__dirname + "/../../../../../logoDelivery/server/" + req.params.id + "/" + logoUrl + ".png");

  readdirSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id).forEach((file) => {
    if (file !== logoUrl + ".png") unlinkSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id + "/" + file);
  });

  const serverUpdate = await server.findOneAndUpdate(
    { _id: longServerID },
    { $set: { logoUrl: "/server/" + req.params.id + "/" + logoUrl + ".png" } }
  );

  if (!serverUpdate) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  let members = [];
  serverUpdate.members.forEach((x) => members.push(x.id));

  SocketEventEmitter.emit("updateServer", {
    serverID: req.params.id,
    name: req.query.name as string,
    logoUrl: "/server/" + req.params.id + "/" + logoUrl + ".png",
    members,
  });
  return res.send({
    logoUrl: "/server/" + req.params.id + "/" + logoUrl + ".png",
  });
};
export default controller;
