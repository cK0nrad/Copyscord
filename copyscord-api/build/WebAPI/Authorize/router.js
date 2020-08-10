"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorize_1 = require("./Controller/GET/authorize");
const router = (app) => {
    app.get("/authorize", authorize_1.default);
};
exports.default = router;
