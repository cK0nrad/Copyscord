"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const [friendsRequest] = await util_1.users.aggregate([
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
    if (!friendsRequest.sent[0].id)
        friendsRequest.sent = [];
    if (!friendsRequest.received[0].id)
        friendsRequest.received = [];
    return res.send(friendsRequest);
};
exports.default = controller;
