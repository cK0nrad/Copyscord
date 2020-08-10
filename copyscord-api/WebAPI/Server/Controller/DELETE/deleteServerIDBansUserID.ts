import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, isAdmin, server, isBan } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.userId)) return res.status(400).send({ error: config.locale[5001], errorCode: 5001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longUserID = Long.fromString(req.params.userId);
  const longServerID = Long.fromString(req.params.id);
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);

  const { bans, owner } = await server.findOne({ _id: longServerID });
  if (!owner) return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });
  if (owner === req.params.userId) res.status(400).send({ error: config.locale[4007], errorCode: 4007 });

  if (!isBan(bans, longUserID)) return res.status(400).send({ error: config.locale[4008], errorCode: 4008 });
  const serverUpdate = await server.update({ _id: longServerID }, { $pull: { bans: { id: longUserID } } });

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  return res.send({ id: req.params.userId });
};
export default controller;
