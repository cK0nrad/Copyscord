import "./SocketServer/server";
import mainApp from "./WebAPI/loader";
import express = require("express");
import cors = require("cors");
import config from "./config";
import { readFileSync } from "fs";
const app = express();

const https = require("https");
const privateKey = readFileSync(config.sslKey, "utf8");
const certificate = readFileSync(config.sslCert, "utf8");
const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

app.use(
  cors({
    methods: ["GET", "PUT", "DELETE", "POST"],
    optionsSuccessStatus: 200,
    origin: `https://${config.publicIp}:${config.CORSPort}`,
  })
);
mainApp(app);
app.use("/logo", express.static("logoDelivery/logo"));
app.use("/server", express.static("logoDelivery/server"));
app.use((req, res, next) => {
  res.status(404).type("json").send({ error: config.locale[1001], errorCode: 1001 });
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
