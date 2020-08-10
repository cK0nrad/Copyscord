"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const fs_1 = require("fs");
const util_1 = require("../../../util");
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
    const longUserID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longUserID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    if (!(await util_1.isAdmin(authorization._id, longUserID)))
        return util_1.unauthorized(res);
    if (fs_1.existsSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id)) {
        fs_1.readdirSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id).forEach((file) => {
            fs_1.unlinkSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id + "/" + file);
        });
    }
    const serverUpdate = await util_1.server.findOneAndUpdate({ _id: longUserID }, { $set: { logoUrl: "default" } });
    if (!serverUpdate)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    let members = [];
    serverUpdate.members.forEach((x) => members.push(x.id));
    server_1.SocketEventEmitter.emit("updateServer", {
        serverID: req.params.id,
        name: "",
        logoUrl: "default",
        members,
    });
    return res.send({
        logoUrl: "default",
    });
};
exports.default = controller;
