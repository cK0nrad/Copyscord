import * as multer from "multer";

import postClientDmID from "./Controller/POST/postClientDmID";

import putClient from "./Controller/PUT/putClient";
import putClientLogo from "./Controller/PUT/putClientLogo";
import putClientDmable from "./Controller/PUT/putClientDmable";
import putClientStatus from "./Controller/PUT/putClientStatus";
import putClientDmIDMessageID from "./Controller/PUT/putClientDmIDMessageID";

import getClient from "./Controller/GET/getClient";
import getClientDm from "./Controller/GET/getClientDm";
import getClientLogo from "./Controller/GET/getClientLogo";
import getClientDmID from "./Controller/GET/getClientDmID";
import getClientDmable from "./Controller/GET/getClientDmable";
import getClientStatus from "./Controller/GET/getClientStatus";

import deleteClientLogo from "./Controller/DELETE/deleteClientLogo";
import deleteClientDmID from "./Controller/DELETE/deleteClientDmID";
import deleteClientDmIDMessageID from "./Controller/DELETE/deleteClientDmIDMessageID";

const router = (app) => {
  //POST
  app.post("/client/dm/:id", postClientDmID);
  //PUT
  app.put("/client", putClient);
  app.put("/client/logo", multer().single("logo"), putClientLogo);
  app.put("/client/dmable", putClientDmable);
  app.put("/client/status", putClientStatus);
  app.put("/client/dm/:id/:messageId", putClientDmIDMessageID);
  //GET
  app.get("/client", getClient);
  app.get("/client/dm", getClientDm);
  app.get("/client/logo", getClientLogo);
  app.get("/client/dm/:id", getClientDmID);
  app.get("/client/dmable", getClientDmable);
  app.get("/client/status", getClientStatus);
  //DELETE
  app.delete("/client/logo", deleteClientLogo);
  app.delete("/client/dm/:id", deleteClientDmID);
  app.delete("/client/dm/:id/:messageId", deleteClientDmIDMessageID);
};

export default router;
