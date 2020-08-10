import { Request, Response } from "express";
import { unauthorized, isAuthorized, users } from "../../../util";

const controller = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return unauthorized(res);

  const authorization = await isAuthorized(req.headers.authorization);
  if (!authorization) return unauthorized(res);

  const [friendsRequest] = await users.aggregate([
    { $match: { _id: authorization._id } },
    {
      $project: {
        _id: 0,
        Send: {
          $concatArrays: ["$friendRequest.send"],
        },
        Received: {
          $concatArrays: ["$friendRequest.received"],
        },
      },
    },
    { $unwind: { path: "$Send", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "Send",
        foreignField: "_id",
        as: "SendUser",
      },
    },
    { $unwind: { path: "$SendUser", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        SendUser: {
          $push: {
            id: "$SendUser._id",
            name: "$SendUser.username",
            code: "$SendUser.userCode",
            logoUrl: "$SendUser.logoUrl",
          },
        },
        ReceivedUser: {
          $first: "$Received",
        },
      },
    },
    { $unwind: { path: "$ReceivedUser", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "ReceivedUser",
        foreignField: "_id",
        as: "ReceivedUserList",
      },
    },
    { $unwind: { path: "$ReceivedUserList", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: 0,
        SendUser: {
          $first: "$SendUser",
        },
        ReceivedUser: {
          $push: {
            id: "$ReceivedUserList._id",
            name: "$ReceivedUserList.username",
            code: "$ReceivedUserList.userCode",
            logoUrl: "$ReceivedUserList.logoUrl",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        sent: "$SendUser",
        received: "$ReceivedUser",
      },
    },
  ]);
  if (!friendsRequest) {
    return res.send({
      sent: [],
      received: [],
    });
  }

  if (!friendsRequest.sent[0].id) friendsRequest.sent = [];
  if (!friendsRequest.received[0].id) friendsRequest.received = [];
  return res.send(friendsRequest);
};

export default controller;
