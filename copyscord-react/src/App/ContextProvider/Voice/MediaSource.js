import React, { useState } from "react";

const MediaSourceContext = React.createContext();



export const MediaSource = ({ children }) => {
    const [mediaSource, setMediaSources] = useState();
    const setMediaSource = (values) => {
        setMediaSources(values);
    };
    return <MediaSourceContext.Provider value={{ mediaSource, setMediaSource }}>{children}</MediaSourceContext.Provider>;
};

export const ChannelConsumer = MediaSourceContext.Consumer;

export default MediaSourceContext;
