import { IupdateUser } from "../../eventInterface";
import { Socket } from "socket.io";

const handler = (socket: Socket, input: IupdateUser) => {
  if (input.serverList) {
    input.serverList.forEach((x) => {
      input.serverID = x.toString();
      socket.in(x.toString()).emit("updateUser", input);
    });
    return true;
  } else {
    socket.in(input.serverID).emit("updateUser", input);
  }
};

export default handler;
