"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    let removeFriend = async (token, usernameID, userCode) => {
        const authorization = await util_1.isAuthorized(token);
        if (!authorization)
            return util_1.unauthorized(res);
        if (Object.is(usernameID, authorization._id.toString()) ||
            (usernameID === authorization.username && userCode === authorization.userCode))
            return res.send({ error: config_1.default.locale[11005], errorCode: 11005 });
        //If theres is a userCode we check if the user string exist or we return a long from his id
        let [userFound, err] = await util_1.isUserExist(userCode ? usernameID : mongodb_1.Long.fromString(usernameID), userCode);
        if (err) {
            if (err.errorCode === 5003)
                return res.send({ error: config_1.default.locale[11006], errorCode: 11006 });
            return res.send(err);
        }
        let [userInfo] = userFound;
        if (!authorization.friend.some((friendlist) => friendlist.equals(userInfo._id.toString())))
            return res.send({ error: config_1.default.locale[11006], errorCode: 11006 });
        let userSender = await util_1.users.update({ _id: authorization._id }, { $pull: { friend: userInfo._id } });
        if (!userSender.nModified)
            return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
        let userReceiver = await util_1.users.update({ _id: userInfo._id }, { $pull: { friend: authorization._id } });
        if (!userReceiver.nModified)
            return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
        return res.send({ friendShip: 0 });
    };
    if (req.query.userId) {
        return await removeFriend(req.headers.authorization, req.query.userId);
    }
    else if (req.query.username && req.query.userCode) {
        return await removeFriend(req.headers.authorization, req.query.username, parseInt(req.query.userCode));
    }
    else {
        return res.status(400).send({ error: config_1.default.locale[11001], errorCode: 11001 });
    }
};
exports.default = controller;
