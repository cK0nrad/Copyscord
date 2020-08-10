import { Request, Response } from "express";
import { unauthorized, isUserExist, checkID, isAuthorized } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longParamsID = Long.fromString(req.params.id);

  if (authorization._id.equals(longParamsID)) {
    return res.send({
      id: authorization._id,
      username: authorization.username,
      userCode: authorization.userCode,
      logoUrl: authorization.logoUrl,
      status: authorization.status,
    });
  } else {
    if (!authorization.friend.some((x) => x.equals(longParamsID)))
      return res.send({ error: config.locale[11006], errorCode: 11006 });
    const [userFound, err] = await isUserExist(req.params.id);
    if (err) {
      if (err.errorCode === 5003) return res.send({ error: config.locale[11006], errorCode: 11006 });
      return res.send(err);
    }
    return res.send({
      id: userFound._id,
      username: userFound.username,
      userCode: userFound.userCode,
      logoUrl: userFound.logoUrl,
      status: userFound.status,
    });
  }
};

export default controller;
