"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postUser_1 = require("./Controller/POST/postUser");
const getUserID_1 = require("./Controller/GET/getUserID");
const router = (app) => {
    //POST
    app.post("/user", postUser_1.default);
    //GET
    app.get("/user/:id", getUserID_1.default);
};
exports.default = router;
