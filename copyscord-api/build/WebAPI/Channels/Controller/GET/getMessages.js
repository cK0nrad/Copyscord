"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    let limit = 0;
    if (parseInt(req.query.limit) > 500)
        return res.status(400).send({ error: config_1.default.locale[6003], errorCode: 6003 });
    if (parseInt(req.query.limit) < 0)
        return res.status(400).send({ error: config_1.default.locale[6004], errorCode: 6004 });
    limit = !req.query.limit ? 50 : parseInt(req.query.limit);
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    if (!util_1.checkID(req.params.channelId))
        return res.status(400).send({ error: config_1.default.locale[3001], errorCode: 3001 });
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    let currentServer = await util_1.server.findOne({ _id: mongodb_1.Long.fromString(req.params.id) });
    if (!currentServer.channels.some((category) => category.channelsList.some((channel) => channel.id.equals(mongodb_1.Long.fromString(req.params.channelId)) && channel.type === 0)))
        return res.status(404).send({ error: config_1.default.locale[3002], errorCode: 3002 });
    let query = {
        serverId: mongodb_1.Long.fromString(req.params.id),
        channelId: mongodb_1.Long.fromString(req.params.channelId),
    };
    if (req.query.from) {
        if (!util_1.checkID(req.query.from))
            return res.status(400).send({ error: config_1.default.locale[5001], errorCode: 5001 });
        query.$expr = { $lt: ["$_id", mongodb_1.Long.fromString(req.query.from)] };
    }
    let [fetchedMessages] = await util_1.messages.aggregate([
        { $match: query },
        { $sort: { _id: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "userId",
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
                        channel: "$channelId",
                        server: "$serverId",
                        date: "$date",
                        content: "$content",
                    },
                },
            },
        },
    ]);
    if (!fetchedMessages)
        return res.send([]);
    return res.send(fetchedMessages.message);
};
exports.default = controller;
