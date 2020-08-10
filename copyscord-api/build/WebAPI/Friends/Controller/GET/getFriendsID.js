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
    if (authorization._id.equals(longParamsID)) {
        return res.send({
            id: authorization._id,
            username: authorization.username,
            userCode: authorization.userCode,
            logoUrl: authorization.logoUrl,
            status: authorization.status,
        });
    }
    else {
        if (!authorization.friend.some((x) => x.equals(longParamsID)))
            return res.send({ error: config_1.default.locale[11006], errorCode: 11006 });
        const [userFound, err] = await util_1.isUserExist(req.params.id);
        if (err) {
            if (err.errorCode === 5003)
                return res.send({ error: config_1.default.locale[11006], errorCode: 11006 });
            return res.send(err);
        }
        return res.send({
            id: userFound._id,
            username: userFound.username,
            userCode: userFound.userCode,
            logoUrl: userFound.logoUrl,
            status: userFound.status,
        });
    }
};
exports.default = controller;
