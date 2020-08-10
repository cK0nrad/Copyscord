import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, memberOfServer, server, HGET, users } from "../../../util";
import { Long } from "mongodb";
import { Server, category, channelList } from "../../../interface";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[4001], errorCode: 4001 });

  let authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  if (!memberOfServer(authorization, Long.fromString(req.params.id)))
    return res.status(404).send({ error: config.locale[4002], errorCode: 4002 });

  let voiceChannels = JSON.parse(await HGET("channelList", req.params.id));

  if (!voiceChannels) return res.send({ id: req.params.channelId, connected: [] });
  for (let i = 0; i < Object.keys(voiceChannels).length; i++) {
    let inData = Object.values(voiceChannels)[i] as string[] | Long[];
    inData.forEach((x, i) => (inData[i] = Long.fromString(x)));
    voiceChannels[Object.keys(voiceChannels)[i]] = await users.aggregate([
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
export default controller;
