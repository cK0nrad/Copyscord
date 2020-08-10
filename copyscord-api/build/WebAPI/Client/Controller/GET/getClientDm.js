"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!authorization.dmList[0])
        return res.send([]);
    let [dmList] = await util_1.users.aggregate([
        { $match: { _id: authorization._id } },
        { $unwind: "$dmList" },
        {
            $lookup: {
                from: "users",
                localField: "dmList.id",
                foreignField: "_id",
                as: "dmListLookup",
            },
        },
        { $unwind: "$dmListLookup" },
        {
            $group: {
                _id: 0,
                friends: {
                    $push: {
                        id: "$dmListLookup._id",
                        name: "$dmListLookup.username",
                        logoUrl: "$dmListLookup.logoUrl",
                        status: "$dmListLookup.status",
                        code: "$dmListLookup.userCode",
                        lastMessage: "$dmList.lastMessage",
                    },
                },
            },
        },
    ]);
    return res.send(dmList.friends);
};
exports.default = controller;
