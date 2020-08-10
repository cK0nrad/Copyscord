import { IupdateMessage } from "../../eventInterface";

const handler = (socket, input: IupdateMessage) => {
  socket.in(input.channelID).emit("updateDM", input);
};

export default handler;
