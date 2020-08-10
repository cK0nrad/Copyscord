import { producerListReceiver } from "../voiceManage";

const handler = async (producerId, rtpCapabilities, router, socket, transportConsumer, userID) => {
  if (router.canConsume({ producerId, rtpCapabilities })) {
    let consumer = await transportConsumer.consume({ producerId, rtpCapabilities });
    if (!producerListReceiver.has(userID)) producerListReceiver.set(userID, new Map());
    producerListReceiver.get(userID).set(producerId, consumer);
    socket.emit("consumerProduced", {
      id: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    });
  }
};
export default handler;
