"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../WebAPI/util");
const handler = async (socket, input) => {
    if (!input.Authorization)
        return socket.emit("problem", "unauthorized");
    let authorization = await util_1.isAuthorized(input.Authorization);
    if (!authorization)
        return socket.emit("problem", "unauthorized");
    authorization.server.forEach((x) => socket.join(x.toString()));
};
exports.default = handler;
