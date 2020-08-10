import { InewMessage } from "../../eventInterface";

const handler = (socket, input: InewMessage) => {
  socket.in(input.channelID).emit("newDM", input);
};

export default handler;
