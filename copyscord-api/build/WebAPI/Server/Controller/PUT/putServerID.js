"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.name)
        return res.status(400).send({ error: config_1.default.locale[4005], errorCode: 4005 });
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    const serverUpdate = await util_1.server.findOneAndUpdate({ _id: longServerID }, { $set: { name: req.query.name } });
    if (!serverUpdate)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    let members = [];
    serverUpdate.members.forEach((x) => members.push(x.id));
    server_1.SocketEventEmitter.emit("updateServer", {
        serverID: req.params.id,
        name: req.query.name,
        logoUrl: "",
        members,
    });
    return res.send({ id: req.params.id, name: req.query.name });
};
exports.default = controller;
