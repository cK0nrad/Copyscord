"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
const image_type_1 = require("image-type");
const sharp = require("sharp");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const mongodb_1 = require("mongodb");
const server_1 = require("../../../../SocketServer/server");
const config_1 = require("../../../../config");
const controller = async (req, res) => {
    if (!req.headers.authorization)
        return util_1.unauthorized(res);
    if (!req.file)
        return res.status(400).send({ error: config_1.default.locale[12001], errorCode: 12001 });
    if (req.file.size > config_1.default.maxImageSize)
        return res.status(400).send({ error: config_1.default.locale[12002], errorCode: 12002 });
    if (!util_1.checkID(req.params.id))
        return res.status(400).send({ error: config_1.default.locale[4001], errorCode: 4001 });
    let logo = req.file.buffer;
    if (!image_type_1.default(logo))
        return res.status(400).send({ error: config_1.default.locale[12003], errorCode: 12003 });
    const authorization = await util_1.isAuthorized(req.headers.authorization);
    if (!authorization)
        return util_1.unauthorized(res);
    const longServerID = mongodb_1.Long.fromString(req.params.id);
    if (!util_1.memberOfServer(authorization, longServerID))
        return res.status(404).send({ error: config_1.default.locale[4002], errorCode: 4002 });
    if (!(await util_1.isAdmin(authorization._id, longServerID)))
        return util_1.unauthorized(res);
    let logoUrl = uuid_1.v4();
    if (!fs_1.existsSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id))
        fs_1.mkdirSync(__dirname + "/../../../../../logoDelivery" + req.params.id);
    await sharp(logo)
        .resize(128, 128)
        .toFormat("png")
        .toFile(__dirname + "/../../../../../logoDelivery/server/" + req.params.id + "/" + logoUrl + ".png");
    fs_1.readdirSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id).forEach((file) => {
        if (file !== logoUrl + ".png")
            fs_1.unlinkSync(__dirname + "/../../../../../logoDelivery/server/" + req.params.id + "/" + file);
    });
    const serverUpdate = await util_1.server.findOneAndUpdate({ _id: longServerID }, { $set: { logoUrl: "/server/" + req.params.id + "/" + logoUrl + ".png" } });
    if (!serverUpdate)
        return res.status(500).send({ error: config_1.default.locale[1002], errorCode: 1002 });
    let members = [];
    serverUpdate.members.forEach((x) => members.push(x.id));
    server_1.SocketEventEmitter.emit("updateServer", {
        serverID: req.params.id,
        name: req.query.name,
        logoUrl: "/server/" + req.params.id + "/" + logoUrl + ".png",
        members,
    });
    return res.send({
        logoUrl: "/server/" + req.params.id + "/" + logoUrl + ".png",
    });
};
exports.default = controller;
