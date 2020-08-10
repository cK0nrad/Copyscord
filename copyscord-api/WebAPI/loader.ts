import Authorize from "./Authorize/router";
import Channels from "./Channels/router";
import Client from "./Client/router";
import Friends from "./Friends/router";
import User from "./User/router";
import Server from "./Server/router";

export default (app) => {
  Authorize(app);
  Channels(app);
  Client(app);
  Friends(app);
  User(app);
  Server(app);
};
