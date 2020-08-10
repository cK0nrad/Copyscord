import React, { useState } from "react";

const FriendsListContext = React.createContext([]);


export const FriendsList = ({ children }) => {
    const [friendsList, setFriendsListS] = useState([]);
    const setFriendsList = (values) => {
        setFriendsListS(values)
    };
    return (
        <FriendsListContext.Provider value={{ friendsList, setFriendsList }} >
            {children}
        </FriendsListContext.Provider>
    );
};

export const FriendsListConsumer = FriendsListContext.Consumer;

export default FriendsListContext;