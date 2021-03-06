"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../WebAPI/util");
const mongodb_1 = require("mongodb");
const handler = async (socket, input) => {
    if (!input)
        return socket.emit("problem", "unauthorized");
    if (!input.Authorization || !input.serverID)
        return socket.emit("problem", "unauthorized");
    let authorization = await util_1.isAuthorized(input.Authorization);
    if (!authorization)
        return socket.emit("problem", "unauthorized");
    if (!util_1.memberOfServer(authorization, mongodb_1.Long.fromString(input.serverID)))
        return socket.emit("problem", "not member of the server");
    socket.join(input.serverID);
};
exports.default = handler;
