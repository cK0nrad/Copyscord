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
    if (!util_1.checkID(req.params.userId))
        return res.status(400).send({ error: config_1.default.locale[5001], errorCode: 5001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    const longUserID = mongodb_1.Long.fromString(req.params.userId);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(400).send({ error: config_1.default.locale[6001], errorCode: 6001 });
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    if (await util_1.isAdmin(longUserID, longServerID))
        return util_1.unauthorized(res);
    const serverUpdate = await util_1.server.update({ _id: longServerID }, {
        $pull: { members: { id: longUserID } },
        $push: {
            bans: {
                id: longUserID,
                author: authorization._id,
            },
        },
    });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    const { _id: id, username, userCode } = await util_1.users.findOneAndUpdate({ _id: longUserID }, { $pull: { server: longServerID } });
    if (!id)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("deleteUser", {
        serverID: req.params.id,
        userID: id.toString(),
    });
    return res.send({ id, username, userCode });
};
exports.default = controller;
