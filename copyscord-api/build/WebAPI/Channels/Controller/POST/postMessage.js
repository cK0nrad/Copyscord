"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const uniqueID_1 = require("../../../uniqueID");
const config_1 = require("../../../../config");
const server_1 = require("../../../../SocketServer/server");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.content)
        return res.status(400).send({ error: config_1.default.locale[6005], errorCode: 6005 });
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
    let messsageID = BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString();
    let date = Date.now();
    let newMessage = await util_1.messages.insert({
        _id: mongodb_1.Long.fromString(messsageID),
        serverId: mongodb_1.Long.fromString(req.params.id),
        channelId: mongodb_1.Long.fromString(req.params.channelId),
        userId: authorization._id,
        content: req.query.content,
        date: date,
    });
    if (!newMessage)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("newMessage", {
        serverID: req.params.id,
        messageID: messsageID,
        authorID: authorization._id.toString(),
        authorName: authorization.username,
        authorLogo: authorization.logoUrl,
        authorCode: authorization.userCode,
        channelID: req.params.channelId,
        date,
        content: req.query.content,
    });
    return res.send({
        id: messsageID,
        serverId: req.params.id,
        channelId: req.params.channelId,
        content: req.query.content,
        date: date,
    });
};
exports.default = controller;
