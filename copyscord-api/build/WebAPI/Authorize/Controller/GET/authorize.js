"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const config_1 = require("../../../../config");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const authorize = async (req, res) => {
    if (!req.query.email || !req.query.password)
        return util_1.unauthorized(res);
    let currentUser = await util_1.users.findOne({ email: req.query.email });
    if (!currentUser)
        return util_1.unauthorized(res);
    if (await bcrypt_1.compare(req.query.password, currentUser.password))
        return res.send({ loginToken: jsonwebtoken_1.sign({ id: currentUser._id }, config_1.default.secretSalt) });
    return util_1.unauthorized(res);
};
exports.default = authorize;
