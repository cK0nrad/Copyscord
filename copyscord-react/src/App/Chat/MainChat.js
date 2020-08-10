import React, {useContext, useEffect, useState} from 'react';
import Message from "./Message";
import style from './Chat.module.css'
import {Scrollbars} from "react-custom-scrollbars";
import {useHistory, useParams} from 'react-router-dom'
import {GET, DELETE} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import MessageContext from "../ContextProvider/currentMessages";
import channelContext from "../ContextProvider/CurrentChannel";

const MainChat = ({setEditMessage}) => {
    const {ChannelID, ServerID, FriendID} = useParams()
    const [channel, setChannelState] = useState('')
    const {activeChannel} = useContext(channelContext);
    const {messages, setMessages} = useContext(MessageContext);
    const [{Authorization}] = useCookies();
    const history = useHistory();
    const [noMoreMsg, setNoMoreMsg] = useState(false)
    const [scroll, setScroll] = useState()
    const [scrollHeight, setScrollHeight] = useState()
    const [loaded, setLoaded] = useState(false)

    const deleteMsg = (id) => {
        let request = (FriendID) ? `client/dm/${FriendID}/${id}` : `channels/${ServerID}/${ChannelID}/${id}`
        DELETE(request, {}, Authorization).then(() => {
            messages.some((x, i) => {
                if (x.id === id) {
                    messages.splice(i, 1)
                    setMessages([...messages])
                    return true;
                }
                return false
            })
        })
        return true;
    }

    useEffect(() => {

        if (activeChannel && (activeChannel.id !== channel) && ChannelID) {
            setChannelState(activeChannel.id)
            GET(`channels/${ServerID}/${ChannelID}/messages`, {limit: 50}, Authorization).then((message) => {
                if (message[0] !== 'error') {
                    setMessages(message.reverse())
                }
            }).catch(() => {
                history.push('/@me')
            })
        } else if (FriendID && (FriendID !== channel)) {
            setChannelState(FriendID)
            GET(`client/dm/${FriendID}`, {limit: 50}, Authorization).then((message) => {
                if (message[0] !== 'error') {
                    setMessages(message.reverse())
                }
            }).catch(() => {
                history.push('/@me')
            })
        }
    }, [activeChannel, ChannelID, channel, FriendID, ServerID, Authorization, setMessages, history])

    const loadMessages = (scrolled) => {
        if (scrolled.top === 0 && messages.length >= 50 && !noMoreMsg && loaded) {
            if (FriendID) {
                if (scroll) scroll.scrollTop(scrolled.scrollHeight - scrollHeight)
                setScrollHeight(scrolled.scrollHeight)
                if (messages.length >= 50 && !noMoreMsg) {
                    GET(`client/dm/${FriendID}`, {limit: 50, from: messages[0].id}, Authorization).then((message) => {
                        if (!message.length) {
                            setNoMoreMsg(true)
                        } else {
                            setMessages(message.reverse().concat(messages))

                        }
                    }).catch(() => {
                        history.push('/@me')
                    })
                }
            } else {
                if (scroll) scroll.scrollTop(scrolled.scrollHeight - scrollHeight)
                setScrollHeight(scrolled.scrollHeight)
                GET(`channels/${ServerID}/${ChannelID}/messages`, {limit: 50, from: messages[0].id}, Authorization).then((message) => {
                    if (message[0] !== 'error') {
                        if (!message.length) {
                            setNoMoreMsg(true)
                        } else {
                            setMessages(message.reverse().concat(messages))
                        }
                    }
                }).catch(() => {
                    history.push('/@me')
                })
            }

        }
    }

    return (
        <div className={style.MainChat}>
            <Scrollbars
                autoHide
                style={{height: "100%", display: 'flex'}}
                ref={(ref) => {
                    if (ref && !scrollHeight) {
                        ref.scrollToBottom()
                        setScroll(ref)
                        setLoaded(true)
                    }
                }
                }
                onUpdate={loadMessages}
            >
                <div style={{flex: "1", display: 'flex', flexDirection: 'column'}}>
                    {(messages[0]) ?
                        messages.map(({date, username, id, content, userLogo, authorId, userCode}, i) => {
                            let time = new Date(date).toLocaleDateString('en-EN', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                hour12: false,
                                minute: 'numeric',
                                second: 'numeric'
                            })
                            return (
                                < Message
                                    messageID={id}
                                    setEdit={setEditMessage}
                                    deleteMsg={deleteMsg}
                                    content={content}
                                    key={i}
                                    authorId={authorId}
                                    author={username}
                                    date={time}
                                    logo={userLogo}
                                    userCode={userCode}
                                />
                            )
                        }) : null}
                </div>
            </Scrollbars>
        </div>
    );
}

export default MainChat;