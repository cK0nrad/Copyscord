import { Request, Response } from "express";
import { unauthorized, isAuthorized, usernameList, users, usernameCode } from "../../../util";
import { compareSync, hashSync } from "bcrypt";
import { SocketEventEmitter } from "../../../../SocketServer/server";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.password) return res.status(400).send({ error: config.locale[10001], errorCode: 10001 });
  if (!req.query.username && !req.query.newpassword && !req.query.username && !req.query.email)
    return res.status(400).send({ error: config.locale[10002], errorCode: 10002 });

  if (req.query.username && req.query.username.length > config.maxUsernameLength)
    return res.status(400).send({ error: config.locale[10003], errorCode: 10003 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (authorization.username === req.query.username && !req.query.newpassword && !req.query.email)
    return res.status(409).send({ error: config.locale[10004], errorCode: 10004 });

  let update = {};
  if (req.query.email) {
    if (await users.findOne({ email: req.query.email }))
      return res.status(400).send({ error: config.locale[10005], errorCode: 10005 });
    update["email"] = req.query.email;
  }

  if (req.query.newpassword) {
    if (!compareSync(req.query.password, authorization.password))
      return res.status(401).send({ error: config.locale[10006], errorCode: 10006 });
    update["password"] = hashSync(req.query.newpassword, 10);
  }

  if (req.query.username) {
    if (!compareSync(req.query.password, authorization.password)) return unauthorized(res);

    update["username"] = req.query.username;
    //userCode: [0]: ?avaible, [1]: new userCode, [2]: need to be created
    let [avaible, userCode, create] = await usernameCode(req.query.username as string);

    if (!avaible) return res.status(409).send({ error: config.locale[5009], errorCode: 5009 });

    if (create) {
      await usernameList.insert({ username: req.query.username, pool: [userCode] });
    } else {
      await usernameList.update({ username: req.query.username }, { $push: { pool: userCode } });
    }

    await usernameList.update({ username: authorization.username }, { $pull: { pool: authorization.userCode } });
    update["userCode"] = userCode;
  }

  let updatedUser = await users.update(
    { _id: authorization._id },
    {
      $set: update,
    }
  );

  if (!updatedUser.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  let response = {
    username: authorization.username,
    updated: true,
  };

  if (req.query.username) {
    response["userCode"] = update["userCode"];
    SocketEventEmitter.emit("updateUser", {
      userID: authorization._id.toString(),
      username: (req.query.username as string) || authorization.username,
      userCode: update["userCode"] || authorization.userCode,
      logoUrl: authorization.logoUrl,
      status: authorization.status,
      serverList: authorization.server.concat(authorization.friend),
    });
  }

  return res.send(response);
};

export default controller;
