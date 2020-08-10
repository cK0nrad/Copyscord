"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../server");
const manager = (socket) => {
    //For voice only
    socket.on("test", () => true);
    //Event listener for emiting
    server_1.SocketEventEmitter.addListener("test", () => true);
};
exports.default = manager;
