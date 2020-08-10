import { Request, Response } from "express";
import { unauthorized, isAuthorized, isUserExist, users, dm } from "../../../util";
import { Long } from "mongodb";
import { dmList } from "../../../interface";
import config from "../../../../config";
import UniqueID from "../../../uniqueID";
import { SocketEventEmitter } from "../../../../SocketServer/server";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!req.query.content) return res.status(400).send({ error: config.locale[6005], errorCode: 6005 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);
  if (authorization._id.equals(Long.fromString(req.params.id)))
    return res.status(409).send({ error: config.locale[6006], errorCode: 6006 });

  const [user, err] = await isUserExist(Long.fromString(req.params.id));
  if (err) return res.status(400).send(err);
  if (!user.dmFromEveryone && !user.friend.some((friend: Long) => authorization._id.equals(friend)))
    return res.status(404).send({ error: config.locale[5003], errorCode: 5003 });

  let messageID = BigInt("0b" + UniqueID.generate(config.serverID)).toString();

  if (!user.dmList[0] || !user.dmList.some((user: dmList) => user.id.equals(authorization._id))) {
    users.findOneAndUpdate({ _id: user._id }, { $push: { dmList: { id: authorization._id, lastMessage: Date.now() } } });
  } else {
    users.update(
      { _id: user._id },
      { $set: { "dmList.$[a].lastMessage": Date.now() } },
      { arrayFilters: [{ "a.id": authorization._id }] }
    );
  }

  if (!authorization.dmList[0] || !authorization.dmList.some((dude: dmList) => dude.id.equals(user._id))) {
    users.findOneAndUpdate({ _id: authorization._id }, { $push: { dmList: { id: user._id, lastMessage: Date.now() } } });
  } else {
    users.update(
      { _id: authorization._id },
      { $set: { "dmList.$[a].lastMessage": Date.now() } },
      { arrayFilters: [{ "a.id": user._id }] }
    );
  }
  let date = Date.now();
  let newMessage = await dm.insert({
    _id: Long.fromString(messageID),
    fromId: authorization._id,
    toId: user._id,
    content: req.query.content,
    date: date,
  });

  if (!newMessage) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  SocketEventEmitter.emit("newDM", {
    serverID: "@me",
    channelID: user._id.toString(),
    messageID,
    content: req.query.content as string,
    authorID: authorization._id.toString(),
    authorName: authorization.username,
    authorLogo: authorization.logoUrl,
    authorCode: authorization.userCode,
    authorStatus: authorization.status,
    date,
  });
  return res.send({
    id: messageID,
    from: authorization._id,
    to: user._id,
    content: req.query.content,
    date: date,
  });
};

export default controller;
