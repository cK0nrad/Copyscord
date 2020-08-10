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
    const LongServerID = mongodb_1.Long.fromString(req.params.id);
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!(await util_1.isAdmin(authorization._id, LongServerID)))
        return util_1.unauthorized(res);
    const [inviteList] = await util_1.server.aggregate([
        {
            $match: { _id: LongServerID },
        },
        { $unwind: "$invite" },
        {
            $lookup: {
                from: "users",
                localField: "invite.author",
                foreignField: "_id",
                as: "inviter",
            },
        },
        { $unwind: "$inviter" },
        {
            $group: {
                _id: 0,
                inviter: {
                    $push: {
                        invite: "$invite.invite",
                        id: "$inviter._id",
                        username: "$inviter.username",
                        userCode: "$inviter.userCode",
                        logoUrl: "$inviter.logoUrl",
                        date: "$invite.date",
                    },
                },
            },
        },
    ]);
    if (!inviteList)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    if (!inviteList.inviter)
        return res.send([]);
    return res.send(inviteList.inviter);
};
exports.default = controller;
