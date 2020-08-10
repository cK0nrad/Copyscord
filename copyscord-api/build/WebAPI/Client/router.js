"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const postClientDmID_1 = require("./Controller/POST/postClientDmID");
const putClient_1 = require("./Controller/PUT/putClient");
const putClientLogo_1 = require("./Controller/PUT/putClientLogo");
const putClientDmable_1 = require("./Controller/PUT/putClientDmable");
const putClientStatus_1 = require("./Controller/PUT/putClientStatus");
const putClientDmIDMessageID_1 = require("./Controller/PUT/putClientDmIDMessageID");
const getClient_1 = require("./Controller/GET/getClient");
const getClientDm_1 = require("./Controller/GET/getClientDm");
const getClientLogo_1 = require("./Controller/GET/getClientLogo");
const getClientDmID_1 = require("./Controller/GET/getClientDmID");
const getClientDmable_1 = require("./Controller/GET/getClientDmable");
const getClientStatus_1 = require("./Controller/GET/getClientStatus");
const deleteClientLogo_1 = require("./Controller/DELETE/deleteClientLogo");
const deleteClientDmID_1 = require("./Controller/DELETE/deleteClientDmID");
const deleteClientDmIDMessageID_1 = require("./Controller/DELETE/deleteClientDmIDMessageID");
const router = (app) => {
    //POST
    app.post("/client/dm/:id", postClientDmID_1.default);
    //PUT
    app.put("/client", putClient_1.default);
    app.put("/client/logo", multer().single("logo"), putClientLogo_1.default);
    app.put("/client/dmable", putClientDmable_1.default);
    app.put("/client/status", putClientStatus_1.default);
    app.put("/client/dm/:id/:messageId", putClientDmIDMessageID_1.default);
    //GET
    app.get("/client", getClient_1.default);
    app.get("/client/dm", getClientDm_1.default);
    app.get("/client/logo", getClientLogo_1.default);
    app.get("/client/dm/:id", getClientDmID_1.default);
    app.get("/client/dmable", getClientDmable_1.default);
    app.get("/client/status", getClientStatus_1.default);
    //DELETE
    app.delete("/client/logo", deleteClientLogo_1.default);
    app.delete("/client/dm/:id", deleteClientDmID_1.default);
    app.delete("/client/dm/:id/:messageId", deleteClientDmIDMessageID_1.default);
};
exports.default = router;
