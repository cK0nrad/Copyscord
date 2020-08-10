import { Request, Response } from "express";
import { unauthorized, isAuthorized, users } from "../../../util";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.dmFromEveryone) return res.status(400).send({ error: config.locale[10007], errorCode: 10007 });

  if (req.query.dmFromEveryone !== "false" && req.query.dmFromEveryone !== "true")
    return res.status(400).send({ error: config.locale[10008], errorCode: 10008 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (authorization.dmFromEveryone === (req.query.dmFromEveryone === "true"))
    return res.send({ dmFromEveryone: req.query.dmFromEveryone === "true" });

  let userUpdate = await users.findOneAndUpdate(
    { _id: authorization._id },
    { $set: { dmFromEveryone: req.query.dmFromEveryone === "true" } }
  );

  if (!userUpdate) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  return res.send({ dmFromEveryone: req.query.dmFromEveryone === "true" });
};

export default controller;
