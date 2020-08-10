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
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return util_1.unauthorized(res);
    const { invite: serverInvite } = (await util_1.server.findOne({ _id: longServerID }));
    if (serverInvite.length >= config_1.default.maxInvitePerServer)
        return res.status(403).send({ error: config_1.default.locale[9004], errorCode: 9004 });
    if (serverInvite.filter((x) => x.author.equals(authorization._id)).length >= config_1.default.maxInvitePerUser)
        return res.status(403).send({ error: config_1.default.locale[9005], errorCode: 9005 });
    const inviteLink = await util_1.generateInvitation();
    const newInvite = await util_1.invites.insert({
        invite: inviteLink,
        server: longServerID,
        author: authorization._id,
        date: Date.now(),
    });
    if (!newInvite)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    util_1.invites.findOneAndDelete({ unavailable: true });
    const serverUpdate = await util_1.server.update({ _id: longServerID }, { $push: { invite: { invite: inviteLink, author: authorization._id, date: Date.now() } } });
    if (!serverUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({ invite: inviteLink, date: Date.now() });
};
exports.default = controller;
