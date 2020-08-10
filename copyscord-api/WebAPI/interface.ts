import { Long, Timestamp } from "mongodb";
import { Express } from "express";
interface friendRequest {
  send: Array<Long>;
  received: Array<Long>;
}

interface dmList {
  id: Long;
  lastMessage: number;
}

interface Authorization {
  _id: Long;
  status: number;
  username: string;
  email: string;
  password: string;
  userCode: number;
  friend: Array<Long>;
  friendRequest: friendRequest;
  server: Array<Long>;
  logoUrl: string;
  dmList: Array<dmList>;
  dmFromEveryone: boolean;
}

interface invite {
  invite: string;
  author: Long;
  date: number;
}

interface members {
  id: Long;
  role: number;
}

interface channelList {
  id: Long;
  name: string;
  type: number;
}

interface category {
  categoryName: string;
  categoryId: Long;
  channelsList: Array<channelList>;
}
interface Bans {
  id: Long;
  author: Long;
}
interface Server {
  _id: Long;
  name: string;
  logoUrl: string;
  owner: Long;
  invite: Array<invite>;
  members: Array<members>;
  channels: Array<category>;
  bans: Array<Bans>;
}

interface Token {
  id: string;
}

interface Invite {
  invite: string;
  server: Long;
  author: Long;
  date: number;
  unavaible?: boolean;
}

export { Token, Authorization, Server, category, channelList, members, dmList, Invite, Bans };
