import React, {useState} from "react";

const ChannelContext = React.createContext({
    id: "@me",
});

export const CurrentChannel = ({children, activeChannel}) => {
    const [currentChannel, setCurrentChannel] = useState({
        id: "@me",
    });
    const setChannel = (values) => {
        setCurrentChannel(values);
    };
    return <ChannelContext.Provider value={{activeChannel: currentChannel, setChannel}}>{children}</ChannelContext.Provider>;
};

export const ChannelConsumer = ChannelContext.Consumer;

export default ChannelContext;
