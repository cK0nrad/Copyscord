import React, { useState } from "react";

const ServerContext = React.createContext({});


export const CurrentServer = ({ children }) => {
    const [currentFriendsPanel, setCurrentFriendsPanel] = useState({});

    const setServer = (values) => {
        setCurrentFriendsPanel(values)
    };
    return (
        <ServerContext.Provider value={{ activeServer: currentFriendsPanel, setServer  }} >
            {children}
        </ServerContext.Provider>
    );
};

export const ServerConsumer = ServerContext.Consumer;

export default ServerContext;