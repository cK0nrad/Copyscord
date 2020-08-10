import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server, isAdmin } from "../../../util";
import { Long } from "mongodb";
import uniqueID from "../../../uniqueID";
import config from "../../../../config";
import { SocketEventEmitter } from "../../../../SocketServer/server";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.name || !req.query.type) return res.status(400).send({ error: config.locale[3004], errorCode: 3004 });

  let type: number = parseInt(req.query.type as string);

  if (type !== 1 && type !== 0) return res.status(400).send({ error: config.locale[3005], errorCode: 3005 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.categoryId)) return res.status(400).send({ error: config.locale[7001], errorCode: 7001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);

  if (!memberOfServer(authorization, longServerID)) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  let serverUniqueID = Long.fromString(BigInt("0b" + uniqueID.generate(config.serverID)).toString());
  const serverUpdate = await server.update(
    {
      _id: longServerID,
      "channels.categoryId": Long.fromString(req.params.categoryId),
    },
    {
      $push: {
        "channels.$.channelsList": {
          id: serverUniqueID,
          name: req.query.name,
          type: type,
        },
      },
    }
  );

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("newChannel", {
    serverID: req.params.id,
    categoryID: req.params.categoryId,
    channelID: serverUniqueID.toString(),
    channelName: req.query.name as string,
    type,
  });
  return res.send({
    id: serverUniqueID,
    name: req.query.name,
    type: type,
  });
};
export default controller;
