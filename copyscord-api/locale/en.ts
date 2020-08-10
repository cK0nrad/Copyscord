/*
Error code are :
{errorcode: message}
*/

import config from "../config";
export default {
  //Main (404)
  1001: "invalid action",
  1002: "internal error",
  //Authorize
  2001: "unauthorized",
  //Channels
  3001: "invalid channel ID",
  3002: "channel not found",
  3003: "channel name required",
  3004: "channel name and type required",
  3005: "channel type must be 1 or 0",
  3006: "channel type must be 0, 1 or 2",
  //Servers
  4001: "invalid server ID",
  4002: "server not found",
  4003: "you are banned",
  4004: "you are already members of the server",
  4005: "server name required",
  4006: "owner can't be ban",
  4007: "owner can't be unban",
  4008: "user isn't banned",
  4009: "owner cannot leave it own server",
  4010: "you are not members of the server",
  4011: "user not members of the server",
  //Users
  5001: "invalid user ID",
  5002: "invalid userCode",
  5003: "user not found",
  5004: "needed information missing",
  5005: `password too short (min: ${config.minPasswordLength})`,
  5006: `username too short (min: ${config.minUsernameLength})`,
  5007: "email invalid",
  5008: "email already used",
  5009: "username unavailable",
  5010: "role required",
  5011: "role must be 1 or 0",
  //Messages
  6001: "invalid message ID",
  6002: "message not found",
  6003: `limit musn't exceed ${config.maxMessagePerFetch} messages`,
  6004: "limit must be a positive integer",
  6005: "message can't be empty",
  6006: "you can't send DM to yourself",
  //Categorys
  7001: "invalid category ID",
  7002: "category not found",
  7003: "category name required",
  //Voice
  8001: "no voice node avaible",
  //Invites:
  9001: "invite not found",
  9002: "invitation required",
  9003: `limit of server per users reached (max: ${config.maxServerPerUser})`,
  9004: `max invite per server reached (max: ${config.maxInvitePerServer})`,
  9005: `max invite per user on server reached (max: ${config.maxInvitePerUser})`,
  //Client
  10001: "password required",
  10002: "nothing to update",
  10003: `username too long (max: ${config.maxUsernameLength})`,
  10004: "username is the same as the old one",
  10005: "email already used",
  10006: "bad password",
  10007: "dmFromEveryone required",
  10008: "dmFromEveryone must be a boolean",
  10009: "status required",
  10010: "status must be 0,1,2 or 3",
  //Friends
  11001: "username & usercode or userID required",
  11002: "you can't add yourself as friend",
  11003: "you are already friends",
  11004: "friend request already sent",
  11005: "you can't remove yourself from friends",
  11006: "you are not friend",
  //Logo:
  12001: "logo required",
  12002: `logo size musn't exceed ${config.maxImageSize / 1048576}Mb`,
  12003: "logo must be an image",
};
