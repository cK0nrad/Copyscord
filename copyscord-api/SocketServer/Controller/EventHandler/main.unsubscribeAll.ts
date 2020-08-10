import { Socket } from "socket.io";
import { isAuthorized } from "../../../WebAPI/util";

const handler = async (socket: Socket, input) => {
  if (!input.Authorization) return socket.emit("problem", "unauthorized");
  let authorization = await isAuthorized(input.Authorization);
  if (!authorization) return socket.emit("problem", "unauthorized");
  if (typeof socket.rooms === "object") Object.keys(socket.rooms).map((x) => socket.leave(x));
  authorization.server.forEach((x) => socket.leave(x.toString()));
};

export default handler;
