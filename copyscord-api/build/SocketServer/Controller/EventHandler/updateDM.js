"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    socket.in(input.channelID).emit("updateDM", input);
};
exports.default = handler;
