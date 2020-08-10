import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server } from "../../../util";
import { Server } from "../../../interface";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  if (!memberOfServer(authorization, longServerID)) return unauthorized(res);

  const { invite } = (await server.findOne({ _id: longServerID })) as Server;
  res.send(invite.filter((x) => x.author.equals(authorization._id)));
};
export default controller;
