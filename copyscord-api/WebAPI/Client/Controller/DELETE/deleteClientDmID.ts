import { Request, Response } from "express";
import { unauthorized, isAuthorized, users, checkID } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longUserID = Long.fromString(req.params.id);

  if (!authorization.dmList.some((userID) => userID.id.equals(longUserID)))
    return res.status(404).send({ error: config.locale[5003], errorCode: 5003 });

  let userUpdate = await users.update({ _id: authorization._id }, { $pull: { dmList: { id: longUserID } } });

  if (!userUpdate.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  return res.send({ id: req.params.id });
};

export default controller;
