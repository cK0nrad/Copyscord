import { InewUser } from "../../eventInterface";

const handler = (socket, input: InewUser) => {
  socket.in(input.serverID).emit("newUser", input);
};

export default handler;
