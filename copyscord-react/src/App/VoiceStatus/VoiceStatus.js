import React, {useCallback, useContext, useEffect, useState} from "react";
import style from "./VoiceStatus.module.css";
import VoiceChannelContext from "../ContextProvider/CurrentVoiceChannel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhoneSlash} from "@fortawesome/free-solid-svg-icons";
import {GET} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import socket from "socket.io-client";
import {Device} from "mediasoup-client";

const voiceConnected = new Map()

function VoiceStatus({voiceSocket,setVoiceSocket }) {
    const {activeVoiceChannel, setVoiceChannel} = useContext(VoiceChannelContext);
    const [currentState, setCurrentState] = useState(0);
  //  const [voiceSocket, setVoiceSocket] = useState();
    const [currentVoiceChannel, setCurrentVoiceChannel] = useState();


    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [{Authorization}] = useCookies();



    const disconnect = useCallback(() => {
        setIsDisconnecting(true)
        if (voiceSocket) voiceSocket.disconnect()
        setVoiceSocket(null)
        setVoiceChannel({})
        setCurrentState(0)
        setIsDisconnecting(false)

    }, [voiceSocket, setVoiceSocket, setVoiceChannel])

    useEffect(() => {
        (async () => {
            let receiver;
            let sender;
            if (voiceSocket && activeVoiceChannel.id !== activeVoiceChannel) {
                voiceSocket.emit("joinChannel", {
                    serverId: activeVoiceChannel.serverID,
                    channelId: activeVoiceChannel.id,
                    authorizationToken: Authorization,
                });
                voiceSocket.on("problem", "[VOICE SOCKET ERROR]: " + console.log);

                voiceSocket.removeListener("rtpCapabilities");
                voiceSocket.on("rtpCapabilities", async ({routerRtpCapabilities, receiverTransportOption, senderTransportOption}) => {
                    let device = new Device()
                    await device.load({routerRtpCapabilities});
                    receiver = await device.createRecvTransport(receiverTransportOption);
                    sender = await device.createSendTransport(senderTransportOption);
                    sender.on("connect", ({dtlsParameters}, callback) => {
                        voiceSocket.emit("connectMe", {type: 0, dtlsParameters});
                        voiceSocket.on("transportConnected", callback);
                    });
                    sender.on("produce", (producerOptions, callback) => {
                        voiceSocket.emit("produceMe", {producerOptions});
                        voiceSocket.on("transportProduced", callback);
                    });
                    receiver.on("connect", ({dtlsParameters}, callback) => {
                        voiceSocket.emit("connectMe", {type: 1, dtlsParameters});
                        voiceSocket.on("transportConnected", callback);
                    });


                    voiceSocket.removeListener("statusUpdate");
                    voiceSocket.on("statusUpdate", (status) => {
                        if (status === 3) {
                            setCurrentState(1)
                            voiceSocket.emit("producerList");
                        }
                    });

                    voiceSocket.removeListener("producerList");
                    voiceSocket.on("producerList", ([map, myId]) => {
                        map.forEach((id) => {
                            if (id !== myId)
                                voiceSocket.emit("consumeMe", {rtpCapabilities: device.rtpCapabilities, producerId: id})
                        });
                    });

                    let stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: false,
                        },
                    });

                    await sender.produce({
                        track: stream.getTracks()[0],
                    });
                    voiceSocket.removeListener("newUser");
                    voiceSocket.on("newUser", ([user, id]) => {
                        voiceSocket.emit("consumeMe", {rtpCapabilities: device.rtpCapabilities, producerId: id});
                    });

                    voiceSocket.removeListener("consumerProduced");
                    voiceSocket.on("consumerProduced", async (ConsumerOptions) => {
                        let consumer = await receiver.consume(ConsumerOptions);
                        let audio = document.createElement("audio");
                        audio.srcObject = new MediaStream([consumer.track]);
                        await audio.play();
                        voiceConnected.set(ConsumerOptions.producerId, audio)
                    });

                    voiceSocket.removeListener("removeProducer");
                    voiceSocket.on("removeProducer", (id) => {
                        voiceConnected.delete(id)

                    });

                })
            }
        })()

    }, [voiceSocket, setCurrentState, activeVoiceChannel, Authorization])

    useEffect(() => {
        if (!voiceSocket && !isDisconnecting && currentVoiceChannel !== activeVoiceChannel.id) {
            GET(`channels/${activeVoiceChannel.serverID}/${activeVoiceChannel.id}/voice/connect`, {}, Authorization).then(({ip, port, error}) => {
                if (!error) {
                    setCurrentVoiceChannel(activeVoiceChannel.id)
                    setVoiceSocket(socket(`https://${ip}:${port}`));
                    setCurrentState(0)
                }
            })
        } else if (voiceSocket && currentVoiceChannel !== activeVoiceChannel.id && !isDisconnecting) {
            voiceSocket.disconnect()
            voiceConnected.clear()
            GET(`channels/${activeVoiceChannel.serverID}/${activeVoiceChannel.id}/voice/connect`, {}, Authorization).then(({ip, port, error}) => {
                if (!error) {
                    setCurrentVoiceChannel(activeVoiceChannel.id)
                    setVoiceSocket(socket(`https://${ip}:${port}`));
                    setCurrentState(0)
                }
            })

        }
    }, [setVoiceSocket, activeVoiceChannel, setVoiceChannel, Authorization, voiceSocket, setCurrentState, currentVoiceChannel, isDisconnecting]);

    return (
        <div className={style.handler}>
            <div>
                {currentState ? <div className={style.connected}>Connected</div> : <div className={style.connecting}>Connecting...</div>}
                <div className={style.channelName}>@{activeVoiceChannel ? activeVoiceChannel.name : null}</div>
            </div>
            <div>
                <div className={style.disconnect} onClick={disconnect}>
                    <FontAwesomeIcon icon={faPhoneSlash}/>
                </div>
            </div>
        </div>
    );
}

export default VoiceStatus;
