import React, { useState } from "react";

const usersListContext = React.createContext({
  id: "@me",
});


export const UsersList = ({ children, activeChannel }) => {
  const [currentChannel, setCurrentChannel] = useState({
    id: "@me",
  });
  const setUsersList = (values) => {
    setCurrentChannel(values);
  };
  return <usersListContext.Provider value={{ usersList: currentChannel, setUsersList }}>{children}</usersListContext.Provider>;
};

export const ChannelConsumer = usersListContext.Consumer;

export default usersListContext;
