"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    let mongoAddFriend = async (authorization, usernameID) => {
        //Prevent adding self to friend
        if (usernameID.equals(authorization._id))
            return res.status(409).send({ error: config_1.default.locale[11002], errorCode: 11002 });
        //Prevent adding an already friend user [USERID]
        if (authorization.friend.some((friendlist) => friendlist.equals(usernameID)))
            return res.status(409).send({ error: config_1.default.locale[11003], errorCode: 11003 });
        //Prent sending twice an invite
        if (authorization.friendRequest.send.some((request) => request.equals(usernameID)))
            return res.status(409).send({ error: config_1.default.locale[11004], errorCode: 11004 });
        //If we add someone who sent us a request, we add him to friend, or just push request to user
        if (authorization.friendRequest.received.some((request) => request.equals(usernameID))) {
            let updatedSender = await util_1.users.update({ _id: authorization._id }, {
                $pull: {
                    "friendRequest.received": usernameID,
                },
                $push: {
                    friend: usernameID,
                },
            });
            if (!updatedSender.nModified)
                return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
            let updatedReceiver = await util_1.users.update({ _id: usernameID }, {
                $pull: {
                    "friendRequest.send": authorization._id,
                },
                $push: {
                    friend: authorization._id,
                },
            });
            if (!updatedReceiver)
                return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
            return res.send({ friendShip: 2 });
        }
        else {
            let updatedSender = await util_1.users.update({ _id: authorization._id }, {
                $push: {
                    "friendRequest.send": usernameID,
                },
            });
            if (!updatedSender.nModified)
                return res.status(404).send({ error: config_1.default.locale[5003], errorCode: 5003 });
            let updatedReceiver = await util_1.users.update({ _id: usernameID }, {
                $push: {
                    "friendRequest.received": authorization._id,
                },
            });
            if (!updatedReceiver.nModified)
                return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
            return res.send({ friendShip: 1 });
        }
    };
    let addFriend = async (token, usernameID, code) => {
        const authorization = await util_1.isAuthorized(token);
        if (!authorization)
            return util_1.unauthorized(res);
        if (code) {
            if (!util_1.checkUserCode(code))
                return res.status(400).send({ error: config_1.default.locale[5002], errorCode: 5002 });
            let foundUser = await util_1.users.findOne({ username: usernameID, userCode: code });
            if (!foundUser)
                return res.status(404).send({ error: config_1.default.locale[5003], errorCode: 5003 });
            return await mongoAddFriend(authorization, foundUser._id);
        }
        else {
            if (!util_1.checkID(usernameID))
                return res.status(400).send({ error: config_1.default.locale[6001], errorCode: 6001 });
            return await mongoAddFriend(authorization, mongodb_1.Long.fromString(usernameID));
        }
    };
    if (req.query.userId) {
        return await addFriend(req.headers.authorization, req.query.userId);
    }
    else if (req.query.username && req.query.userCode) {
        return await addFriend(req.headers.authorization, req.query.username, parseInt(req.query.userCode));
    }
    else {
        return res.status(400).send({ error: config_1.default.locale[11001], errorCode: 11001 });
    }
};
exports.default = controller;
