"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const config_1 = require("../../../../config");
const server_1 = require("../../../../SocketServer/server");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.invitation)
        return res.status(400).send({ error: config_1.default.locale[9002], errorCode: 9002 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (authorization.server.length >= config_1.default.maxServerPerUser)
        return res.status(403).send({ error: config_1.default.locale[9003], errorCode: 9003 });
    const inviteFound = await util_1.invites.findOne({ invite: req.query.invitation });
    if (!inviteFound || inviteFound.unavailable)
        return res.status(404).send({ error: config_1.default.locale[9001], errorCode: 9001 });
    const currentServer = await util_1.server.findOne({ _id: inviteFound.server });
    if (!currentServer)
        return res.status(404).send({ error: config_1.default.locale[9001], errorCode: 9001 });
    if (currentServer.bans.some((x) => x.id.equals(authorization._id)))
        return res.status(400).send({ error: config_1.default.locale[4003], errorCode: 4003 });
    if (util_1.memberOfServer(authorization, currentServer._id))
        return res.status(400).send({ error: config_1.default.locale[4004], errorCode: 4004 });
    const serverUpdate = await util_1.server.update({ _id: currentServer._id }, { $push: { members: { id: authorization._id, role: 0 } } });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    const userUpdate = await util_1.users.update({ _id: authorization._id }, { $push: { server: currentServer._id } });
    if (!userUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("newUser", {
        serverID: currentServer._id.toString(),
        userID: authorization._id.toString(),
        username: authorization.username,
        userCode: authorization.userCode,
        logoUrl: authorization.logoUrl,
        status: authorization.status,
    });
    return res.send({ serverName: currentServer.name, logoUrl: currentServer.logoUrl, id: currentServer._id });
};
exports.default = controller;
