import { InewMessage } from "../../eventInterface";
import { Socket } from "socket.io";

const handler = (io: Socket, input: InewMessage) => {
  io.in(input.serverID).emit("newMessage", input);
};

export default handler;
