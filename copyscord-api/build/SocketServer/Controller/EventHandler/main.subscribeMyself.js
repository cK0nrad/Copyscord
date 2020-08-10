"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../WebAPI/util");
const handler = async (socket, input) => {
    let authorization = await util_1.isAuthorized(input.Authorization);
    if (!input.Authorization)
        return socket.emit("problem", "unauthorized");
    if (!authorization)
        return socket.emit("problem", "unauthorized");
    return socket.join(authorization._id.toString());
};
exports.default = handler;
