import { Request, Response } from "express";
import { unauthorized, checkEmail, usernameCode, usernameList, users } from "../../../util";
import config from "../../../../config";
import { Long } from "mongodb";
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import UniqueID from "../../../uniqueID";

const controller = async (req: Request, res: Response) => {
  if (!req.query.password || !req.query.username || !req.query.email)
    return res.status(400).send({ error: config.locale[5004], errorCode: 5004 });

  if (req.query.password.length < config.minPasswordLength)
    return res.status(400).send({ error: config.locale[5005], errorCode: 5005 });

  if (req.query.username.length < config.minUsernameLength)
    return res.status(400).send({ error: config.locale[5006], errorCode: 5006 });

  if (
    !/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
      req.query.email as string
    )
  )
    return res.status(400).send({ error: config.locale[5007], errorCode: 5007 });

  if (!(await checkEmail(req.query.email as string)))
    return res.status(409).send({ error: config.locale[5008], errorCode: 5008 });
  //userCode: [0]: ?avaible, [1]: new userCode, [2]: need to be created
  let [avaible, userCode, create] = await usernameCode(req.query.username as string);
  if (!avaible) return res.status(409).send({ error: config.locale[5009], errorCode: 5009 });

  if (create) {
    await usernameList.insert({ username: req.query.username, pool: [userCode] });
  } else {
    await usernameList.update({ username: req.query.username }, { $push: { pool: userCode } });
  }

  const hashedPassword = hashSync(req.query.newpassword, 10);

  const userID = BigInt("0b" + UniqueID.generate(config.serverID)).toString();

  users
    .insert({
      _id: Long.fromString(userID),
      status: 0,
      username: req.query.username,
      email: req.query.email,
      password: hashedPassword,
      userCode: userCode,
      friend: [],
      friendRequest: {
        send: [],
        received: [],
      },
      server: [],
      logoUrl: "/logo/default.png",
      dmList: [],
      dmFromEveryone: false,
    })
    .then((el) => {
      return res.send({
        id: userID,
        username: req.query.username,
        email: req.query.email,
        userCode: userCode,
        authorization: sign({ id: userID }, config.secretSalt),
      });
    });
};
export default controller;
