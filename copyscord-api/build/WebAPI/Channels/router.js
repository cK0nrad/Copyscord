"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postMessage_1 = require("./Controller/POST/postMessage");
const putChannel_1 = require("./Controller/PUT/putChannel");
const putChannelMessage_1 = require("./Controller/PUT/putChannelMessage");
const getChannel_1 = require("./Controller/GET/getChannel");
const getMessages_1 = require("./Controller/GET/getMessages");
const getVoice_1 = require("./Controller/GET/getVoice");
const getVoiceConnect_1 = require("./Controller/GET/getVoiceConnect");
const deleteChannel_1 = require("./Controller/DELETE/deleteChannel");
const deleteMessage_1 = require("./Controller/DELETE/deleteMessage");
const router = (app) => {
    //POST
    app.post("/channels/:id/:channelId/messages", postMessage_1.default);
    //PUT
    app.put("/channels/:id/:channelId", putChannel_1.default);
    app.put("/channels/:id/:channelId/:messageId", putChannelMessage_1.default);
    //GET
    app.get("/channels/:id/:channelId", getChannel_1.default);
    app.get("/channels/:id/:channelId/messages", getMessages_1.default);
    app.get("/channels/:id/:channelId/voice", getVoice_1.default);
    app.get("/channels/:id/:channelId/voice/connect", getVoiceConnect_1.default);
    //DELETE
    app.delete("/channels/:id/:channelId", deleteChannel_1.default);
    app.delete("/channels/:id/:channelId/:messageId", deleteMessage_1.default);
};
exports.default = router;
