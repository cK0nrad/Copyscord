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
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return util_1.unauthorized(res);
    const serverUpdate = await util_1.server.findOneAndDelete({
        _id: longServerID,
        owner: authorization._id,
    });
    if (!serverUpdate)
        return util_1.unauthorized(res);
    let members = [];
    serverUpdate.members.forEach((x) => members.push(x.id));
    const usersUpdate = await util_1.users.findOneAndUpdate({ _id: { $in: members } }, { $pull: { server: serverUpdate._id } });
    if (!usersUpdate)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("deleteServer", {
        serverID: req.params.id,
        members,
    });
    return res.send({ id: serverUpdate._id });
};
exports.default = controller;
