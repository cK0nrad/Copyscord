"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.dmFromEveryone)
        return res.status(400).send({ error: config_1.default.locale[10007], errorCode: 10007 });
    if (req.query.dmFromEveryone !== "false" && req.query.dmFromEveryone !== "true")
        return res.status(400).send({ error: config_1.default.locale[10008], errorCode: 10008 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (authorization.dmFromEveryone === (req.query.dmFromEveryone === "true"))
        return res.send({ dmFromEveryone: req.query.dmFromEveryone === "true" });
    let userUpdate = await util_1.users.findOneAndUpdate({ _id: authorization._id }, { $set: { dmFromEveryone: req.query.dmFromEveryone === "true" } });
    if (!userUpdate)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({ dmFromEveryone: req.query.dmFromEveryone === "true" });
};
exports.default = controller;
