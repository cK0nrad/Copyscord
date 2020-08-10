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
    let currentServer = await util_1.server.findOne({ _id: mongodb_1.Long.fromString(req.params.id) });
    if (!currentServer.channels.some((category) => category.channelsList.some((channel) => channel.id.equals(mongodb_1.Long.fromString(req.params.channelId)) && channel.type === 1)))
        return res.status(404).send({ error: config_1.default.locale[3002], errorCode: 3002 });
    let currentVoiceServer = JSON.parse(await util_1.HGET("channelList", req.params.id));
    if (!currentVoiceServer)
        return res.send({ id: req.params.channelId, connected: [] });
    if (!currentVoiceServer[req.params.channelId])
        return res.send({ id: req.params.channelId, connected: [] });
    let userList = currentVoiceServer[req.params.channelId];
    userList.map((_value, key) => (userList[key] = mongodb_1.Long.fromString(userList[key])));
    let connectedUsers = await util_1.users.aggregate([
        {
            $match: {
                _id: { $in: userList },
            },
        },
        {
            $project: {
                _id: 0,
                id: "$_id",
                username: "$username",
                logoUrl: "$logoUrl",
            },
        },
    ]);
    return res.send({
        id: req.params.channelId,
        connected: connectedUsers,
    });
};
exports.default = controller;
