import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server, isAdmin } from "../../../util";
import { Long } from "mongodb";
import { Server } from "../../../interface";
import uniqueID from "../../../uniqueID";
import config from "../../../../config";
import { SocketEventEmitter } from "../../../../SocketServer/server";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.name) return res.status(400).send({ error: config.locale[7003], errorCode: 7003 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);

  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  //const currentServer: Server = await server.findOne({ _id: longServerID });

  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  let categoryID = Long.fromString(BigInt("0b" + uniqueID.generate(config.serverID)).toString());
  const serverUpdate = await server.update(
    { _id: longServerID },
    {
      $push: {
        channels: {
          categoryName: req.query.name,
          categoryId: categoryID,
          channelsList: [],
        },
      },
    }
  );

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("newCategory", {
    serverID: req.params.id,
    categoryID: categoryID.toString(),
    categoryName: req.query.name as string,
  });
  return res.send({
    id: categoryID,
    name: req.query.name,
  });
};
export default controller;
