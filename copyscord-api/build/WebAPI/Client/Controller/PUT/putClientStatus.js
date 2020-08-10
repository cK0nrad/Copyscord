"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.status)
        return res.status(400).send({ error: config_1.default.locale[10009], errorCode: 10009 });
    let statusInt = parseInt(req.query.status);
    if (statusInt > 3 || statusInt < 0)
        return res.status(400).send({ error: config_1.default.locale[10010], errorCode: 10010 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (authorization.status === statusInt)
        return res.send({ status: statusInt });
    let userUpdate = await util_1.users.update({ _id: authorization._id }, { $set: { status: statusInt } });
    if (!userUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("updateUser", {
        userID: authorization._id.toString(),
        status: statusInt,
        serverList: authorization.server.concat(authorization.friend),
    });
    return res.send({ status: req.query.status });
};
exports.default = controller;
