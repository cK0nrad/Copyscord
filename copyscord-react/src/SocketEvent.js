import socket from "socket.io-client";
import {useCallback, useContext, useEffect, useState} from "react";
import MessageContext from "./App/ContextProvider/currentMessages";
import UserContext from "./App/ContextProvider/CurrentUser";
import serverContext from "./App/ContextProvider/CurrentServer";
import channelContext from "./App/ContextProvider/CurrentChannel";
import ServerListContext from "./App/ContextProvider/ServerList";
import {useCookies} from "react-cookie";
import config from "./App/config";
import UsersListContext from "./App/ContextProvider/Server/UsersList";
import ChannelsContext from "./App/ContextProvider/Server/ChannelsList";
import VoiceUsersContext from "./App/ContextProvider/Server/VocieUsers";
import FriendsListContext from "./App/ContextProvider/FriendsList";

const io = socket(config.eventSocket);

const SocketEvent = ({children}) => {
    const [{Authorization}] = useCookies();
    const {messages, setMessages} = useContext(MessageContext);
    const {activeServer, setServer} = useContext(serverContext);
    const {activeChannel, setChannel} = useContext(channelContext);
    const {currentUser} = useContext(UserContext);
    const {serverList, setServers} = useContext(ServerListContext);
    const { usersList, setUsersList } = useContext(UsersListContext);
    const { channelsList, setChannels } = useContext(ChannelsContext);
    const {voiceUserList, setVoiceUsers} = useContext(VoiceUsersContext);
    const {friendsList, setFriendsList} = useContext(FriendsListContext);

    const [subServer, setSubServer] = useState('')
    const [subUser, setSubUser] = useState('')

    const addUser = useCallback((user, channel) => {
        if(!voiceUserList[channel]) voiceUserList[channel] = []
        voiceUserList[channel].push(user)
        setVoiceUsers({...voiceUserList})
    }, [voiceUserList, setVoiceUsers])

    const removeUser = useCallback((user, channel) => {
        if(voiceUserList&&voiceUserList[channel]) voiceUserList[channel].some((x,i) => {
            if(x.id === user){
                voiceUserList[channel].splice(i, 1)
                setVoiceUsers({...voiceUserList})
                return true
            }
            return false
        })
    }, [voiceUserList, setVoiceUsers])


    useEffect(() => {

        if (subServer !== activeServer.id && activeServer.id !== undefined) {
            io.emit("unsubscribeServer", subServer);
            if(activeServer !== '@me')io.emit("subscribeServer", {Authorization: Authorization, serverID: activeServer.id});
            setSubServer(activeServer.id)
        }

        if (subUser !== currentUser.id) {
            io.emit("unsubscribeMyself", subUser)
            io.emit("subscribeMyself",  {Authorization: Authorization})
            setSubUser(currentUser.id)
        }


    }, [currentUser, activeServer, activeChannel, subServer, subUser, setSubUser, setSubServer, Authorization])

    useEffect(() => {
        io.removeListener("newMessage");
        io.on("newMessage", ({channelID, messageID, content, authorID, authorName, authorLogo, authorCode, date, serverID}) => {
            if (activeServer.id === serverID && channelID === activeChannel.id) {
                if (currentUser.id !== authorID)
                    setMessages([
                        ...messages,
                        {
                            authorId: authorID,
                            channel: channelID,
                            content,
                            date,
                            id: messageID,
                            userCode: authorCode,
                            userLogo: authorLogo,
                            username: authorName,
                            server: serverID,
                        },
                    ]);
            }
        });
        io.removeListener("updateMessage");
        io.on("updateMessage", ({serverID, messageID, newContent, authorID}) => {
            if (activeServer.id === serverID) {
                if (currentUser.id !== authorID)
                    messages.some((message) => {
                        if (message.id === messageID) {
                            message.content = newContent;
                            return true;
                        }
                        return false;
                    });
                setMessages([...messages]);
            }
        });
        io.removeListener("deleteMessage");
        io.on("deleteMessage", ({messageID, authorID, serverID}) => {
            if (activeServer.id === serverID) {
                if (currentUser.id !== authorID)
                    messages.some((message, i) => {
                        if (message.id === messageID) {
                            messages.splice(i, 1);
                            return true;
                        }
                        return false;
                    });
                setMessages([...messages]);
            }
        });

        io.removeListener("newDM");
        io.on("newDM", ({channelID, messageID, content, authorID, authorStatus, authorName, authorLogo, authorCode, date, serverID}) => {
            if (activeServer.id === serverID) {
                if (currentUser.id !== authorID && activeChannel.id === authorID) {
                    setMessages([
                        ...messages,
                        {
                            authorId: authorID,
                            channel: channelID,
                            content,
                            date,
                            id: messageID,
                            userCode: authorCode,
                            userLogo: authorLogo,
                            username: authorName,
                            server: serverID,
                        },
                    ]);
                }
                if (!channelsList.some(x => x.id === authorID)) {
                    channelsList.push({
                        id: authorID,
                        name: authorName,
                        logoUrl: authorLogo,
                        status: authorStatus,
                        code: authorCode,
                        lastMessage: Date.now()
                    })
                    channelsList.sort((i, j) => j.lastMessage - i.lastMessage)
                    setChannels([...channelsList])
                }
            }
        });

        io.removeListener("updateDM");
        io.on("updateDM", ({serverID, channelID, messageID, newContent, authorID}) => {
            if (activeServer.id === serverID && activeChannel.id === authorID) {
                if (currentUser.id !== authorID) {
                    messages.some((message) => {
                        if (message.id === messageID) {
                            message.content = newContent;
                            return true;
                        }
                        return false;
                    });
                    setMessages([...messages]);
                }
            }
        });


        io.removeListener("deleteDM");
        io.on("deleteDM", ({messageID, authorID, serverID}) => {
                if (activeServer.id === serverID && activeChannel.id === authorID) {
                    if (currentUser.id !== authorID) {
                        messages.some((message, i) => {
                            if (message.id === messageID) {
                                messages.splice(i, 1);
                                return true;
                            }
                            return false;
                        });
                        setMessages([...messages]);
                    }
                }
            }
        );

    }, [messages, currentUser, setMessages, activeServer, activeChannel, setServer, channelsList, setChannels]);

    useEffect(() => {
        io.removeListener("newChannel");
        io.on("newChannel", ({serverID, categoryID, channelID, channelName, type}) => {
            if (activeServer.id === serverID) {
                channelsList.some((category) => {
                    if (category.categoryId === categoryID) {
                        category.channelsList.push({id: channelID, name: channelName, type});
                        return true;
                    }
                    return false;
                });
                setChannels([...channelsList]);
            }
        });
        io.removeListener("updateChannel");
        io.on("updateChannel", ({serverID, channelID, newChannelName}) => {
            if (activeServer.id === serverID) {
                channelsList.some((category) => {
                    return category.channelsList.some((channel, i) => {
                        if (channel.id === channelID) {
                            channel.name = newChannelName;
                            return true;
                        }
                        return false;
                    });
                });
                setChannels([...channelsList]);
            }
        });
        io.removeListener("deleteChannel");
        io.on("deleteChannel", ({serverID, channelID}) => {
            if (activeServer.id === serverID) {
                channelsList.some((category) => {
                    return category.channelsList.some((channel, i) => {
                        if (channel.id === channelID) {
                            category.channelsList.splice(i, 1);
                            return true;
                        }
                        return false;
                    });
                });
                if (activeChannel.id === channelID) {
                    setChannel({});
                }
                setChannels([...channelsList])
            }
        });
        io.removeListener("newVoiceUser");
        io.on("newVoiceUser", (user) => {
            addUser(user, user.channelID)
        });

        io.removeListener("removeVoiceUser");
        io.on("removeVoiceUser", (user) => {
            removeUser(user.id, user.channelID)
        });


        io.removeListener("newCategory");
        io.on("newCategory", ({serverID, categoryID, categoryName}) => {
            if (activeServer.id === serverID) {
                channelsList.push({categoryId: categoryID, categoryName, channelsList: []});
                setChannels([...channelsList]);
            }
        });
        io.removeListener("updateCategory");
        io.on("updateCategory", ({serverID, categoryID, newCategoryName}) => {
            if (activeServer.id === serverID) {
                channelsList.some((category, i) => {
                    if (category.categoryId === categoryID) {
                        category.categoryName = newCategoryName;
                        return true;
                    }
                    return false;
                });
                setChannels([...channelsList]);
            }
        });
        io.removeListener("deleteCategory");
        io.on("deleteCategory", ({serverID, categoryID}) => {
            if (activeServer.id === serverID) {
                if (
                    channelsList.some((x) => x.categoryId === categoryID && x.channelsList.some((y) => activeChannel.id === y.id))
                )
                    setChannel({});

                channelsList.some((category, i) => {
                    if (category.categoryId === categoryID) {
                        channelsList.splice(i, 1);
                        return true;
                    }
                    return false;
                });
                setChannels([...channelsList]);
            }
        });

        io.removeListener("newUser");
        io.on("newUser", ({serverID, userID, username, userCode, logoUrl, status}) => {
            if (activeServer.id === serverID) {
                if (currentUser.id !== userID) {
                    usersList.push({id: userID, username, userCode, logoUrl, status, role: 0});
                    setUsersList([...usersList])
                }
            }
        });
        io.removeListener("updateUser");
        io.on("updateUser", ({serverID, userID, username, userCode, logoUrl, status, role}) => {
            if (serverID === activeServer.id) {
                if (currentUser.id === userID) {
                    if (role === 1) {
                        activeServer.isAdmin = true
                    } else if (role === 0) {
                        activeServer.isAdmin = false
                    }
                }
                usersList.some((x) => {
                    if (x.id === userID) {
                        if (username) x.username = username;
                        if (userCode) x.userCode = userCode;
                        if (logoUrl) x.logoUrl = logoUrl;
                        if (status !== undefined) x.status = status;
                        if (role !== undefined) x.role = role;
                        setUsersList([...usersList])
                        return true;
                    }
                    return false;
                });
            }else if(currentUser.id === serverID &&  activeServer.id === '@me'){
                channelsList.some((x) => {
                    if (x.id === userID) {
                        if (username) x.name = username;
                        if (userCode) x.code = userCode;
                        if (logoUrl) x.logoUrl = logoUrl;
                        if (status !== undefined) x.status = status;
                        setChannels([...channelsList])
                        return true;
                    }
                    return false;
                });

                friendsList.some((x) => {
                    if (x.id === userID) {
                        if (username) x.name = username;
                        if (userCode) x.code = userCode;
                        if (logoUrl) x.logoUrl = logoUrl;
                        if (status !== undefined) x.status = status;
                        setFriendsList([...friendsList])
                        return true;
                    }
                    return false;
                });

            }
        });

        io.removeListener("deleteUser");
        io.on("deleteUser", ({serverID, userID}) => {
            usersList.some((x, i) => {
                if (x.id === userID) {
                    usersList.splice(i, 1);
                    return true;
                }
                return false;
            });

            if (currentUser.id === userID) {
                setServer({id: '/@me'})
                serverList.some((x, i) => {
                    if (x.id === serverID) {
                        serverList.splice(i, 1);
                        setServers([...serverList]);
                        return true;
                    }
                    return false;
                });
            }
            setUsersList([...usersList])
        });
    }, [setFriendsList, friendsList, addUser, removeUser, activeServer, setServer, activeChannel, setChannel, currentUser, serverList, setServers, channelsList, setChannels, setUsersList, usersList]);

    useEffect(() => {
        io.removeListener("updateServer");
        io.on("updateServer", ({serverID, name, logoUrl}) => {
            if (activeServer.id === serverID) {
                if (name) activeServer.name = name;
                setServer({...activeServer});
            }
            serverList.some((x) => {
                if (x.id === serverID) {
                    if (name) x.name = name;
                    if (logoUrl) x.logoUrl = logoUrl;
                    setServers([...serverList]);
                    return true;
                }
                return false;
            });

        });
        io.removeListener("deleteServer");
        io.on("deleteServer", ({deleteServer}) => {
            if (activeServer.id === deleteServer) {
                setServer({id: '/@me'})
            }
            serverList.some((x, i) => {
                if (x.id === deleteServer) {
                    serverList.splice(i, 1);
                    setServers([...serverList]);
                    return true;
                }
                return false;
            });
        });
    }, [activeServer, setServer, serverList, setServers]);

    return children;
};

export default SocketEvent;
