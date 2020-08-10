import { EventEmitter } from "events";
import { createWorker } from "mediasoup";
import { createServer } from "https";
import { readFileSync } from "fs";
import eventManager from "./Controller/eventManager";
import voiceManager from "./Controller/voiceManage";
import * as SocketIO from "socket.io";
import config from "../config";
import { SocketEventHandler } from "./eventInterface";

import subscribeServer from "./Controller/EventHandler/main.subscribeServer";
import unsubscribeServer from "./Controller/EventHandler/main.unsubscribeServer";
import subscribeMyself from "./Controller/EventHandler/main.subscribeMyself";
import unsubscribeMyself from "./Controller/EventHandler/main.unsubscribeMyself";
import subscribeAll from "./Controller/EventHandler/main.subscribeAll";
import unsubscribeAll from "./Controller/EventHandler/main.unsubscribeAll";

const SocketEventEmitter = new EventEmitter() as SocketEventHandler;
const options = {
  key: readFileSync(config.sslKey),
  cert: readFileSync(config.sslCert),
};
const httpServerVoice = createServer(options);
const ioVoice = SocketIO(httpServerVoice);

httpServerVoice.listen(config.voiceSocketPort, function () {
  console.log("Voice socket running at : %s:%s", config.publicIp, config.voiceSocketPort);
});

const httpServerEvent = createServer(options);
const ioEvent = SocketIO(httpServerEvent);

httpServerEvent.listen(config.eventSocketPort, function () {
  console.log("Event socket running at : %s:%s", config.publicIp, config.eventSocketPort);
});

(async () => {
  const voiceRouter = await createWorker();
  ioVoice.on("connection", (socket) => {
    voiceManager(socket, ioVoice, voiceRouter);
  });
})();

ioEvent.on("connection", (socket) => {
  socket.on("subscribeServer", (input) => subscribeServer(socket, input));
  socket.on("unsubscribeServer", (input) => unsubscribeServer(socket, input));
  socket.on("subscribeAll", (input) => subscribeAll(socket, input));
  socket.on("unsubscribeAll", (input) => unsubscribeAll(socket, input));
  socket.on("subscribeMyself", (input) => subscribeMyself(socket, input));
  socket.on("unsubscribeMyself", (input) => unsubscribeMyself(socket, input));
});
eventManager(ioEvent);

export { SocketEventEmitter };
