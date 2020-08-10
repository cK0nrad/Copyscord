import { IdeleteServer } from "../../eventInterface";

const handler = (socket, input: IdeleteServer) => {
  input.members.forEach((x) => {
    socket.in(x.toString()).emit("deleteServer", input);
  });
};

export default handler;
