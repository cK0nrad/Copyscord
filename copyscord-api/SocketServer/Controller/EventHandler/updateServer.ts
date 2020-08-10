import { IupdateServer } from "../../eventInterface";

const handler = (socket, input: IupdateServer) => {
  input.members.forEach((x) => {
    socket.in(x.toString()).emit("updateServer", input);
  });
};

export default handler;
