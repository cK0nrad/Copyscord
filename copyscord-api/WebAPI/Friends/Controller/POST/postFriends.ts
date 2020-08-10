import { Request, Response } from "express";
import { unauthorized, users, isAuthorized, checkUserCode, checkID } from "../../../util";
import { Long } from "mongodb";
import { Authorization } from "../../../interface";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  let mongoAddFriend = async (authorization: Authorization, usernameID: Long) => {
    //Prevent adding self to friend
    if (usernameID.equals(authorization._id)) return res.status(409).send({ error: config.locale[11002], errorCode: 11002 });

    //Prevent adding an already friend user [USERID]
    if (authorization.friend.some((friendlist) => friendlist.equals(usernameID)))
      return res.status(409).send({ error: config.locale[11003], errorCode: 11003 });

    //Prent sending twice an invite
    if (authorization.friendRequest.send.some((request) => request.equals(usernameID)))
      return res.status(409).send({ error: config.locale[11004], errorCode: 11004 });

    //If we add someone who sent us a request, we add him to friend, or just push request to user
    if (authorization.friendRequest.received.some((request) => request.equals(usernameID))) {
      let updatedSender = await users.update(
        { _id: authorization._id },
        {
          $pull: {
            "friendRequest.received": usernameID,
          },
          $push: {
            friend: usernameID,
          },
        }
      );
      if (!updatedSender.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
      let updatedReceiver = await users.update(
        { _id: usernameID },
        {
          $pull: {
            "friendRequest.send": authorization._id,
          },
          $push: {
            friend: authorization._id,
          },
        }
      );
      if (!updatedReceiver) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
      return res.send({ friendShip: 2 });
    } else {
      let updatedSender = await users.update(
        { _id: authorization._id },
        {
          $push: {
            "friendRequest.send": usernameID,
          },
        }
      );
      if (!updatedSender.nModified) return res.status(404).send({ error: config.locale[5003], errorCode: 5003 });
      let updatedReceiver = await users.update(
        { _id: usernameID },
        {
          $push: {
            "friendRequest.received": authorization._id,
          },
        }
      );
      if (!updatedReceiver.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
      return res.send({ friendShip: 1 });
    }
  };

  let addFriend = async (token: string, usernameID: string, code?: number) => {
    const authorization = await isAuthorized(token);
    if (!authorization) return unauthorized(res);
    if (code) {
      if (!checkUserCode(code)) return res.status(400).send({ error: config.locale[5002], errorCode: 5002 });
      let foundUser = await users.findOne({ username: usernameID, userCode: code });
      if (!foundUser) return res.status(404).send({ error: config.locale[5003], errorCode: 5003 });
      return await mongoAddFriend(authorization, foundUser._id);
    } else {
      if (!checkID(usernameID)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });

      return await mongoAddFriend(authorization, Long.fromString(usernameID));
    }
  };

  if (req.query.userId) {
    return await addFriend(req.headers.authorization, req.query.userId as string);
  } else if (req.query.username && req.query.userCode) {
    return await addFriend(req.headers.authorization, req.query.username as string, parseInt(req.query.userCode as string));
  } else {
    return res.status(400).send({ error: config.locale[11001], errorCode: 11001 });
  }
};

export default controller;
