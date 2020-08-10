"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.invite)
        return res.status(400).send({ error: config_1.default.locale[9002], errorCode: 9002 });
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    let query;
    query = { invite: req.query.invite, server: longServerID };
    if (!(await util_1.isAdmin(authorization._id, longServerID))) {
        query.author = authorization._id;
    }
    const currentInvite = (await util_1.invites.findOne(query));
    if (!currentInvite)
        return res.status(404).send({ error: config_1.default.locale[9001], errorCode: 9001 });
    const serverUpdate = await util_1.server.update({ _id: longServerID }, { $pull: { invite: { invite: req.query.invite } } });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    const inviteUpdate = await util_1.invites.update({ invite: req.query.invite }, { $set: { unavailable: true } });
    if (!inviteUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({ invite: req.query.invite });
};
exports.default = controller;
