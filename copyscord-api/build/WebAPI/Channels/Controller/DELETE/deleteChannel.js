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
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    if (!(await util_1.isAdmin(authorization._id, mongodb_1.Long.fromString(req.params.id))))
        return util_1.unauthorized(res);
    let channelID = mongodb_1.Long.fromString(req.params.channelId);
    let updated = await util_1.server.update({
        _id: mongodb_1.Long.fromString(req.params.id),
        "channels.channelsList.id": channelID,
    }, {
        $pull: {
            "channels.$.channelsList": {
                id: channelID,
            },
        },
    });
    if (!updated.nModified)
        return res.status(404).send({ error: config_1.default.locale[3002], errorCode: 3002 });
    server_1.SocketEventEmitter.emit("deleteChannel", {
        serverID: req.params.id,
        channelID: req.params.channelId,
    });
    return res.send({
        id: req.params.channelId,
    });
};
exports.default = controller;
