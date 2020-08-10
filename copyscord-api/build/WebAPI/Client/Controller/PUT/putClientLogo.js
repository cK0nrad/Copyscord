"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const image_type_1 = require("image-type");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const sharp = require("sharp");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.file)
        return res.status(400).send({ error: config_1.default.locale[12001], errorCode: 12001 });
    if (req.file.size > config_1.default.maxImageSize)
        return res.status(400).send({ error: config_1.default.locale[12002], errorCode: 12002 });
    let logo = req.file.buffer;
    if (!image_type_1.default(logo))
        return res.status(400).send({ error: config_1.default.locale[12003], errorCode: 12003 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const logoUrl = uuid_1.v4();
    const userID = authorization._id.toString();
    if (!fs_1.existsSync(__dirname + "/../../../../../logoDelivery/logo/" + userID))
        fs_1.mkdirSync(__dirname + "/../../../../../logoDelivery/logo/" + userID);
    await sharp(logo)
        .resize(128, 128)
        .toFormat("png")
        .toFile(__dirname + "/../../../../../logoDelivery/logo/" + userID + "/" + logoUrl + ".png");
    fs_1.readdirSync(__dirname + "/../../../../../logoDelivery/logo/" + userID).forEach((file) => {
        if (file !== logoUrl + ".png")
            fs_1.unlinkSync(__dirname + "/../../../../../logoDelivery/logo/" + userID + "/" + file);
    });
    let userUpdate = await util_1.users.update({ _id: authorization._id }, { $set: { logoUrl: "/logo/" + userID + "/" + logoUrl + ".png" } });
    if (!userUpdate.nModified)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    server_1.SocketEventEmitter.emit("updateUser", {
        userID: authorization._id.toString(),
        logoUrl: "/logo/" + userID + "/" + logoUrl + ".png",
        serverList: authorization.server.concat(authorization.friend),
    });
    return res.send({
        logoUrl: "/logo/" + userID + "/" + logoUrl + ".png",
    });
};
exports.default = controller;
