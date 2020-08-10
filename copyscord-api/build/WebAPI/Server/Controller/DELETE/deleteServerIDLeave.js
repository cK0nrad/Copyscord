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
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(400).send({ error: config_1.default.locale[4010], errorCode: 4010 });
    const owner = await util_1.isOwner(authorization._id, mongodb_1.Long.fromString(req.params.id));
    if (owner)
        return res.status(400).send({ error: config_1.default.locale[4009], errorCode: 4009 });
    const serverUpdate = await util_1.server.findOneAndUpdate({ _id: mongodb_1.Long.fromString(req.params.id) }, { $pull: { members: { id: authorization._id } } });
    if (!serverUpdate)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    const userUpdate = await util_1.users.update({ _id: authorization._id }, { $pull: { server: serverUpdate._id } });
    if (!userUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("deleteUser", {
        serverID: req.params.id,
        userID: authorization._id.toString(),
    });
    return res.send({ serverName: serverUpdate.name });
};
exports.default = controller;
