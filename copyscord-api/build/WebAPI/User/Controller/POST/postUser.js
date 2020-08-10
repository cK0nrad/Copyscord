"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const config_1 = require("../../../../config");
const mongodb_1 = require("mongodb");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const uniqueID_1 = require("../../../uniqueID");
const controller = async (req, res) => {
    if (!req.query.password || !req.query.username || !req.query.email)
        return res.status(400).send({ error: config_1.default.locale[5004], errorCode: 5004 });
    if (req.query.password.length < config_1.default.minPasswordLength)
        return res.status(400).send({ error: config_1.default.locale[5005], errorCode: 5005 });
    if (req.query.username.length < config_1.default.minUsernameLength)
        return res.status(400).send({ error: config_1.default.locale[5006], errorCode: 5006 });
    if (!/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(req.query.email))
        return res.status(400).send({ error: config_1.default.locale[5007], errorCode: 5007 });
    if (!(await util_1.checkEmail(req.query.email)))
        return res.status(409).send({ error: config_1.default.locale[5008], errorCode: 5008 });
    //userCode: [0]: ?avaible, [1]: new userCode, [2]: need to be created
    let [avaible, userCode, create] = await util_1.usernameCode(req.query.username);
    if (!avaible)
        return res.status(409).send({ error: config_1.default.locale[5009], errorCode: 5009 });
    if (create) {
        await util_1.usernameList.insert({ username: req.query.username, pool: [userCode] });
    }
    else {
        await util_1.usernameList.update({ username: req.query.username }, { $push: { pool: userCode } });
    }
    const hashedPassword = bcrypt_1.hashSync(req.query.newpassword, 10);
    const userID = BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString();
    util_1.users
        .insert({
        _id: mongodb_1.Long.fromString(userID),
        status: 0,
        username: req.query.username,
        email: req.query.email,
        password: hashedPassword,
        userCode: userCode,
        friend: [],
        friendRequest: {
            send: [],
            received: [],
        },
        server: [],
        logoUrl: "/logo/default.png",
        dmList: [],
        dmFromEveryone: false,
    })
        .then((el) => {
        return res.send({
            id: userID,
            username: req.query.username,
            email: req.query.email,
            userCode: userCode,
            authorization: jsonwebtoken_1.sign({ id: userID }, config_1.default.secretSalt),
        });
    });
};
exports.default = controller;
