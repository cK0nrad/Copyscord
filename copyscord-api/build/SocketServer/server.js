"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventEmitter = void 0;
const events_1 = require("events");
const mediasoup_1 = require("mediasoup");
const https_1 = require("https");
const fs_1 = require("fs");
const eventManager_1 = require("./Controller/eventManager");
const voiceManage_1 = require("./Controller/voiceManage");
const SocketIO = require("socket.io");
const config_1 = require("../config");
const main_subscribeServer_1 = require("./Controller/EventHandler/main.subscribeServer");
const main_unsubscribeServer_1 = require("./Controller/EventHandler/main.unsubscribeServer");
const main_subscribeMyself_1 = require("./Controller/EventHandler/main.subscribeMyself");
const main_unsubscribeMyself_1 = require("./Controller/EventHandler/main.unsubscribeMyself");
const main_subscribeAll_1 = require("./Controller/EventHandler/main.subscribeAll");
const main_unsubscribeAll_1 = require("./Controller/EventHandler/main.unsubscribeAll");
const SocketEventEmitter = new events_1.EventEmitter();
exports.SocketEventEmitter = SocketEventEmitter;
const options = {
    key: fs_1.readFileSync(config_1.default.sslKey),
    cert: fs_1.readFileSync(config_1.default.sslCert),
};
const httpServerVoice = https_1.createServer(options);
const ioVoice = SocketIO(httpServerVoice);
httpServerVoice.listen(config_1.default.voiceSocketPort, function () {
    console.log("Voice socket running at : %s:%s", config_1.default.publicIp, config_1.default.voiceSocketPort);
});
const httpServerEvent = https_1.createServer(options);
const ioEvent = SocketIO(httpServerEvent);
httpServerEvent.listen(config_1.default.eventSocketPort, function () {
    console.log("Event socket running at : %s:%s", config_1.default.publicIp, config_1.default.eventSocketPort);
});
(async () => {
    const voiceRouter = await mediasoup_1.createWorker();
    ioVoice.on("connection", (socket) => {
        voiceManage_1.default(socket, ioVoice, voiceRouter);
    });
})();
ioEvent.on("connection", (socket) => {
    socket.on("subscribeServer", (input) => main_subscribeServer_1.default(socket, input));
    socket.on("unsubscribeServer", (input) => main_unsubscribeServer_1.default(socket, input));
    socket.on("subscribeAll", (input) => main_subscribeAll_1.default(socket, input));
    socket.on("unsubscribeAll", (input) => main_unsubscribeAll_1.default(socket, input));
    socket.on("subscribeMyself", (input) => main_subscribeMyself_1.default(socket, input));
    socket.on("unsubscribeMyself", (input) => main_unsubscribeMyself_1.default(socket, input));
});
eventManager_1.default(ioEvent);
