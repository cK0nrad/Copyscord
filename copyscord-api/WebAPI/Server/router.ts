import postServer from "./Controller/POST/postServer";
import postServerJoin from "./Controller/POST/postServerJoin";
import postServerIDCategory from "./Controller/POST/postServerIDCategory";
import postServerIDCategoryIDChannels from "./Controller/POST/postServerIDCategoryIDChannels";
import postServerIDBandsUserID from "./Controller/POST/postServerIDBandsUserID";
import postServerIDInvites from "./Controller/POST/postServerIDInvites";

import putServerID from "./Controller/PUT/putServerID";
import putServerIDLogo from "./Controller/PUT/putServerIDLogo";
import putServerIDCategoryID from "./Controller/PUT/putServerIDCategoryID";
import putServerIDMembersUserID from "./Controller/PUT/putServerIDMembersUserID";

import getServer from "./Controller/GET/getServer";
import getServerID from "./Controller/GET/getServerID";
import getServerIDChannels from "./Controller/GET/getServerIDChannels";
import getServerIDCategory from "./Controller/GET/getServerIDCategory";
import getServerIDCategoryIDChannels from "./Controller/GET/getServerIDCategoryIDChannels";
import getServerIDMembers from "./Controller/GET/getServerIDMembers";
import getServerIDMembersUserID from "./Controller/GET/getServerIDMembersUserID";
import getServerIDBans from "./Controller/GET/getServerIDBans";
import getServerIDInvites from "./Controller/GET/getServerIDInvites";
import getServerIDInvitesAll from "./Controller/GET/getServerIDInvitesAll";
import getServerVoice from "./Controller/GET/getServerVoice";

import deleteServerID from "./Controller/DELETE/deleteServerID";
import deleteServerIDLogo from "./Controller/DELETE/deleteServerIDLogo";
import deleteServerIDLeave from "./Controller/DELETE/deleteServerIDLeave";
import deleteServerIDInvites from "./Controller/DELETE/deleteServerIDInvites";
import deleteServerIDBansUserID from "./Controller/DELETE/deleteServerIDBansUserID";
import deleteServerIDCategoryID from "./Controller/DELETE/deleteServerIDCategoryID";

import * as multer from "multer";

const router = (app) => {
  //POST
  app.post("/server", postServer);
  app.post("/server/join", postServerJoin);
  app.post("/server/:id/category", postServerIDCategory);
  app.post("/server/:id/:categoryId/channels", postServerIDCategoryIDChannels);
  app.post("/server/:id/bans/:userId", postServerIDBandsUserID);
  app.post("/server/:id/invites", postServerIDInvites);
  //PUT
  app.put("/server/:id", putServerID);
  app.put("/server/:id/logo", multer().single("logo"), putServerIDLogo);
  app.put("/server/:id/:categoryId", putServerIDCategoryID);
  app.put("/server/:id/members/:userId", putServerIDMembersUserID);
  //GET
  app.get("/server", getServer);
  app.get("/server/:id", getServerID);
  app.get("/server/:id/channels", getServerIDChannels);
  app.get("/server/:id/category", getServerIDCategory);
  app.get("/server/:id/bans", getServerIDBans);
  app.get("/server/:id/voice", getServerVoice);
  app.get("/server/:id/invites", getServerIDInvites);
  app.get("/server/:id/invites/all", getServerIDInvitesAll);
  app.get("/server/:id/members", getServerIDMembers);
  app.get("/server/:id/members/:userId", getServerIDMembersUserID);
  app.get("/server/:id/:categoryId/channels", getServerIDCategoryIDChannels);
  //DELETE
  app.delete("/server/:id", deleteServerID);
  app.delete("/server/:id/logo", deleteServerIDLogo);
  app.delete("/server/:id/leave", deleteServerIDLeave);
  app.delete("/server/:id/invites", deleteServerIDInvites);
  app.delete("/server/:id/bans/:userId", deleteServerIDBansUserID);
  app.delete("/server/:id/:categoryId", deleteServerIDCategoryID);
};

export default router;
