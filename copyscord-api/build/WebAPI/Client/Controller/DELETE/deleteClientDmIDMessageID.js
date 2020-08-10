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
    if (!util_1.checkID(req.params.messageID))
        return res.status(400).send({ error: config_1.default.locale[6001], errorCode: 6001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    let deleted = await util_1.dm.remove({
        _id: mongodb_1.Long.fromString(req.params.messageID),
        fromId: authorization._id,
        toId: mongodb_1.Long.fromString(req.params.id),
    });
    if (!deleted.deletedCount)
        return res.status(404).send({ error: config_1.default.locale[6002], errorCode: 6002 });
    server_1.SocketEventEmitter.emit("deleteDM", {
        serverID: "@me",
        channelID: req.params.id,
        authorID: authorization._id.toString(),
        messageID: req.params.messageID,
    });
    return res.send({
        id: req.params.messageID,
    });
};
exports.default = controller;
