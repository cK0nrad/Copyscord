"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const uniqueID_1 = require("../../../uniqueID");
const config_1 = require("../../../../config");
const server_1 = require("../../../../SocketServer/server");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.name || !req.query.type)
        return res.status(400).send({ error: config_1.default.locale[3004], errorCode: 3004 });
    let type = parseInt(req.query.type);
    if (type !== 1 && type !== 0)
        return res.status(400).send({ error: config_1.default.locale[3005], errorCode: 3005 });
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
    let serverUniqueID = mongodb_1.Long.fromString(BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString());
    const serverUpdate = await util_1.server.update({
        _id: longServerID,
        "channels.categoryId": mongodb_1.Long.fromString(req.params.categoryId),
    }, {
        $push: {
            "channels.$.channelsList": {
                id: serverUniqueID,
                name: req.query.name,
                type: type,
            },
        },
    });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("newChannel", {
        serverID: req.params.id,
        categoryID: req.params.categoryId,
        channelID: serverUniqueID.toString(),
        channelName: req.query.name,
        type,
    });
    return res.send({
        id: serverUniqueID,
        name: req.query.name,
        type: type,
    });
};
exports.default = controller;
