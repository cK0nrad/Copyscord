import { Request, Response } from "express";
import { unauthorized, isAuthorized } from "../../../util";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  return res.send({ dmFromEveryone: authorization.dmFromEveryone });
};

export default controller;
