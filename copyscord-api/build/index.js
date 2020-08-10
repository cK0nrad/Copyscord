"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./SocketServer/server");
const loader_1 = require("./WebAPI/loader");
const express = require("express");
const cors = require("cors");
const config_1 = require("./config");
const fs_1 = require("fs");
const app = express();
const https = require("https");
const privateKey = fs_1.readFileSync(config_1.default.sslKey, "utf8");
const certificate = fs_1.readFileSync(config_1.default.sslCert, "utf8");
const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
app.use(cors({
    methods: ["GET", "PUT", "DELETE", "POST"],
    optionsSuccessStatus: 200,
    origin: `https://${config_1.default.publicIp}:${config_1.default.CORSPort}`,
}));
loader_1.default(app);
app.use("/logo", express.static("logoDelivery/logo"));
app.use("/server", express.static("logoDelivery/server"));
app.use((req, res, next) => {
    res.status(404).type("json").send({ error: config_1.default.locale[1001], errorCode: 1001 });
});
httpsServer.listen(8080, () => {
    /* let i = 0;
    app._router.stack.forEach((x) => {
      if (x.route) {
        i++;
        console.log(x.route.path, x.route.stack[0].method);
      }
    });
    console.log(i);*/
    console.log("Copyscord API listening on: " + 8080);
});
