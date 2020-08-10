import { IdeleteCategory } from "../../eventInterface";

const handler = (socket, input: IdeleteCategory) => {
  socket.in(input.serverID).emit("deleteCategory", input);
};

export default handler;
