"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    socket.in(input.channelID).emit("newDM", input);
};
exports.default = handler;
