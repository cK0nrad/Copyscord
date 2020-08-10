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
    const longUserID = mongodb_1.Long.fromString(req.params.id);
    if (!authorization.dmList.some((userID) => userID.id.equals(longUserID)))
        return res.status(404).send({ error: config_1.default.locale[5003], errorCode: 5003 });
    let userUpdate = await util_1.users.update({ _id: authorization._id }, { $pull: { dmList: { id: longUserID } } });
    if (!userUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({ id: req.params.id });
};
exports.default = controller;
