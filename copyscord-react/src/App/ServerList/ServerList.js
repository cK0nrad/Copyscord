import React, {useCallback, useContext, useEffect, useState} from 'react';
import ServerButton from '../ServerButton/ServerButton';
import style from './ServerList.module.css';
import ServerListContext from '../ContextProvider/ServerList'
import {useParams, useHistory} from "react-router-dom";
import {useCookies} from "react-cookie";
import {GET} from "../Util/fetcher";
import ChannelsContext from "../ContextProvider/Server/ChannelsList";
import UsersListContext from "../ContextProvider/Server/UsersList";
import UserContext from "../ContextProvider/CurrentUser";
import channelContext from "../ContextProvider/CurrentChannel";
import MessageContext from "../ContextProvider/currentMessages";
import serverContext from "../ContextProvider/CurrentServer";
import VoiceUsersContext from "../ContextProvider/Server/VocieUsers";

const ServerList = () => {
    const [{Authorization}] = useCookies()
    const {serverList, setServers} = useContext(ServerListContext);
    const {setVoiceUsers} = useContext(VoiceUsersContext);
    const [loaded, setLoaded] = useState(false)
    const history = useHistory();


    const {activeServer, setServer} = useContext(serverContext);
    const {setChannels} = useContext(ChannelsContext);
    const {setUsersList} = useContext(UsersListContext);
    const {currentUser} = useContext(UserContext);
    const {ServerID, ChannelID} = useParams();
    const {setChannel} = useContext(channelContext);
    const {setMessages} = useContext(MessageContext);


    useEffect(() => {
        if (!loaded) {
            GET('server', {}, Authorization).then((list) => {
                if (list[0]) {
                    setLoaded(true)
                    setServers(list)
                } else {
                    setLoaded(true)
                }
            }).catch(() => {
                history.push('/@me')
            })
        }
    }, [ServerID, Authorization, loaded, history, setServers])


    const changeServer = useCallback(
        (serverId, ChannelID = undefined) => {
            setChannels([])
            setUsersList([])
            setMessages([])
            if (serverId !== '@me' && currentUser.id) {
                GET(`server/${serverId}/voice`, {}, Authorization).then((voiceList) => {
                    if(!voiceList.error){
                        setVoiceUsers(voiceList)
                    }
                })
                GET(`server/${serverId}`, {}, Authorization).then((server) => {
                    if (!server.error) {
                        let me = server.members.find(x => x.id === currentUser.id)
                        let isAdmin = (me && (me.role === 1 || me.role === 2))
                        let isOwner = (me && (me.role === 2))
                        setServer(Object.assign(server, {isAdmin, isOwner}))
                        let defaultText;
                        if (ChannelID) {
                            server.channels.some(x => {
                                let check = x.channelsList.find(y => y.id === ChannelID)
                                if (check) return defaultText = check
                                return false
                            })
                        } else {
                            server.channels.some(x => {
                                let check = x.channelsList.find(y => y.type === 0)
                                if (check) return defaultText = check
                                return false
                            })
                        }
                        setChannels(server.channels)
                        setUsersList(server.members)
                        if (defaultText) {
                            setChannel(defaultText)
                            if (!ChannelID) history.push(`/${serverId}/${defaultText.id}`)
                        }
                    }else {
                        history.push(`/@me`)
                    }
                })
            } else {
                GET(`client/dm`, {}, Authorization).then((server) => {

                    setServer({id: '@me'})
                    setChannels(server)
                })
            }

        }, [setVoiceUsers, Authorization, currentUser.id, history, setChannel, setChannels, setMessages, setServer, setUsersList])


    useEffect(() => {
        if (!activeServer.id && currentUser.id) {
            if (ServerID) {
                setServer({id: ServerID})
                changeServer(ServerID, (ChannelID) ? ChannelID : null)
            } else {
                setServer({id: '@me'})
                changeServer('@me')
            }
        }
    }, [changeServer, activeServer, ServerID, currentUser.id, setServer, ChannelID])


    return (
        <div className={style.handler}>
            <div className={style.serverHandler}>
                <ServerButton changeServer={changeServer} serverId={"@me"} serverName={"Home"} active dm/>
                <div className={style.serverSeparator}/>
                {(loaded) ?
                    (serverList[0]) ?
                        (serverList[0] !== 'error') ?
                            serverList.map(({id, logoUrl, name}, i) => {
                                return (
                                    <ServerButton key={i} changeServer={changeServer} serverId={id} serverName={name} src={logoUrl}/>
                                )
                            }) : null : null : null
                }
                <ServerButton serverName={"Add server"} addServer/>
            </div>
        </div>
    );
}

export default ServerList