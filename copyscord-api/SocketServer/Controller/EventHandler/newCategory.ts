import { InewCategory } from "../../eventInterface";

const handler = (socket, input: InewCategory) => {
  socket.in(input.serverID).emit("newCategory", input);
};

export default handler;
