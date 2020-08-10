"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const uniqueID_1 = require("../../../uniqueID");
const mongodb_1 = require("mongodb");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.query.name)
        return res.status(400).send({ error: config_1.default.locale[4005], errorCode: 4005 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    let serverUniqueID = mongodb_1.Long.fromString(BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString());
    await util_1.server.insert({
        _id: serverUniqueID,
        name: req.query.name,
        logoUrl: "default",
        owner: authorization._id,
        invite: [],
        members: [
            {
                id: authorization._id,
                role: 2,
            },
        ],
        channels: [
            {
                categoryName: "Default",
                categoryId: mongodb_1.Long.fromString(BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString()),
                channelsList: [
                    {
                        name: "Default text",
                        type: 0,
                        id: mongodb_1.Long.fromString(BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString()),
                    },
                    {
                        name: "Default voice",
                        type: 1,
                        id: mongodb_1.Long.fromString(BigInt("0b" + uniqueID_1.default.generate(config_1.default.serverID)).toString()),
                    },
                ],
            },
        ],
        bans: [],
    });
    let userUpdated = await util_1.users.update({ _id: authorization._id }, { $push: { server: serverUniqueID } });
    if (!userUpdated.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    return res.send({
        id: serverUniqueID,
        serverName: req.query.name,
    });
};
exports.default = controller;
