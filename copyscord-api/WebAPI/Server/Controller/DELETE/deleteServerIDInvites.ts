import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, isAdmin, invites, server } from "../../../util";
import { Long } from "mongodb";
import { Invite } from "../../../interface";
import config from "../../../../config";

interface query {
  invite: string;
  server: Long;
  author?: Long;
}

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.invite) return res.status(400).send({ error: config.locale[9002], errorCode: 9002 });

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  let query: query;

  query = { invite: req.query.invite as string, server: longServerID };

  if (!(await isAdmin(authorization._id, longServerID))) {
    query.author = authorization._id;
  }

  const currentInvite = (await invites.findOne(query)) as Invite;
  if (!currentInvite) return res.status(404).send({ error: config.locale[9001], errorCode: 9001 });

  const serverUpdate = await server.update({ _id: longServerID }, { $pull: { invite: { invite: req.query.invite } } });
  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  const inviteUpdate = await invites.update({ invite: req.query.invite }, { $set: { unavailable: true } });
  if (!inviteUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  return res.send({ invite: req.query.invite });
};
export default controller;
