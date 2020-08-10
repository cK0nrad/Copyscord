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
    if (!util_1.checkID(req.params.channelId))
        return res.status(400).send({ error: config_1.default.locale[3001], errorCode: 3001 });
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    let [serverInstace] = await util_1.server.aggregate([
        {
            $match: { _id: mongodb_1.Long.fromString(req.params.id) },
        },
        {
            $unwind: "$channels",
        },
        {
            $unwind: "$channels.channelsList",
        },
        {
            $match: { "channels.channelsList.id": mongodb_1.Long.fromString(req.params.channelId) },
        },
        {
            $group: {
                _id: null,
                channel: {
                    $push: {
                        id: "$channels.channelsList.id",
                        name: "$channels.channelsList.name",
                        type: "$channels.channelsList.type",
                    },
                },
            },
        },
    ]);
    if (!serverInstace)
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    if (!serverInstace.channel)
        return res.status(404).send({ error: config_1.default.locale[3002], errorCode: 3002 });
    return res.send(serverInstace.channel[0]);
};
exports.default = controller;
