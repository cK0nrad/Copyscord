import { IdeleteUser } from "../../eventInterface";

const handler = (socket, input: IdeleteUser) => {
  socket.in(input.serverID).emit("deleteUser", input);
};

export default handler;
