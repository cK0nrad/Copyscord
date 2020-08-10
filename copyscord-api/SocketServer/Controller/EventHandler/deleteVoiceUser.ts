import { IremoveVoiceUser } from "../../eventInterface";

const handler = (socket, input: IremoveVoiceUser) => {
  socket.in(input.serverID).emit("removeVoiceUser", input);
};

export default handler;
