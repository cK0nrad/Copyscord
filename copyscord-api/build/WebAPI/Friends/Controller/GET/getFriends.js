"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    let [friendList] = await util_1.users.aggregate([
        { $match: { _id: authorization._id } },
        { $unwind: "$friend" },
        {
            $lookup: {
                from: "users",
                localField: "friend",
                foreignField: "_id",
                as: "userFriendList",
            },
        },
        { $unwind: "$userFriendList" },
        {
            $group: {
                _id: null,
                friend: {
                    $push: {
                        id: { $toString: "$userFriendList._id" },
                        name: "$userFriendList.username",
                        code: "$userFriendList.userCode",
                        logoUrl: "$userFriendList.logoUrl",
                        status: "$userFriendList.status",
                    },
                },
            },
        },
    ]);
    if (!friendList)
        return res.send([]);
    return res.send(friendList.friend);
};
exports.default = controller;
