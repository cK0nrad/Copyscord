import postFriend from "./Controller/POST/postFriends";

import getFriends from "./Controller/GET/getFriends";
import getFriendsID from "./Controller/GET/getFriendsID";
import getFriendsRequests from "./Controller/GET/getFriendsRequests";

import deleteFriends from "./Controller/DELETE/deleteFriends";
import deleteFriendsRequestID from "./Controller/DELETE/deleteFriendsRequestID";

const router = (app) => {
  //POST
  app.post("/friends", postFriend);
  //GET
  app.get("/friends", getFriends);
  app.get("/friends/request", getFriendsRequests);
  app.get("/friends/:id", getFriendsID);
  //DELETE
  app.delete("/friends", deleteFriends);
  app.delete("/friends/request/:id", deleteFriendsRequestID);
};

export default router;
