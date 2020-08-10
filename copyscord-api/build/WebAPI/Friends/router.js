"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postFriends_1 = require("./Controller/POST/postFriends");
const getFriends_1 = require("./Controller/GET/getFriends");
const getFriendsID_1 = require("./Controller/GET/getFriendsID");
const getFriendsRequests_1 = require("./Controller/GET/getFriendsRequests");
const deleteFriends_1 = require("./Controller/DELETE/deleteFriends");
const deleteFriendsRequestID_1 = require("./Controller/DELETE/deleteFriendsRequestID");
const router = (app) => {
    //POST
    app.post("/friends", postFriends_1.default);
    //GET
    app.get("/friends", getFriends_1.default);
    app.get("/friends/request", getFriendsRequests_1.default);
    app.get("/friends/:id", getFriendsID_1.default);
    //DELETE
    app.delete("/friends", deleteFriends_1.default);
    app.delete("/friends/request/:id", deleteFriendsRequestID_1.default);
};
exports.default = router;
