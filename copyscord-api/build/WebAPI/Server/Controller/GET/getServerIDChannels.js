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
    //0: Text channel, 1: Voice channel, 2: all
    let channelType;
    if (!req.query.type)
        channelType = 2;
    else
        channelType = parseInt(req.query.type);
    if (channelType > 2 || channelType < 0)
        return res.status(400).send({ error: config_1.default.locale[3006], errorCode: 3006 });
    let query;
    if (channelType === 2) {
        query = { $in: [0, 1] };
    }
    else {
        query = channelType;
    }
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    const [channelList] = await util_1.server.aggregate([
        { $match: { _id: longServerID } },
        { $unwind: "$channels" },
        { $unwind: "$channels.channelsList" },
        { $match: { "channels.channelsList.type": query } },
        {
            $group: {
                _id: null,
                channels: {
                    $push: {
                        id: "$channels.channelsList.id",
                        name: "$channels.channelsList.name",
                        type: "$channels.channelsList.type",
                    },
                },
            },
        },
    ]);
    if (!channelList)
        return res.status(404).send({ error: config_1.default.locale[3002], errorCode: 3002 });
    return res.send(channelList.channels);
};
exports.default = controller;
