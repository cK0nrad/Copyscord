"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    socket.in(input.serverID).emit("deleteUser", input);
};
exports.default = handler;
