import ChannelsContext from "../ContextProvider/Server/ChannelsList";
import React, {useContext} from "react";
import ServerName from "../ServerName/ServerName";
import style from "./ChannelList.module.css";
import UserContainer from "../UserContainer/UserContainer";
import FriendsChannels from "./FriendsChannels";
import ServerChannels from "./ServerChannels";
import {useParams, useHistory} from "react-router-dom";
import {useCookies} from "react-cookie";
import {DELETE} from "../Util/fetcher";
import ServerContext from "../ContextProvider/CurrentServer";
import ServerListContext from "../ContextProvider/ServerList";
import config from "../config";
//Type: 0=UserFriendList, 1=Server channels
const ChannelList = ({type}) => {
    const [{Authorization}] = useCookies();
    const {activeServer} = useContext(ServerContext);
    const {channelsList} = useContext(ChannelsContext);

    const {serverList, setServers} = useContext(ServerListContext);
    const {ServerID, FriendID} = useParams();
    const history = useHistory();

    const deleteServer = () => {
        DELETE(`server/${ServerID}`, {}, Authorization).then(({error}) => {
            if (!error) {
                serverList.some((x, i) => {
                    if (x.id === ServerID) {
                        serverList.splice(i, 1);
                        setServers(serverList);
                        return true;
                    }
                    return false;
                });
                history.push("/@me");
            }
        });
    };

    const leaveServer = () => {
        DELETE(`server/${ServerID}/leave/`, {}, Authorization).then(({error}) => {
            if (!error) {
                serverList.some((x, i) => {
                    if (x.id === ServerID) {
                        serverList.splice(i, 1);
                        setServers(serverList);
                        return true;
                    }
                    return false;
                });
                history.push("/@me");
            }
        });
    };

    return (
        <div className={`${style.handler} ${config.TopBar ? style.handlerBR : null}`}>
            <div className={style.top}>
                <ServerName
                    type={type}
                    deleteServer={deleteServer}
                    leaveServer={leaveServer}
                    name={!type ? "DIRECT MESSAGES" : ServerID === activeServer.id ? activeServer.name : "loading"}
                />
            </div>

            {type ? (
                <ServerChannels channels={channelsList ? channelsList : []}/>
            ) : (
                <FriendsChannels ChannelID={FriendID} channels={channelsList ? channelsList : []}/>
            )}

                <UserContainer/>
        </div>
    );
};

export default ChannelList;
