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
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    let voiceChannels = JSON.parse(await util_1.HGET("channelList", req.params.id));
    if (!voiceChannels)
        return res.send({ id: req.params.channelId, connected: [] });
    for (let i = 0; i < Object.keys(voiceChannels).length; i++) {
        let inData = Object.values(voiceChannels)[i];
        inData.forEach((x, i) => (inData[i] = mongodb_1.Long.fromString(x)));
        voiceChannels[Object.keys(voiceChannels)[i]] = await util_1.users.aggregate([
            {
                $match: {
                    _id: { $in: inData },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    username: "$username",
                    logoUrl: "$logoUrl",
                },
            },
        ]);
    }
    return res.send(voiceChannels);
};
exports.default = controller;
