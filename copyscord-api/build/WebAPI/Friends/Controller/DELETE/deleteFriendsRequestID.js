"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[6001], errorCode: 6001 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longParamsID = mongodb_1.Long.fromString(req.params.id);
    if (!authorization.friendRequest.received.some((x) => longParamsID.equals(x)) ||
        !authorization.friendRequest.send.some((x) => longParamsID.equals(x)))
        return res.status(404).send({ error: config_1.default.locale[5003], errorCode: 5003 });
    let userSender = await util_1.users.update({ _id: authorization._id }, {
        $pull: {
            "friendRequest.send": longParamsID,
            "friendRequest.received": longParamsID,
        },
    });
    if (!userSender.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    let userReceiver = await util_1.users.update({ _id: longParamsID }, { $pull: { "friendRequest.received": authorization._id, "friendRequest.send": authorization._id } });
    if (!userReceiver.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({ id: req.params.id });
};
exports.default = controller;
