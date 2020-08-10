"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voiceManage_1 = require("../voiceManage");
const handler = async (producerId, rtpCapabilities, router, socket, transportConsumer, userID) => {
    if (router.canConsume({ producerId, rtpCapabilities })) {
        let consumer = await transportConsumer.consume({ producerId, rtpCapabilities });
        if (!voiceManage_1.producerListReceiver.has(userID))
            voiceManage_1.producerListReceiver.set(userID, new Map());
        voiceManage_1.producerListReceiver.get(userID).set(producerId, consumer);
        socket.emit("consumerProduced", {
            id: consumer.id,
            producerId: consumer.producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
        });
    }
};
exports.default = handler;
