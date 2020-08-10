import { Request, Response } from "express";
import { checkID, isAuthorized, memberOfServer, channelExist, nodeList, unauthorized, HGET, HEXISTS, HDEL } from "../../../util";
import { Long } from "mongodb";
import isReachable = require("is-reachable");
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });

  let authorization = await isAuthorized(req.headers.authorization);

  if (!authorization) return unauthorized(res);
  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  let isChannelExist = await channelExist(Long.fromString(req.params.channelId), req.params.id, 1);
  if (!isChannelExist) return res.status(404).send({ error: config.locale[3002], errorCode: 3002 });

  let result = await HGET("instanceList", req.params.id);
  if (result) {
    let [ip, port] = result.split(":");
    let [server] = await nodeList.find({ ip, port });

    return res.send({
      ip: ip,
      port: port,
      identifier: server,
    });
  } else {
    let getANode = async (retry: number) => {
      let [server] = await nodeList.aggregate([{ $sample: { size: 1 } }]);
      //Return the node if reachable
      if (await isReachable(server.ip + ":" + server.port)) return server;
      //Or delete it from the redis
      if (await HEXISTS("instanceList", req.params.id)) {
        await HDEL("instanceList", req.params.id);
      }
      if (await HEXISTS("channelList", req.params.id)) {
        await HDEL("channelList", req.params.id);
      }
      if (!retry) return { error: true };
      return getANode(retry - 1);
    };

    let server = await getANode(5);
    if (server.error) return res.status(404).send({ error: config.locale[8001], errorCode: 8001 });
    return res.send({
      ip: server.ip,
      port: server.port,
      identifier: server.identifier,
    });
  }
};

export default controller;
