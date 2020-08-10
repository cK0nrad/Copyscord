import { SocketEventEmitter } from "../server";
import newMessage from "./EventHandler/newMessage";
import updateMessage from "./EventHandler/updateMessage";
import deleteMessage from "./EventHandler/deleteMessage";
import newChannel from "./EventHandler/newChannel";
import updateChannel from "./EventHandler/updateChannel";
import deleteChannel from "./EventHandler/deleteChannel";
import newCategory from "./EventHandler/newCategory";
import updateCategory from "./EventHandler/updateCategory";
import newVoiceUser from "./EventHandler/newVoiceUser";
import deleteVoiceUser from "./EventHandler/deleteVoiceUser";
import deleteCategory from "./EventHandler/deleteCategory";
import newUser from "./EventHandler/newUser";
import updateUser from "./EventHandler/updateUser";
import deleteUser from "./EventHandler/deleteUser";
import newDM from "./EventHandler/newDM";
import updateDM from "./EventHandler/updateDM";
import deleteDM from "./EventHandler/deleteDM";
import updateServer from "./EventHandler/updateServer";
import deleteServer from "./EventHandler/deleteServer";

const manager = (io) => {
  //API => socket event
  //Messages
  SocketEventEmitter.on("newMessage", (input) => newMessage(io, input));
  SocketEventEmitter.on("updateMessage", (input) => updateMessage(io, input));
  SocketEventEmitter.on("deleteMessage", (input) => deleteMessage(io, input));
  //Channels
  SocketEventEmitter.on("newChannel", (input) => newChannel(io, input));
  SocketEventEmitter.on("updateChannel", (input) => updateChannel(io, input));
  SocketEventEmitter.on("deleteChannel", (input) => deleteChannel(io, input));
  SocketEventEmitter.on("newVoiceUser", (input) => newVoiceUser(io, input));
  SocketEventEmitter.on("removeVoiceUser", (input) => deleteVoiceUser(io, input));

  //Category
  SocketEventEmitter.on("newCategory", (input) => newCategory(io, input));
  SocketEventEmitter.on("updateCategory", (input) => updateCategory(io, input));
  SocketEventEmitter.on("deleteCategory", (input) => deleteCategory(io, input));
  //Users
  SocketEventEmitter.on("newUser", (input) => newUser(io, input));
  SocketEventEmitter.on("updateUser", (input) => updateUser(io, input));
  SocketEventEmitter.on("deleteUser", (input) => deleteUser(io, input));
  //Servers
  SocketEventEmitter.on("updateServer", (input) => updateServer(io, input));
  SocketEventEmitter.on("deleteServer", (input) => deleteServer(io, input));
  //DM
  SocketEventEmitter.on("newDM", (input) => newDM(io, input));
  SocketEventEmitter.on("updateDM", (input) => updateDM(io, input));
  SocketEventEmitter.on("deleteDM", (input) => deleteDM(io, input));
};
export default manager;
