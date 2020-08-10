import { Request, Response } from "express";
import { unauthorized, isAuthorized } from "../../../util";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  return res.send({
    id: authorization._id,
    username: authorization.username,
    userCode: authorization.userCode,
    status: authorization.status,
    logoUrl: authorization.logoUrl,
    email: authorization.email,
    dm: authorization.dmFromEveryone,
  });
};

export default controller;
