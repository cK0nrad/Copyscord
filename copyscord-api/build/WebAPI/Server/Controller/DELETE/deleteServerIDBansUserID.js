"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
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
    const longUserID = mongodb_1.Long.fromString(req.params.userId);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    const { bans, owner } = await util_1.server.findOne({ _id: longServerID });
    if (!owner)
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    if (owner === req.params.userId)
        res.status(400).send({ error: config_1.default.locale[4007], errorCode: 4007 });
    if (!util_1.isBan(bans, longUserID))
        return res.status(400).send({ error: config_1.default.locale[4008], errorCode: 4008 });
    const serverUpdate = await util_1.server.update({ _id: longServerID }, { $pull: { bans: { id: longUserID } } });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({ id: req.params.userId });
};
exports.default = controller;
