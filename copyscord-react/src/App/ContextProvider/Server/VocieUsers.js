import React, { useState } from "react";

const VoiceUsersContext = React.createContext([]);


export const VoiceUsers = ({ children }) => {
  const [voiceUserList, setVoiceUserList] = useState([]);
  const setVoiceUsers = (values) => {
    setVoiceUserList(values);
  };
  return <VoiceUsersContext.Provider value={{ voiceUserList, setVoiceUsers }}>{children}</VoiceUsersContext.Provider>;
};

export const ChannelConsumer = VoiceUsersContext.Consumer;

export default VoiceUsersContext;
