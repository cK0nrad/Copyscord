import React, { useState } from "react";

const ChannelsContext = React.createContext( []);


export const ChannelsList = ({ children }) => {
  const [currentChannels, setCurrentChannel] = useState( []);
  const setChannels = (values) => {
    setCurrentChannel(values);
  };
  return <ChannelsContext.Provider value={{ channelsList: currentChannels, setChannels }}>{children}</ChannelsContext.Provider>;
};

export const ChannelConsumer = ChannelsContext.Consumer;

export default ChannelsContext;
