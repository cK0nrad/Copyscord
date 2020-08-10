"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const [serverList] = await util_1.users.aggregate([
        { $match: { _id: authorization._id } },
        { $unwind: { path: "$server", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "serverList",
                localField: "server",
                foreignField: "_id",
                as: "serverList",
            },
        },
        { $unwind: "$serverList" },
        {
            $group: {
                _id: 0,
                servers: {
                    $push: {
                        id: "$serverList._id",
                        name: "$serverList.name",
                        logoUrl: "$serverList.logoUrl",
                    },
                },
            },
        },
    ]);
    if (!serverList)
        return res.status(404).send({ error: config_1.default.locale[9001], errorCode: 9001 });
    return res.send(serverList.servers);
};
exports.default = controller;
