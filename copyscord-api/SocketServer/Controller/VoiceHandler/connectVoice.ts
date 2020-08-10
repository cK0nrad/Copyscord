import { WebRtcTransport } from "mediasoup/lib/types";
import { SocketEventEmitter } from "../../server";

const handler = async (
  { type, dtlsParameters },
  transportProducer: WebRtcTransport,
  transportConsumer: WebRtcTransport,
  socket
) => {
  if (!dtlsParameters) return { error: true };
  if (type === 0) {
    if (transportProducer.dtlsState !== "connected" && transportProducer.dtlsState !== "connecting")
      await transportProducer.connect({ dtlsParameters });
    else return { error: true };
  } else {
    if (transportConsumer.dtlsState !== "connected" && transportConsumer.dtlsState !== "connecting")
      await transportConsumer.connect({ dtlsParameters });
    else return { error: true };
  }
  //Event: voice state: 2
  socket.emit("transportConnected");
  socket.emit("statusUpdate", 2);
  return { transportProducer, transportConsumer };
};
export default handler;
