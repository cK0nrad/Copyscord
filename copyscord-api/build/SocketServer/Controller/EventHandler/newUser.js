"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    socket.in(input.serverID).emit("newUser", input);
};
exports.default = handler;
