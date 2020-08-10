import { IdeleteServer, IdeleteChannel } from "../../eventInterface";

const handler = (socket, input: IdeleteChannel) => {
  socket.in(input.serverID).emit("deleteChannel", input);
};

export default handler;
