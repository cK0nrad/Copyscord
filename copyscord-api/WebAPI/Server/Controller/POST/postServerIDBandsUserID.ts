import { Request, Response } from "express";
import { unauthorized, memberOfServer, checkID, isAuthorized, isAdmin, server, users } from "../../../util";
import { Long } from "mongodb";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.userId)) return res.status(400).send({ error: config.locale[5001], errorCode: 5001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longServerID = Long.fromString(req.params.id);
  const longUserID = Long.fromString(req.params.userId);

  if (!memberOfServer(authorization, longServerID)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });
  if (!(await isAdmin(authorization._id, longServerID))) return unauthorized(res);
  if (await isAdmin(longUserID, longServerID)) return unauthorized(res);

  const serverUpdate = await server.update(
    { _id: longServerID },
    {
      $pull: { members: { id: longUserID } },
      $push: {
        bans: {
          id: longUserID,
          author: authorization._id,
        },
      },
    }
  );

  if (!serverUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  const { _id: id, username, userCode } = await users.findOneAndUpdate({ _id: longUserID }, { $pull: { server: longServerID } });

  if (!id) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("deleteUser", {
    serverID: req.params.id,
    userID: id.toString(),
  });
  return res.send({ id, username, userCode });
};
export default controller;
