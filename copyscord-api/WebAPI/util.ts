import config from "../config";
import monk from "monk";
import { Long } from "mongodb";
import { verify } from "jsonwebtoken";
import { Authorization, category, channelList, Server, members, Token, Bans } from "./interface";
import { createClient } from "redis";
import { promisify } from "util";

const client = createClient({ host: config.redisIp, port: config.redisPort });
const HGET = promisify(client.HGET).bind(client);
const HDEL = promisify(client.HDEL).bind(client);
const HSET = promisify(client.HSET).bind(client);
const HEXISTS = promisify(client.HEXISTS).bind(client);

const db = monk(config.mongoUri);
const dm = db.get("privateMessages");
const users = db.get("users");
const server = db.get("serverList");
const invites = db.get("invites");
const nodeList = db.get("nodeList");
const messages = db.get("messages");
const usernameList = db.get("usernameList");

//Generate an array from 1 to 9999, used for generating random userCode for a username
let fullUserCodeList = [];
for (let i = 0; i < 9999; i++) fullUserCodeList.push(i + 1);

const memberOfServer = (authorization: Authorization, serverID: Long) => {
  return authorization.server.some((server: Long) => server.equals(serverID));
};

//TODO : channelExist(), isAdmin() and isOwner([...args], server: Server) (instead of fetching server everytime for every function fetch it once before searching)
const channelExist = async (channelId: Long, serverId: string, type: number) => {
  let servers = await server.findOne({ _id: Long.fromString(serverId) });
  return servers.channels.some((category: category) => {
    return category.channelsList.some((channel: channelList) => {
      return channel.id.equals(channelId) && channel.type === type;
    });
  });
};

const isAdmin = async (user: Long, serverId: Long) => {
  let currentServer: Server = await server.findOne({ _id: serverId });
  if (!currentServer) return false;
  return currentServer.members.some((member: members) => {
    return member.id.equals(user) && (member.role === 1 || member.role === 2);
  });
};

const isOwner = async (user: Long, serverId: Long) => {
  let currentServer: Server = await server.findOne({ _id: serverId });
  if (!currentServer) return false;
  return currentServer.members.some((member: members) => {
    return member.id.equals(user) && member.role === 2;
  });
};

const isBan = (bans: Bans[], UserID: Long): boolean => {
  return bans.some((x) => x.id.equals(UserID));
};

const checkID = (userID: string): boolean => {
  return /^\d*$/.test(userID);
};

const checkUserCode = (usercode: number) => {
  return 9999 > usercode && 0 < usercode;
};

const isUserExist = async (usernameId: Long | string, usercode?: number): Promise<Array<any>> => {
  let validId = usercode ? false : checkID(usernameId.toString());

  if (!validId) return [false, { error: config.locale[5001], errorCode: 5001 }];
  if (!checkID(usernameId.toString())) return [false, { error: config.locale[5002], errorCode: 5002 }];

  let query: Object;
  if (usercode) {
    query = { username: usernameId, userCode: usercode };
  } else {
    query = { _id: usernameId };
  }

  let user: Authorization = await users.findOne(query);
  if (!user) return [false, { error: config.locale[5003], errorCode: 5003 }];

  return [user];
};

const isAuthorized = async (token: string): Promise<Authorization | false> => {
  try {
    const verification = verify(token, config.secretSalt) as Token;
    if (!verification.id) return false;
    const found = await users.findOne({ _id: Long.fromString(verification.id) });
    if (found) return found;
  } catch (e) {
    return false;
  }
};

const checkEmail = async (email: string) => {
  return await users.findOne({ email: email }).then((found) => !found);
};
//userCode: [0]: ?avaible, [1]: new userCode, [2]: need to be created
const usernameCode = async (username: string) => {
  let usernamePool = await usernameList.findOne({ username: username });
  if (!usernamePool) return [true, fullUserCodeList[Math.floor(Math.random() * fullUserCodeList.length)], true];
  if (usernamePool.pool.length === 9999) return [false];

  const intersection = fullUserCodeList.filter((element) => usernamePool.pool.indexOf(element) === -1);
  return [true, intersection[Math.floor(Math.random() * intersection.length)], false];
};

const unauthorized = (res) => {
  return res.status(401).send({ error: config.locale[2001], errorCode: 2001 });
};

const generateInvitation = async () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const prefix = [randomLetter(), randomLetter(), randomLetter()].join("");
  const surfix = (length: number) => {
    let returnArray = [length];
    while (returnArray[returnArray.length - 1] > 61) {
      let lastElement = returnArray.length - 1;
      if (returnArray[lastElement] >= 62) returnArray[lastElement] = returnArray[lastElement] % 62;
      returnArray.push(
        (length - returnArray[lastElement] - ((length - returnArray[lastElement]) % Math.pow(62, lastElement + 1))) /
          Math.pow(62, lastElement + 1)
      );
    }
    return returnArray.map((x: number) => alphabet[x]).join("");
  };
  return prefix + surfix(await invites.count());
};

export {
  generateInvitation,
  memberOfServer,
  checkUserCode,
  channelExist,
  isAuthorized,
  unauthorized,
  usernameCode,
  isUserExist,
  checkEmail,
  checkID,
  isAdmin,
  isOwner,
  isBan,
  usernameList,
  nodeList,
  messages,
  server,
  invites,
  HEXISTS,
  users,
  HDEL,
  HSET,
  HGET,
  dm,
};
