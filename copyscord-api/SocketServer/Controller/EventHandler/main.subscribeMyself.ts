import { Socket } from "socket.io";
import { subscribeMyself } from "../../eventInterface";
import { isAuthorized } from "../../../WebAPI/util";

const handler = async (socket: Socket, input: subscribeMyself) => {
  let authorization = await isAuthorized(input.Authorization);
  if (!input.Authorization) return socket.emit("problem", "unauthorized");
  if (!authorization) return socket.emit("problem", "unauthorized");
  return socket.join(authorization._id.toString());
};

export default handler;
