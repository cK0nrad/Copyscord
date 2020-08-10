import React, { useState } from "react";

const UserContext = React.createContext({});


export const CurrentUser = ({ children}) => {
    const [currentUser, setCurrentUser] = useState({});

    const setUser = (values) => {
        setCurrentUser(values)
    };
    return (
        <UserContext.Provider value={{ currentUser, setUser }} >
            {children}
        </UserContext.Provider>
    );
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;