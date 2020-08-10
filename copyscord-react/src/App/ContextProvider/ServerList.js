import React, { useState } from "react";

const ServerListContext = React.createContext([]);


export const ServersList = ({ children }) => {
    const [serversList, setCurrentChannel] = useState([]);
    const setServers = (values) => {
        setCurrentChannel(values)
    };
    return (
        <ServerListContext.Provider value={{ serverList: serversList, setServers }} >
            {children}
        </ServerListContext.Provider>
    );
};

export const ServerListConsumer = ServerListContext.Consumer;

export default ServerListContext;