"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    input.members.forEach((x) => {
        socket.in(x.toString()).emit("deleteServer", input);
    });
};
exports.default = handler;
