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
        return res.status(400).send({ error: config_1.default.locale[7003], errorCode: 7003 });
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    if (!util_1.checkID(req.params.categoryId))
        return res.status(400).send({ error: config_1.default.locale[7001], errorCode: 7001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    const serverUpdate = await util_1.server.update({
        _id: longServerID,
        "channels.categoryId": mongodb_1.Long.fromString(req.params.categoryId),
    }, {
        $set: {
            "channels.$.categoryName": req.query.name,
        },
    });
    if (!serverUpdate.nModified)
        return res.status(404).send({ error: config_1.default.locale[7002], errorCode: 7002 });
    server_1.SocketEventEmitter.emit("updateCategory", {
        serverID: req.params.id,
        categoryID: req.params.categoryId,
        newCategoryName: req.query.name,
    });
    return res.send({
        id: req.params.categoryId,
        name: req.query.name,
    });
};
exports.default = controller;
