import { Request, Response } from "express";
import { users, unauthorized } from "../../../util";
import config from "../../../../config";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Authorization } from "../../../interface";

const authorize = async (req: Request, res: Response) => {
  if (!req.query.email || !req.query.password) return unauthorized(res);

  let currentUser: Authorization | null = await users.findOne({ email: req.query.email });
  if (!currentUser) return unauthorized(res);

  if (await compare(req.query.password, currentUser.password))
    return res.send({ loginToken: sign({ id: currentUser._id }, config.secretSalt) });

  return unauthorized(res);
};

export default authorize;
