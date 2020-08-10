import React, {useContext, useEffect, useState} from 'react';
import style from './Chat.module.css'
import {Scrollbars} from "react-custom-scrollbars";
import TextareaAutosize from 'react-autosize-textarea';
import {POST, PUT} from "../Util/fetcher";
import {useParams} from 'react-router-dom'
import {useCookies} from "react-cookie";
import MessageContext from "../ContextProvider/currentMessages";
import UserContext from "../ContextProvider/CurrentUser";
import {useHistory} from 'react-router-dom'
import serverContext from "../ContextProvider/CurrentServer";
import ChannelsContext from "../ContextProvider/Server/ChannelsList";

const ChatBox = ({type, channel, content, setEditMessage}) => {
    const [{Authorization}] = useCookies();
    const {activeServer, setServer} = useContext(serverContext);
    const {messages, setMessages} = useContext(MessageContext);
    const {currentUser} = useContext(UserContext);
    const {ChannelID, ServerID, FriendID} = useParams()
    const history = useHistory()
    const [textValue, setTextValue] = useState('')
    const [editing, setEditing] = useState('')
    const { channelsList, setChannels } = useContext(ChannelsContext);

    const disableEdit = () => {
        setEditing('')
        setTextValue('')
        setEditMessage({})
    }

    useEffect(() => {
        if ((!editing && content.id) || (editing !== content.id)) {
            setEditing(content.id)
            setTextValue(content.content)
        }
    }, [setEditing, content, editing])

    const onKey = (event) => {
        if (event.key === 'Enter') {
            if (event.target.value !== '') {
                if (type) {
                    if (editing) {
                        PUT(`channels/${ServerID}/${ChannelID}/${content.id}`, {content: textValue}, Authorization).then(({id, error}) => {
                            if (!error) {
                                messages.some((x) => {
                                    if (x.id === id) {
                                        x.content = textValue
                                        return true
                                    }
                                    return false
                                })
                                setMessages([...messages])
                            }
                            setEditMessage({})
                            setTextValue('')
                            setEditing('')
                        })
                    } else {
                        POST(`channels/${ServerID}/${ChannelID}/messages`, {content: event.target.value}, Authorization).then(({id, content, date}) => {
                            if (messages.error) {
                                setMessages([{
                                    id,
                                    content,
                                    date,
                                    username: currentUser.username,
                                    userLogo: currentUser.logoUrl,
                                    authorId: currentUser.id
                                }])
                            } else {
                                setMessages([...messages, {
                                    id,
                                    content,
                                    date,
                                    username: currentUser.username,
                                    userLogo: currentUser.logoUrl,
                                    authorId: currentUser.id
                                }])

                            }
                        })
                    }
                } else {
                    if (editing) {
                        PUT(`client/dm/${FriendID}/${content.id}`, {content: textValue}, Authorization).then(({id, error}) => {
                            if (!error) {
                                messages.some((x) => {
                                    if (x.id === id) {
                                        x.content = textValue
                                        return true
                                    }
                                    return false
                                })
                                setMessages([...messages])

                            }
                            channelsList.some(x => {
                                if (x.id === FriendID) {
                                    x.lastMessage = Date.now()
                                    return true
                                }
                                return false
                            })
                            channelsList.sort((i, j) => j.lastMessage-i.lastMessage)
                            setEditMessage({})
                            setTextValue('')
                            setEditing('')
                            setServer({...activeServer})
                        })
                    } else {
                        POST(`client/dm/${FriendID}`, {content: event.target.value}, Authorization).then(({id, content, date, error}) => {
                            if (error) history.push('/@me')
                            if (messages.error) {
                                if (!channelsList.some(dude => dude.id === FriendID)) {
                                    setServer({})
                                }
                            } else {
                                if (!channelsList.some(dude => dude.id === FriendID)) {
                                    setServer({})
                                }
                                let newMessage = {id, content, date, username: currentUser.username, userLogo: currentUser.logoUrl, authorId: currentUser.id}
                                setMessages((messages[0]) ? [...messages, newMessage] : [newMessage])
                                channelsList.some(x => {
                                    if (x.id === FriendID) {
                                        x.lastMessage = Date.now()
                                        return true
                                    }
                                    return false
                                })
                                channelsList.sort((i,j) => j.lastMessage - i.lastMessage)
                                setChannels([...channelsList])
                            }
                        })
                    }
                }
            }
            setTextValue("")
            event.preventDefault();
        }
    }

    return (
        <div className={style.chatInput}>
            <div className={style.border}>
                <div style={{width: 28, height: 28, backgroundColor: "#C4C4C4", borderRadius: '50%'}}/>
            </div>
            <Scrollbars autoHeight style={{width: "calc(100% - 50px)"}}>
                <div className={style.boxContainer}>
                    <TextareaAutosize
                        placeholder={"Send a message to " + ((type) ? "#" : "@") + ((channel) ? (channel.length > 30) ? `${channel.substring(0, 30)}...` : channel : '')}
                        onKeyPress={onKey} spellCheck={"false"} onChange={(e) => setTextValue(e.target.value)}
                        value={textValue}
                        maxLength={2000} className={style.textbox}/>

                </div>
                {(editing) ? <p className={style.cancel} onClick={disableEdit}>Cancel</p> : null}
            </Scrollbars>
            <div className={style.border}/>
        </div>
    );
}

export default ChatBox;