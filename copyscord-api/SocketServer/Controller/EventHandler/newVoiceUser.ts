import { InewVoiceUser } from "../../eventInterface";

const handler = (socket, input: InewVoiceUser) => {
  socket.in(input.serverID).emit("newVoiceUser", input);
};

export default handler;
