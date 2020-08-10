import { Socket } from "socket.io";
import { isAuthorized } from "../../../WebAPI/util";

const handler = async (socket: Socket, input) => {
  if (!input.Authorization) return socket.emit("problem", "unauthorized");
  let authorization = await isAuthorized(input.Authorization);
  if (!authorization) return socket.emit("problem", "unauthorized");
  authorization.server.forEach((x) => socket.join(x.toString()));
};

export default handler;
