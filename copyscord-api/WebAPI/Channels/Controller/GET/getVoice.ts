import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server, HGET, users } from "../../../util";
import { Long } from "mongodb";
import { Server, category, channelList } from "../../../interface";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });
  if (!checkID(req.params.channelId)) return res.status(400).send({ error: config.locale[3001], errorCode: 3001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  let currentServer: Server = await server.findOne({ _id: Long.fromString(req.params.id) });
  if (
    !currentServer.channels.some((category: category) =>
      category.channelsList.some(
        (channel: channelList) => channel.id.equals(Long.fromString(req.params.channelId)) && channel.type === 1
      )
    )
  )
    return res.status(404).send({ error: config.locale[3002], errorCode: 3002 });

  let currentVoiceServer = JSON.parse(await HGET("channelList", req.params.id));

  if (!currentVoiceServer) return res.send({ id: req.params.channelId, connected: [] });
  if (!currentVoiceServer[req.params.channelId]) return res.send({ id: req.params.channelId, connected: [] });

  let userList = currentVoiceServer[req.params.channelId];
  userList.map((_value: string, key: number) => (userList[key] = Long.fromString(userList[key])));

  let connectedUsers = await users.aggregate([
    {
      $match: {
        _id: { $in: userList },
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

  return res.send({
    id: req.params.channelId,
    connected: connectedUsers,
  });
};

export default controller;
