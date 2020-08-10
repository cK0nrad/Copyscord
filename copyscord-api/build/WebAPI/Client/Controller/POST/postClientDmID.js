"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const uniqueID_1 = require("../../../uniqueID");
const server_1 = require("../../../../SocketServer/server");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.content)
        return res.status(400).send({ error: config_1.default.locale[6005], errorCode: 6005 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (authorization._id.equals(mongodb_1.Long.fromString(req.params.id)))
        return res.status(409).send({ error: config_1.default.locale[6006], errorCode: 6006 });
    const [user, err] = await util_1.isUserExist(mongodb_1.Long.fromString(req.params.id));
    if (err)
        return res.status(400).send(err);
    if (!user.dmFromEveryone && !user.friend.some((friend) => authorization._id.equals(friend)))
        return res.status(404).send({ error: config_1.default.locale[5003], errorCode: 5003 });
    let messageID = BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString();
    if (!user.dmList[0] || !user.dmList.some((user) => user.id.equals(authorization._id))) {
        util_1.users.findOneAndUpdate({ _id: user._id }, { $push: { dmList: { id: authorization._id, lastMessage: Date.now() } } });
    }
    else {
        util_1.users.update({ _id: user._id }, { $set: { "dmList.$[a].lastMessage": Date.now() } }, { arrayFilters: [{ "a.id": authorization._id }] });
    }
    if (!authorization.dmList[0] || !authorization.dmList.some((dude) => dude.id.equals(user._id))) {
        util_1.users.findOneAndUpdate({ _id: authorization._id }, { $push: { dmList: { id: user._id, lastMessage: Date.now() } } });
    }
    else {
        util_1.users.update({ _id: authorization._id }, { $set: { "dmList.$[a].lastMessage": Date.now() } }, { arrayFilters: [{ "a.id": user._id }] });
    }
    let date = Date.now();
    let newMessage = await util_1.dm.insert({
        _id: mongodb_1.Long.fromString(messageID),
        fromId: authorization._id,
        toId: user._id,
        content: req.query.content,
        date: date,
    });
    if (!newMessage)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("newDM", {
        serverID: "@me",
        channelID: user._id.toString(),
        messageID,
        content: req.query.content,
        authorID: authorization._id.toString(),
        authorName: authorization.username,
        authorLogo: authorization.logoUrl,
        authorCode: authorization.userCode,
        authorStatus: authorization.status,
        date,
    });
    return res.send({
        id: messageID,
        from: authorization._id,
        to: user._id,
        content: req.query.content,
        date: date,
    });
};
exports.default = controller;
