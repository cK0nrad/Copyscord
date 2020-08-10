"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    const aggregateFriendServer = async (friendsList, serversList) => {
        let commonFriendAggregate = await util_1.users.aggregate([
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
        let commonServerAggregate = await util_1.server.aggregate([
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
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const userFound = await util_1.users.findOne({ _id: mongodb_1.Long.fromString(req.params.id) });
    if (!userFound)
        return util_1.unauthorized(res);
    //let commonServer = userFound.server.filter((element: Long) => authorization.server.some((x) => x.equals(element)));
    let userFoundServerSet = new Set();
    for (let i = 0; i < userFound.server.length; i++)
        userFoundServerSet.add(userFound.server[i].toString());
    let commonServer = authorization.server.filter((x) => userFoundServerSet.has(x.toString()));
    const areFriends = userFound.friend.some((x) => x.equals(authorization._id));
    if (!commonServer.length && !areFriends)
        return util_1.unauthorized(res);
    let userFoundFriendsSet = new Set();
    for (let i = 0; i < userFound.friend.length; i++)
        userFoundFriendsSet.add(userFound.friend[i].toString());
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
exports.default = controller;
