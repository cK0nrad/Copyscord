import React, { useState } from "react";

const ConnectedUsersContext = React.createContext([]);


export const ConnectedUsers = ({ children }) => {
    const [currentChannels, setCurrentChannel] = useState([]);
    const setConnectedUsers = (values) => {
        setCurrentChannel(values);
    };
    return <ConnectedUsersContext.Provider value={{ audioList: currentChannels, setConnectedUsers }}>{children}</ConnectedUsersContext.Provider>;
};

export const ChannelConsumer = ConnectedUsersContext.Consumer;

export default ConnectedUsersContext;
