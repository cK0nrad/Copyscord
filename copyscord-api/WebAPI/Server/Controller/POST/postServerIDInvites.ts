import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server, generateInvitation, invites } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";
import { Server } from "../../../interface";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);

  if (!memberOfServer(authorization, longServerID)) return unauthorized(res);

  const { invite: serverInvite } = (await server.findOne({ _id: longServerID })) as Server;
  if (serverInvite.length >= config.maxInvitePerServer)
    return res.status(403).send({ error: config.locale[9004], errorCode: 9004 });

  if (serverInvite.filter((x) => x.author.equals(authorization._id)).length >= config.maxInvitePerUser)
    return res.status(403).send({ error: config.locale[9005], errorCode: 9005 });

  const inviteLink = await generateInvitation();

  const newInvite = await invites.insert({
    invite: inviteLink,
    server: longServerID,
    author: authorization._id,
    date: Date.now(),
  });

  if (!newInvite) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  invites.findOneAndDelete({ unavailable: true });

  const serverUpdate = await server.update(
    { _id: longServerID },
    { $push: { invite: { invite: inviteLink, author: authorization._id, date: Date.now() } } }
  );

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  return res.send({ invite: inviteLink, date: Date.now() });
};
export default controller;
