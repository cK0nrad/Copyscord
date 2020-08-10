import { IupdateCategory } from "../../eventInterface";

const handler = (socket, input: IupdateCategory) => {
  socket.in(input.serverID).emit("updateCategory", input);
};

export default handler;
