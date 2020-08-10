"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voiceManage_1 = require("../voiceManage");
const handler = async (producerOptions, transportProducer, serverID, channelID, socket, userID) => {
    let producer = await transportProducer.produce(producerOptions);
    if (voiceManage_1.producerList.has(serverID)) {
        if (!voiceManage_1.producerList.get(serverID).has(channelID))
            voiceManage_1.producerList.get(serverID).set(channelID, new Map());
        voiceManage_1.producerList.get(serverID).get(channelID).set(userID, producer.id);
    }
    else {
        voiceManage_1.producerList.set(serverID, new Map()).get(serverID).set(channelID, new Map()).get(channelID).set(userID, producer.id);
    }
    voiceManage_1.producerListSender.set(userID, producer);
    socket.emit("transportProduced", producer.id);
    socket.emit("statusUpdate", 3);
    //Event emit: we can consume the user (producer.id)
    return { done: true };
};
exports.default = handler;
