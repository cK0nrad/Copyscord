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
    if (!util_1.checkID(req.params.userId))
        return res.status(400).send({ error: config_1.default.locale[5001], errorCode: 5001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    const [memberFound] = await util_1.server.aggregate([
        { $match: { _id: longServerID } },
        { $unwind: "$members" },
        { $match: { "members.id": mongodb_1.Long.fromString(req.params.userId) } },
        {
            $lookup: {
                from: "users",
                localField: "members.id",
                foreignField: "_id",
                as: "membersFetch",
            },
        },
        { $unwind: "$membersFetch" },
        {
            $group: {
                _id: null,
                members: {
                    $push: {
                        id: "$membersFetch._id",
                        username: "$membersFetch.username",
                        userCode: "$membersFetch.userCode",
                        logoUrl: "$membersFetch.logoUrl",
                        role: "$members.role",
                    },
                },
            },
        },
    ]);
    if (!memberFound)
        return res.status(404).send({ error: config_1.default.locale[5003], errorCode: 5003 });
    return res.send(memberFound.members[0]);
};
exports.default = controller;
