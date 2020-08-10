import { IdeleteMessage } from "../../eventInterface";
import { Socket } from "socket.io";

const handler = (io: Socket, input: IdeleteMessage) => {
  io.in(input.serverID).emit("deleteMessage", input);
};

export default handler;
