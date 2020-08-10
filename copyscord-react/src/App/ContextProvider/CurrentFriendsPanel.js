import React, {useState} from "react";

const FriendsPanelContext = React.createContext({
    type: "online"
});


export const CurrentFriendsPanel = ({children}) => {
    const [currentFriendsPanel, setCurrentFriendsPanel] = useState({
        type: "online"
    });

    const setFriendsPanel = (values) => {
        setCurrentFriendsPanel(values)
    };
    return (
        <FriendsPanelContext.Provider value={{activeFPanel: currentFriendsPanel, setFriendsPanel}}>
            {children}
        </FriendsPanelContext.Provider>
    );
};

export const SettingsConsumer = FriendsPanelContext.Consumer;

export default FriendsPanelContext;