"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    socket.in(input.serverID).emit("deleteCategory", input);
};
exports.default = handler;
