"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const bcrypt_1 = require("bcrypt");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.password)
        return res.status(400).send({ error: config_1.default.locale[10001], errorCode: 10001 });
    if (!req.query.username && !req.query.newpassword && !req.query.username && !req.query.email)
        return res.status(400).send({ error: config_1.default.locale[10002], errorCode: 10002 });
    if (req.query.username && req.query.username.length > config_1.default.maxUsernameLength)
        return res.status(400).send({ error: config_1.default.locale[10003], errorCode: 10003 });
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (authorization.username === req.query.username && !req.query.newpassword && !req.query.email)
        return res.status(409).send({ error: config_1.default.locale[10004], errorCode: 10004 });
    let update = {};
    if (req.query.email) {
        if (await util_1.users.findOne({ email: req.query.email }))
            return res.status(400).send({ error: config_1.default.locale[10005], errorCode: 10005 });
        update["email"] = req.query.email;
    }
    if (req.query.newpassword) {
        if (!bcrypt_1.compareSync(req.query.password, authorization.password))
            return res.status(401).send({ error: config_1.default.locale[10006], errorCode: 10006 });
        update["password"] = bcrypt_1.hashSync(req.query.newpassword, 10);
    }
    if (req.query.username) {
        if (!bcrypt_1.compareSync(req.query.password, authorization.password))
            return util_1.unauthorized(res);
        update["username"] = req.query.username;
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
        await util_1.usernameList.update({ username: authorization.username }, { $pull: { pool: authorization.userCode } });
        update["userCode"] = userCode;
    }
    let updatedUser = await util_1.users.update({ _id: authorization._id }, {
        $set: update,
    });
    if (!updatedUser.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    let response = {
        username: authorization.username,
        updated: true,
    };
    if (req.query.username) {
        response["userCode"] = update["userCode"];
        server_1.SocketEventEmitter.emit("updateUser", {
            userID: authorization._id.toString(),
            username: req.query.username || authorization.username,
            userCode: update["userCode"] || authorization.userCode,
            logoUrl: authorization.logoUrl,
            status: authorization.status,
            serverList: authorization.server.concat(authorization.friend),
        });
    }
    return res.send(response);
};
exports.default = controller;
