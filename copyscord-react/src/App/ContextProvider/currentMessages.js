import React, { useState } from "react";

const MessageContext = React.createContext([]);



export const CurrentMessage = ({ children, Messages }) => {
    const [currentMessages, setMessage] = useState([]);
    const setMessages = (values) => {
        setMessage(values)
    };
    return (
        <MessageContext.Provider value={{ messages: currentMessages, setMessages }} >
            {children}
        </MessageContext.Provider>
    );
};

export const MessageConsumer = MessageContext.Consumer;

export default MessageContext;