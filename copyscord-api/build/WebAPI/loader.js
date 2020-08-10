"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./Authorize/router");
const router_2 = require("./Channels/router");
const router_3 = require("./Client/router");
const router_4 = require("./Friends/router");
const router_5 = require("./User/router");
const router_6 = require("./Server/router");
exports.default = (app) => {
    router_1.default(app);
    router_2.default(app);
    router_3.default(app);
    router_4.default(app);
    router_5.default(app);
    router_6.default(app);
};
