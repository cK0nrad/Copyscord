import { subscribeServer } from "../../eventInterface";
import { isAuthorized, memberOfServer } from "../../../WebAPI/util";
import { Long } from "mongodb";

const handler = async (socket, input: subscribeServer) => {
  if (!input) return socket.emit("problem", "unauthorized");
  if (!input.Authorization || !input.serverID) return socket.emit("problem", "unauthorized");
  let authorization = await isAuthorized(input.Authorization);
  if (!authorization) return socket.emit("problem", "unauthorized");
  if (!memberOfServer(authorization, Long.fromString(input.serverID))) return socket.emit("problem", "not member of the server");
  socket.join(input.serverID);
};

export default handler;
