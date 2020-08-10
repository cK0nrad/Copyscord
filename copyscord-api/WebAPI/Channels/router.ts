import postMessage from "./Controller/POST/postMessage";

import putChannel from "./Controller/PUT/putChannel";
import putChannelMessage from "./Controller/PUT/putChannelMessage";

import getChannel from "./Controller/GET/getChannel";
import getMessages from "./Controller/GET/getMessages";
import getVoice from "./Controller/GET/getVoice";
import getVoiceConnect from "./Controller/GET/getVoiceConnect";

import deleteChannel from "./Controller/DELETE/deleteChannel";
import deleteMessage from "./Controller/DELETE/deleteMessage";

const router = (app) => {
  //POST
  app.post("/channels/:id/:channelId/messages", postMessage);
  //PUT
  app.put("/channels/:id/:channelId", putChannel);
  app.put("/channels/:id/:channelId/:messageId", putChannelMessage);
  //GET
  app.get("/channels/:id/:channelId", getChannel);
  app.get("/channels/:id/:channelId/messages", getMessages);
  app.get("/channels/:id/:channelId/voice", getVoice);
  app.get("/channels/:id/:channelId/voice/connect", getVoiceConnect);
  //DELETE
  app.delete("/channels/:id/:channelId", deleteChannel);
  app.delete("/channels/:id/:channelId/:messageId", deleteMessage);
};

export default router;
