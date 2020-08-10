"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    if (!util_1.checkID(req.params.channelId))
        return res.status(400).send({ error: config_1.default.locale[3001], errorCode: 3001 });
    if (!util_1.checkID(req.params.messageId))
        return res.status(400).send({ error: config_1.default.locale[6001], errorCode: 6001 });
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(404).send({ eerror: config_1.default.locale[4002], errorCode: 4002 });
    let query = {
        _id: mongodb_1.Long.fromString(req.params.messageId),
        serverId: mongodb_1.Long.fromString(req.params.id),
        channelId: mongodb_1.Long.fromString(req.params.channelId),
    };
    if (!(await util_1.isAdmin(authorization._id, mongodb_1.Long.fromString(req.params.id)))) {
        query.userId = authorization._id;
    }
    let deletedMessage = util_1.messages.findOneAndDelete(query);
    if (!deletedMessage)
        return res.status(404).send({ error: config_1.default.locale[6002], errorCode: 6002 });
    server_1.SocketEventEmitter.emit("deleteMessage", {
        serverID: req.params.id,
        messageID: req.params.messageId,
        authorID: authorization._id.toString(),
        channelID: req.params.channelId,
    });
    return res.send({
        id: req.params.messageId,
    });
};
exports.default = controller;
