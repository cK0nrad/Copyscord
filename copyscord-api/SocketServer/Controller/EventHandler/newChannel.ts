import { InewChannel } from "../../eventInterface";
import { Socket } from "socket.io";

const handler = (socket: Socket, input: InewChannel) => {
  socket.in(input.serverID).emit("newChannel", input);
};

export default handler;
