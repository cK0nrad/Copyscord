"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const newMessage_1 = require("./EventHandler/newMessage");
const updateMessage_1 = require("./EventHandler/updateMessage");
const deleteMessage_1 = require("./EventHandler/deleteMessage");
const newChannel_1 = require("./EventHandler/newChannel");
const updateChannel_1 = require("./EventHandler/updateChannel");
const deleteChannel_1 = require("./EventHandler/deleteChannel");
const newCategory_1 = require("./EventHandler/newCategory");
const updateCategory_1 = require("./EventHandler/updateCategory");
const newVoiceUser_1 = require("./EventHandler/newVoiceUser");
const deleteVoiceUser_1 = require("./EventHandler/deleteVoiceUser");
const deleteCategory_1 = require("./EventHandler/deleteCategory");
const newUser_1 = require("./EventHandler/newUser");
const updateUser_1 = require("./EventHandler/updateUser");
const deleteUser_1 = require("./EventHandler/deleteUser");
const newDM_1 = require("./EventHandler/newDM");
const updateDM_1 = require("./EventHandler/updateDM");
const deleteDM_1 = require("./EventHandler/deleteDM");
const updateServer_1 = require("./EventHandler/updateServer");
const deleteServer_1 = require("./EventHandler/deleteServer");
const manager = (io) => {
    //API => socket event
    //Messages
    server_1.SocketEventEmitter.on("newMessage", (input) => newMessage_1.default(io, input));
    server_1.SocketEventEmitter.on("updateMessage", (input) => updateMessage_1.default(io, input));
    server_1.SocketEventEmitter.on("deleteMessage", (input) => deleteMessage_1.default(io, input));
    //Channels
    server_1.SocketEventEmitter.on("newChannel", (input) => newChannel_1.default(io, input));
    server_1.SocketEventEmitter.on("updateChannel", (input) => updateChannel_1.default(io, input));
    server_1.SocketEventEmitter.on("deleteChannel", (input) => deleteChannel_1.default(io, input));
    server_1.SocketEventEmitter.on("newVoiceUser", (input) => newVoiceUser_1.default(io, input));
    server_1.SocketEventEmitter.on("removeVoiceUser", (input) => deleteVoiceUser_1.default(io, input));
    //Category
    server_1.SocketEventEmitter.on("newCategory", (input) => newCategory_1.default(io, input));
    server_1.SocketEventEmitter.on("updateCategory", (input) => updateCategory_1.default(io, input));
    server_1.SocketEventEmitter.on("deleteCategory", (input) => deleteCategory_1.default(io, input));
    //Users
    server_1.SocketEventEmitter.on("newUser", (input) => newUser_1.default(io, input));
    server_1.SocketEventEmitter.on("updateUser", (input) => updateUser_1.default(io, input));
    server_1.SocketEventEmitter.on("deleteUser", (input) => deleteUser_1.default(io, input));
    //Servers
    server_1.SocketEventEmitter.on("updateServer", (input) => updateServer_1.default(io, input));
    server_1.SocketEventEmitter.on("deleteServer", (input) => deleteServer_1.default(io, input));
    //DM
    server_1.SocketEventEmitter.on("newDM", (input) => newDM_1.default(io, input));
    server_1.SocketEventEmitter.on("updateDM", (input) => updateDM_1.default(io, input));
    server_1.SocketEventEmitter.on("deleteDM", (input) => deleteDM_1.default(io, input));
};
exports.default = manager;
