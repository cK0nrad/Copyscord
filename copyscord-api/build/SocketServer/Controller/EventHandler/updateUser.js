"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (socket, input) => {
    if (input.serverList) {
        input.serverList.forEach((x) => {
            input.serverID = x.toString();
            socket.in(x.toString()).emit("updateUser", input);
        });
        return true;
    }
    else {
        socket.in(input.serverID).emit("updateUser", input);
    }
};
exports.default = handler;
