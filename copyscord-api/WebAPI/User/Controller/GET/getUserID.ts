import { Request, Response } from "express";
import { unauthorized, checkID, users, server, isAuthorized } from "../../../util";
import { Long } from "mongodb";
import { Authorization } from "../../../interface";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });


  const aggregateFriendServer = async (friendsList: Array<Long>, serversList: Array<Long>): Promise<Array<any>> => {
    let commonFriendAggregate = await users.aggregate([
      { $match: { _id: { $in: friendsList } } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          username: 1,
          userCode: 1,
          logoUrl: 1,
          status: 1,
        },
      },
    ]);

    let commonServerAggregate = await server.aggregate([
      { $match: { _id: { $in: serversList } } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          logoUrl: 1,
        },
      },
    ]);
    return [commonFriendAggregate, commonServerAggregate];
  };

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const userFound: Authorization = await users.findOne({ _id: Long.fromString(req.params.id) });
  if (!userFound) return unauthorized(res);

  //let commonServer = userFound.server.filter((element: Long) => authorization.server.some((x) => x.equals(element)));
  let userFoundServerSet = new Set();
  for (let i = 0; i < userFound.server.length; i++) userFoundServerSet.add(userFound.server[i].toString());
  let commonServer = authorization.server.filter((x) => userFoundServerSet.has(x.toString()));

  const areFriends = userFound.friend.some((x) => x.equals(authorization._id));

  if (!commonServer.length && !areFriends) return unauthorized(res);

  let userFoundFriendsSet = new Set();
  for (let i = 0; i < userFound.friend.length; i++) userFoundFriendsSet.add(userFound.friend[i].toString());
  let commonFriends = authorization.friend.filter((x) => userFoundFriendsSet.has(x.toString()));
  /* let commonFriends = userFound.friend.filter(
    (element) =>
      authorization[1].friend.some((x) => Object.is(x.toString(), element.toString())) &&
      !Object.is(element.toString(), authorization[1]._id.toString())
  );*/

  const [aggregatedCommonFriends, aggregatedCommonServer] = await aggregateFriendServer(commonFriends, commonServer);

  return res.send({
    id: userFound._id,
    username: userFound.username,
    userCode: userFound.userCode,
    logoUrl: userFound.logoUrl,
    areFriends: areFriends,
    friendRequested: userFound.friendRequest.received.some((x) => x.equals(authorization._id)),
    commonFriends: aggregatedCommonFriends,
    commonServers: aggregatedCommonServer,
  });
};
export default controller;
