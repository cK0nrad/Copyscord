const config = {
  serverID: 0,
  publicIp: "192.168.0.111",
  CORSPort: 8081,
  voiceSocketPort: 6594,
  eventSocketPort: 8008,
  sslKey: "./cert/server.key",
  sslCert: "./cert/server.crt",
  redisIp: "127.0.0.1",
  redisPort: 6379,
  apiPort: 8080,
  mongoUri: "localhost/copyscord",
  secretSalt: "CopyscordDefaultSalt",
  maxMessagePerFetch: 500,
  minPasswordLength: 6,
  minUsernameLength: 2,
  maxUsernameLength: 100,
  maxServerPerUser: 100,
  maxInvitePerUser: 20,
  maxInvitePerServer: 1000,
  maxImageSize: 10485760, //10Mb
  locale: {},
};
export default config;

import errors from "./locale/en";
config.locale = errors;
