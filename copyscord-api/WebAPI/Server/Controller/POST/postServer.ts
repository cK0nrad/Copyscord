import { Request, Response } from "express";
import { unauthorized, isAuthorized, server, users } from "../../../util";
import UniqueID from "../../../uniqueID";
import { Long } from "mongodb";
import config from "../../../../config";
import { createClient } from "redis";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.name) return res.status(400).send({ error: config.locale[4005], errorCode: 4005 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  let serverUniqueID = Long.fromString(BigInt("0b" + UniqueID.generate(config.serverID)).toString());

  await server.insert({
    _id: serverUniqueID,
    name: req.query.name,
    logoUrl: "default",
    owner: authorization._id,
    invite: [],
    members: [
      {
        id: authorization._id,
        role: 2,
      },
    ],
    channels: [
      {
        categoryName: "Default",
        categoryId: Long.fromString(BigInt("0b" + UniqueID.generate(config.serverID)).toString()),
        channelsList: [
          {
            name: "Default text",
            type: 0,
            id: Long.fromString(BigInt("0b" + UniqueID.generate(config.serverID)).toString()),
          },
          {
            name: "Default voice",
            type: 1,
            id: Long.fromString(BigInt("0b" + UniqueID.generate(config.serverID)).toString()),
          },
        ],
      },
    ],
    bans: [],
  });

  let userUpdated = await users.update({ _id: authorization._id }, { $push: { server: serverUniqueID } });
  if (!userUpdated.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  return res.send({
    id: serverUniqueID,
    serverName: req.query.name,
  });
};
export default controller;
