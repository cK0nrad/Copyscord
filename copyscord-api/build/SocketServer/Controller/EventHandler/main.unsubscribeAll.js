"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../WebAPI/util");
const handler = async (socket, input) => {
    if (!input.Authorization)
        return socket.emit("problem", "unauthorized");
    let authorization = await util_1.isAuthorized(input.Authorization);
    if (!authorization)
        return socket.emit("problem", "unauthorized");
    if (typeof socket.rooms === "object")
        Object.keys(socket.rooms).map((x) => socket.leave(x));
    authorization.server.forEach((x) => socket.leave(x.toString()));
};
exports.default = handler;
