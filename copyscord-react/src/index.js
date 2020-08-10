import React from "react";
import ReactDOM from "react-dom";
import Copyscord from "./App/App";
import {CookiesProvider} from "react-cookie";
import "./index.css";
import {CurrentChannel} from "./App/ContextProvider/CurrentChannel";
import {CurrentVoiceChannel} from "./App/ContextProvider/CurrentVoiceChannel";
import {CurrentMessage} from "./App/ContextProvider/currentMessages";
import {CurrentUser} from "./App/ContextProvider/CurrentUser";
import {CurrentServer} from "./App/ContextProvider/CurrentServer";
import {ServersList} from "./App/ContextProvider/ServerList";
import SocketEvent from "./SocketEvent";
import {UsersList} from "./App/ContextProvider/Server/UsersList";
import {ChannelsList} from "./App/ContextProvider/Server/ChannelsList";
import {VoiceUsers} from "./App/ContextProvider/Server/VocieUsers";
import {FriendsList} from "./App/ContextProvider/FriendsList";

ReactDOM.render(
    <CurrentUser>
        <FriendsList>
            <ServersList>
                <CurrentServer>
                    <VoiceUsers>
                        <ChannelsList>
                            <UsersList>
                                <CurrentChannel>
                                    <CurrentVoiceChannel>
                                        <CurrentMessage>
                                            <CookiesProvider>
                                                <SocketEvent>
                                                    <Copyscord/>
                                                </SocketEvent>
                                            </CookiesProvider>
                                        </CurrentMessage>
                                    </CurrentVoiceChannel>
                                </CurrentChannel>
                            </UsersList>
                        </ChannelsList>
                    </VoiceUsers>
                </CurrentServer>
            </ServersList>
        </FriendsList>
    </CurrentUser>,
    document.getElementById("root")
);
