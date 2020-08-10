import { producerList, producerListSender } from "../voiceManage";

const handler = async (producerOptions, transportProducer, serverID, channelID, socket, userID) => {
  let producer = await transportProducer.produce(producerOptions);

  if (producerList.has(serverID)) {
    if (!producerList.get(serverID).has(channelID)) producerList.get(serverID).set(channelID, new Map());
    producerList.get(serverID).get(channelID).set(userID, producer.id);
  } else {
    producerList.set(serverID, new Map()).get(serverID).set(channelID, new Map()).get(channelID).set(userID, producer.id);
  }

  producerListSender.set(userID, producer);

  socket.emit("transportProduced", producer.id);
  socket.emit("statusUpdate", 3);
  //Event emit: we can consume the user (producer.id)
  return { done: true };
};
export default handler;
