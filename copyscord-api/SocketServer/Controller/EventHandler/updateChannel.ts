import { IupdateChannel } from "../../eventInterface";

const handler = (socket, input: IupdateChannel) => {
  socket.in(input.serverID).emit("updateChannel", input);
};

export default handler;
