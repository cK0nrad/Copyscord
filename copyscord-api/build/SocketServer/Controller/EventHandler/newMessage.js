"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (io, input) => {
    io.in(input.serverID).emit("newMessage", input);
};
exports.default = handler;
