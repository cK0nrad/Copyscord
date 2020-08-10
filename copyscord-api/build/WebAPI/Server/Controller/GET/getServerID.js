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
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    const [fetchedServer] = await util_1.server.aggregate([
        { $match: { _id: longServerID } },
        {
            $lookup: {
                from: "users",
                localField: "members.id",
                foreignField: "_id",
                as: "memberList",
            },
        },
        { $unwind: "$memberList" },
        {
            $addFields: {
                "memberList.role": { $arrayElemAt: ["$members.role", { $indexOfArray: ["$members.id", "$memberList._id"] }] },
            },
        },
        {
            $group: {
                _id: 0,
                id: { $first: "$_id" },
                name: { $first: "$name" },
                logoUrl: { $first: "$logoUrl" },
                channels: { $first: "$channels" },
                members: {
                    $push: {
                        id: "$memberList._id",
                        username: "$memberList.username",
                        userCode: "$memberList.userCode",
                        logoUrl: "$memberList.logoUrl",
                        role: "$memberList.role",
                        status: "$memberList.status",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    if (!fetchedServer || !fetchedServer.id)
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    return res.send(fetchedServer);
};
exports.default = controller;
