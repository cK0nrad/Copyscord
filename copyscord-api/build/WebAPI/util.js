"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dm = exports.HGET = exports.HSET = exports.HDEL = exports.users = exports.HEXISTS = exports.invites = exports.server = exports.messages = exports.nodeList = exports.usernameList = exports.isBan = exports.isOwner = exports.isAdmin = exports.checkID = exports.checkEmail = exports.isUserExist = exports.usernameCode = exports.unauthorized = exports.isAuthorized = exports.channelExist = exports.checkUserCode = exports.memberOfServer = exports.generateInvitation = void 0;
const config_1 = require("../config");
const monk_1 = require("monk");
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = require("jsonwebtoken");
const redis_1 = require("redis");
const util_1 = require("util");
const client = redis_1.createClient({ host: config_1.default.redisIp, port: config_1.default.redisPort });
const HGET = util_1.promisify(client.HGET).bind(client);
exports.HGET = HGET;
const HDEL = util_1.promisify(client.HDEL).bind(client);
exports.HDEL = HDEL;
const HSET = util_1.promisify(client.HSET).bind(client);
exports.HSET = HSET;
const HEXISTS = util_1.promisify(client.HEXISTS).bind(client);
exports.HEXISTS = HEXISTS;
const db = monk_1.default(config_1.default.mongoUri);
const dm = db.get("privateMessages");
exports.dm = dm;
const users = db.get("users");
exports.users = users;
const server = db.get("serverList");
exports.server = server;
const invites = db.get("invites");
exports.invites = invites;
const nodeList = db.get("nodeList");
exports.nodeList = nodeList;
const messages = db.get("messages");
exports.messages = messages;
const usernameList = db.get("usernameList");
exports.usernameList = usernameList;
//Generate an array from 1 to 9999, used for generating random userCode for a username
let fullUserCodeList = [];
for (let i = 0; i < 9999; i++)
    fullUserCodeList.push(i + 1);
const memberOfServer = (authorization, serverID) => {
    return authorization.server.some((server) => server.equals(serverID));
};
exports.memberOfServer = memberOfServer;
//TODO : channelExist(), isAdmin() and isOwner([...args], server: Server) (instead of fetching server everytime for every function fetch it once before searching)
const channelExist = async (channelId, serverId, type) => {
    let servers = await server.findOne({ _id: mongodb_1.Long.fromString(serverId) });
    return servers.channels.some((category) => {
        return category.channelsList.some((channel) => {
            return channel.id.equals(channelId) && channel.type === type;
        });
    });
};
exports.channelExist = channelExist;
const isAdmin = async (user, serverId) => {
    let currentServer = await server.findOne({ _id: serverId });
    if (!currentServer)
        return false;
    return currentServer.members.some((member) => {
        return member.id.equals(user) && (member.role === 1 || member.role === 2);
    });
};
exports.isAdmin = isAdmin;
const isOwner = async (user, serverId) => {
    let currentServer = await server.findOne({ _id: serverId });
    if (!currentServer)
        return false;
    return currentServer.members.some((member) => {
        return member.id.equals(user) && member.role === 2;
    });
};
exports.isOwner = isOwner;
const isBan = (bans, UserID) => {
    return bans.some((x) => x.id.equals(UserID));
};
exports.isBan = isBan;
const checkID = (userID) => {
    return /^\d*$/.test(userID);
};
exports.checkID = checkID;
const checkUserCode = (usercode) => {
    return 9999 > usercode && 0 < usercode;
};
exports.checkUserCode = checkUserCode;
const isUserExist = async (usernameId, usercode) => {
    let validId = usercode ? false : checkID(usernameId.toString());
    if (!validId)
        return [false, { error: config_1.default.locale[5001], errorCode: 5001 }];
    if (!checkID(usernameId.toString()))
        return [false, { error: config_1.default.locale[5002], errorCode: 5002 }];
    let query;
    if (usercode) {
        query = { username: usernameId, userCode: usercode };
    }
    else {
        query = { _id: usernameId };
    }
    let user = await users.findOne(query);
    if (!user)
        return [false, { error: config_1.default.locale[5003], errorCode: 5003 }];
    return [user];
};
exports.isUserExist = isUserExist;
const isAuthorized = async (token) => {
    try {
        const verification = jsonwebtoken_1.verify(token, config_1.default.secretSalt);
        if (!verification.id)
            return false;
        const found = await users.findOne({ _id: mongodb_1.Long.fromString(verification.id) });
        if (found)
            return found;
    }
    catch (e) {
        return false;
    }
};
exports.isAuthorized = isAuthorized;
const checkEmail = async (email) => {
    return await users.findOne({ email: email }).then((found) => !found);
};
exports.checkEmail = checkEmail;
//userCode: [0]: ?avaible, [1]: new userCode, [2]: need to be created
const usernameCode = async (username) => {
    let usernamePool = await usernameList.findOne({ username: username });
    if (!usernamePool)
        return [true, fullUserCodeList[Math.floor(Math.random() * fullUserCodeList.length)], true];
    if (usernamePool.pool.length === 9999)
        return [false];
    const intersection = fullUserCodeList.filter((element) => usernamePool.pool.indexOf(element) === -1);
    return [true, intersection[Math.floor(Math.random() * intersection.length)], false];
};
exports.usernameCode = usernameCode;
const unauthorized = (res) => {
    return res.status(401).send({ error: config_1.default.locale[2001], errorCode: 2001 });
};
exports.unauthorized = unauthorized;
const generateInvitation = async () => {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
    const prefix = [randomLetter(), randomLetter(), randomLetter()].join("");
    const surfix = (length) => {
        let returnArray = [length];
        while (returnArray[returnArray.length - 1] > 61) {
            let lastElement = returnArray.length - 1;
            if (returnArray[lastElement] >= 62)
                returnArray[lastElement] = returnArray[lastElement] % 62;
            returnArray.push((length - returnArray[lastElement] - ((length - returnArray[lastElement]) % Math.pow(62, lastElement + 1))) /
                Math.pow(62, lastElement + 1));
        }
        return returnArray.map((x) => alphabet[x]).join("");
    };
    return prefix + surfix(await invites.count());
};
exports.generateInvitation = generateInvitation;
