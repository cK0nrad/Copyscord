"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const fs_1 = require("fs");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    fs_1.readdirSync(__dirname + "/../../../../../logoDelivery/logo/" + authorization._id).forEach((file) => {
        fs_1.unlinkSync(__dirname + "/../../../../../logoDelivery/logo/" + authorization._id + "/" + file);
    });
    let userUpdate = await util_1.users.update({ _id: authorization._id }, { $set: { logoUrl: "/logo/default.png" } });
    if (!userUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("updateUser", {
        userID: authorization._id.toString(),
        logoUrl: "/logo/default.png",
        serverList: authorization.server.concat(authorization.friend),
    });
    return res.send({
        logoUrl: "/logo/default.png",
    });
};
exports.default = controller;
