import { Request, Response } from "express";
import { unauthorized, isAuthorized, isUserExist, users } from "../../../util";
import { Long, Code } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  let removeFriend = async (token: string, usernameID: string, userCode?: number) => {
    const authorization = await isAuthorized(token);
    if (!authorization) return unauthorized(res);

    if (
      Object.is(usernameID, authorization._id.toString()) ||
      (usernameID === authorization.username && userCode === authorization.userCode)
    )
      return res.send({ error: config.locale[11005], errorCode: 11005 });

    //If theres is a userCode we check if the user string exist or we return a long from his id
    let [userFound, err] = await isUserExist(userCode ? usernameID : Long.fromString(usernameID), userCode);
    if (err) {
      if (err.errorCode === 5003) return res.send({ error: config.locale[11006], errorCode: 11006 });
      return res.send(err);
    }

    let [userInfo] = userFound;

    if (!authorization.friend.some((friendlist) => friendlist.equals(userInfo._id.toString())))
      return res.send({ error: config.locale[11006], errorCode: 11006 });

    let userSender = await users.update({ _id: authorization._id }, { $pull: { friend: userInfo._id } });
    if (!userSender.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

    let userReceiver = await users.update({ _id: userInfo._id }, { $pull: { friend: authorization._id } });
    if (!userReceiver.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

    return res.send({ friendShip: 0 });
  };

  if (req.query.userId) {
    return await removeFriend(req.headers.authorization, req.query.userId as string);
  } else if (req.query.username && req.query.userCode) {
    return await removeFriend(req.headers.authorization, req.query.username as string, parseInt(req.query.userCode as string));
  } else {
    return res.status(400).send({ error: config.locale[11001], errorCode: 11001 });
  }
};

export default controller;
