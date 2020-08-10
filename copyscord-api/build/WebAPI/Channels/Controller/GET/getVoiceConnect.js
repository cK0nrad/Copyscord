"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const mongodb_1 = require("mongodb");
const isReachable = require("is-reachable");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    if (!util_1.checkID(req.params.channelId))
        return res.status(400).send({ error: config_1.default.locale[3001], errorCode: 3001 });
    let authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(req.params.id)))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    let isChannelExist = await util_1.channelExist(mongodb_1.Long.fromString(req.params.channelId), req.params.id, 1);
    if (!isChannelExist)
        return res.status(404).send({ error: config_1.default.locale[3002], errorCode: 3002 });
    let result = await util_1.HGET("instanceList", req.params.id);
    if (result) {
        let [ip, port] = result.split(":");
        let [server] = await util_1.nodeList.find({ ip, port });
        return res.send({
            ip: ip,
            port: port,
            identifier: server,
        });
    }
    else {
        let getANode = async (retry) => {
            let [server] = await util_1.nodeList.aggregate([{ $sample: { size: 1 } }]);
            //Return the node if reachable
            if (await isReachable(server.ip + ":" + server.port))
                return server;
            //Or delete it from the redis
            if (await util_1.HEXISTS("instanceList", req.params.id)) {
                await util_1.HDEL("instanceList", req.params.id);
            }
            if (await util_1.HEXISTS("channelList", req.params.id)) {
                await util_1.HDEL("channelList", req.params.id);
            }
            if (!retry)
                return { error: true };
            return getANode(retry - 1);
        };
        let server = await getANode(5);
        if (server.error)
            return res.status(404).send({ error: config_1.default.locale[8001], errorCode: 8001 });
        return res.send({
            ip: server.ip,
            port: server.port,
            identifier: server.identifier,
        });
    }
};
exports.default = controller;
