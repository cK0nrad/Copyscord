import { IdeleteMessage } from "../../eventInterface";

const handler = (socket, input: IdeleteMessage) => {
  socket.in(input.serverID).emit("deleteDM", input);
};

export default handler;
