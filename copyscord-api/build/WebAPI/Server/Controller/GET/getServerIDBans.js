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
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    const [banList] = await util_1.server.aggregate([
        { $match: { _id: longServerID } },
        {
            $lookup: {
                from: "users",
                localField: "bans.id",
                foreignField: "_id",
                as: "banList",
            },
        },
        { $unwind: "$banList" },
        {
            $lookup: {
                from: "users",
                localField: "bans.author",
                foreignField: "_id",
                as: "banner",
            },
        },
        { $unwind: "$banner" },
        {
            $group: {
                _id: null,
                bans: {
                    $push: {
                        banned: {
                            id: "$banList._id",
                            username: "$banList.username",
                            userCode: "$banList.userCode",
                            logoUrl: "$banList.logoUrl",
                        },
                        author: {
                            id: "$banner._id",
                            username: "$banner.username",
                            userCode: "$banner.userCode",
                            logoUrl: "$banner.logoUrl",
                        },
                    },
                },
            },
        },
    ]);
    if (!banList)
        return res.send([]);
    if (!banList.bans)
        return res.send([]);
    return res.send(banList.bans);
};
exports.default = controller;
