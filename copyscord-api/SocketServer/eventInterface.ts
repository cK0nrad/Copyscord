import { Long } from "mongodb";

export interface InewMessage {
  channelID: string;
  messageID: string;
  content: string;
  authorID: string;
  authorName: string;
  authorLogo: string;
  authorCode: number;
  date: number;
  serverID: string;
  authorStatus?: number;
}

export interface IupdateMessage {
  serverID: string;
  channelID: string;
  authorID: string;
  messageID: string;
  newContent: string;
}

export interface IdeleteMessage {
  serverID: string;
  channelID: string;
  authorID: string;
  messageID: string;
}
export interface InewChannel {
  serverID: string;
  categoryID: string;
  channelID: string;
  channelName: string;
  type: number;
}
export interface IupdateChannel {
  serverID: string;
  channelID: string;
  newChannelName: string;
}
export interface IdeleteChannel {
  serverID: string;
  channelID: string;
}
export interface InewCategory {
  serverID: string;
  categoryID: string;
  categoryName: string;
}
export interface IupdateCategory {
  serverID: string;
  categoryID: string;
  newCategoryName: string;
}
export interface IdeleteCategory {
  serverID: string;
  categoryID: string;
}
export interface InewUser {
  serverID: string;
  userID: string;
  username: string;
  logoUrl: string;
  userCode: number;
  status: number;
}
export interface IupdateUser {
  serverList?: Long[];
  serverID?: string;
  userID: string;
  username?: string;
  logoUrl?: string;
  userCode?: number;
  status?: number;
  role?: number;
}
export interface IdeleteUser {
  serverID: string;
  userID: string;
}
export interface IupdateServer {
  serverID: string;
  name: string;
  logoUrl: string;
  members: string[];
}
export interface IdeleteServer {
  serverID: string;
  members: string[];
}

export interface InewVoiceUser {
  serverID: string;
  username: string;
  id: string;
  logoUrl: string;
  channelID: string;
}
export interface IremoveVoiceUser {
  serverID: string;
  channelID: string;
  id: string;
}

interface SocketEventHandlerInterface {
  newMessage: (input: InewMessage) => void;
  updateMessage: (input: IupdateMessage) => void;
  deleteMessage: (input: IdeleteMessage) => void;
  newChannel: (input: InewChannel) => void;
  updateChannel: (input: IupdateChannel) => void;
  deleteChannel: (input: IdeleteChannel) => void;
  newVoiceUser: (input: InewVoiceUser) => void;
  removeVoiceUser: (input: IremoveVoiceUser) => void;
  newCategory: (input: InewCategory) => void;
  updateCategory: (input: IupdateCategory) => void;
  deleteCategory: (input: IdeleteCategory) => void;
  newUser: (input: InewUser) => void;
  updateUser: (input: IupdateUser) => void;
  deleteUser: (input: IdeleteUser) => void;
  updateServer: (input: IupdateServer) => void;
  deleteServer: (input: IdeleteServer) => void;
  newDM: (input: InewMessage) => void;
  updateDM: (input: IupdateMessage) => void;
  deleteDM: (input: IdeleteMessage) => void;
}

export interface subscribeChannel {
  Authorization: string;
  channelID: string;
}

export interface subscribeServer {
  Authorization: string;
  serverID: string;
}

export interface subscribeMyself {
  Authorization: string;
}

export interface subscribeAll {
  Authorization: string;
}

export interface SocketEventHandler {
  on<U extends keyof SocketEventHandlerInterface>(event: U, listener: SocketEventHandlerInterface[U]): this;
  emit<U extends keyof SocketEventHandlerInterface>(event: U, ...args: Parameters<SocketEventHandlerInterface[U]>): boolean;
}
