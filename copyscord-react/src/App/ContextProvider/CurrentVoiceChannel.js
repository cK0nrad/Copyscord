import React, { useState } from "react";

const VoiceChannelContext = React.createContext({});


export const CurrentVoiceChannel = ({ children }) => {
    const [currentVoiceChannel, setCurrentVoiceChannel] = useState({});
    const setVoiceChannel = (values) => {
        setCurrentVoiceChannel(values)
    };
    return (
        <VoiceChannelContext.Provider value={{ activeVoiceChannel: currentVoiceChannel, setVoiceChannel }} >
            {children}
        </VoiceChannelContext.Provider>
    );
};

export const VoiceChannelConsumer = VoiceChannelContext.Consumer;

export default VoiceChannelContext;