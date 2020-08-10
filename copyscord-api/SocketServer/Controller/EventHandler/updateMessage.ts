import { IupdateMessage } from "../../eventInterface";
import { Socket } from "socket.io";

const handler = (io: Socket, input: IupdateMessage) => {
  io.in(input.serverID).emit("updateMessage", input);
};

export default handler;
