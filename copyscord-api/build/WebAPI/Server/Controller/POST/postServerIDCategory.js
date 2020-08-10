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
    if (!req.query.name)
        return res.status(400).send({ error: config_1.default.locale[7003], errorCode: 7003 });
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    //const currentServer: Server = await server.findOne({ _id: longServerID });
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    let categoryID = mongodb_1.Long.fromString(BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString());
    const serverUpdate = await util_1.server.update({ _id: longServerID }, {
        $push: {
            channels: {
                categoryName: req.query.name,
                categoryId: categoryID,
                channelsList: [],
            },
        },
    });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("newCategory", {
        serverID: req.params.id,
        categoryID: categoryID.toString(),
        categoryName: req.query.name,
    });
    return res.send({
        id: categoryID,
        name: req.query.name,
    });
};
exports.default = controller;
