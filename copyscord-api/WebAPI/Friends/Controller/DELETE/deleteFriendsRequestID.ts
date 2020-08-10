import { Request, Response } from "express";
import { unauthorized, checkID, isAuthorized, users } from "../../../util";
import { Long } from "mongodb";
import config from "../../../../config";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);
  if (!checkID(req.params.id)) return res.status(400).send({ error: config.locale[6001], errorCode: 6001 });

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const longParamsID = Long.fromString(req.params.id);

  if (
    !authorization.friendRequest.received.some((x) => longParamsID.equals(x)) ||
    !authorization.friendRequest.send.some((x) => longParamsID.equals(x))
  )
    return res.status(404).send({ error: config.locale[5003], errorCode: 5003 });

  let userSender = await users.update(
    { _id: authorization._id },
    {
      $pull: {
        "friendRequest.send": longParamsID,
        "friendRequest.received": longParamsID,
      },
    }
  );
  if (!userSender.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });

  let userReceiver = await users.update(
    { _id: longParamsID },
    { $pull: { "friendRequest.received": authorization._id, "friendRequest.send": authorization._id } }
  );
  if (!userReceiver.nModified) return res.status(500).send({ error: config.locale[1002], errorCode: 1002 });
  return res.send({ id: req.params.id });
};

export default controller;
