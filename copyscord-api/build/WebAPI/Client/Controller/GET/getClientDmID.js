"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    let limit = 50;
    if (req.query.limit)
        limit = parseInt(req.query.limit);
    if (limit > config_1.default.maxMessagePerFetch)
        return res.status(400).send({ error: config_1.default.locale[6003], errorCode: 6003 });
    if (limit < 0)
        return res.status(400).send({ error: config_1.default.locale[6004], errorCode: 6004 });
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    let query = {
        fromId: {
            $in: [authorization._id, mongodb_1.Long.fromString(req.params.id)],
        },
        toId: {
            $in: [authorization._id, mongodb_1.Long.fromString(req.params.id)],
        },
    };
    if (req.query.from) {
        if (!util_1.checkID(req.params.from))
            return res.status(400).send({ error: config_1.default.locale[6001], errorCode: 6001 });
        query["$expr"] = { $lt: ["$_id", mongodb_1.Long.fromString(req.query.from)] };
    }
    let [messages] = await util_1.dm.aggregate([
        { $match: query },
        { $sort: { _id: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "fromId",
                foreignField: "_id",
                as: "from",
            },
        },
        { $unwind: "$from" },
        {
            $group: {
                _id: 0,
                message: {
                    $push: {
                        id: "$_id",
                        authorId: "$from._id",
                        username: "$from.username",
                        userCode: "$from.userCode",
                        userLogo: "$from.logoUrl",
                        date: "$date",
                        content: "$content",
                    },
                },
            },
        },
    ]);
    if (!messages)
        return res.send([]);
    return res.send(messages.message);
};
exports.default = controller;
