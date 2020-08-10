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
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    const [categoryList] = await util_1.server.aggregate([
        { $match: { _id: longServerID } },
        { $unwind: "$channels" },
        {
            $group: {
                _id: "$_id",
                category: {
                    $push: {
                        id: "$channels.categoryId",
                        name: "$channels.categoryName",
                    },
                },
            },
        },
    ]);
    if (!categoryList)
        return res.status(404).send({ error: config_1.default.locale[7002], errorCode: 7002 });
    return res.send(categoryList.category);
};
exports.default = controller;
