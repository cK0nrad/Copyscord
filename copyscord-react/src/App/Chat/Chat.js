import React, {useContext, useState} from 'react';
import style from "./Chat.module.css";
import ChannelName from "../ChannelName/ChannelName";
import ChatBox from "./ChatBox";
import MainChat from "./MainChat";
import UserList from "../UserList/UserList";
import channelContext from "../ContextProvider/CurrentChannel";
import {useParams} from "react-router-dom";
//type: 0: DM, 1: Server channel
//status= 0: Offline, 1: Online, 2: idle, 3: DnD,
const statusColor = ['#BDBDBD', '#27AE60', '#F2994A', '#EB5757']

const Chat = ({type, status, user}) => {
    const {activeChannel} = useContext(channelContext);
    const [editMessage, setEditMessage] = useState({})
    const {FriendID, ChannelID} = useParams();
    return (
        <div className={style.handler}>
            <div className={style.top}>
                <ChannelName type={((activeChannel.id === ChannelID || FriendID))? type: 1} name={((activeChannel.id === ChannelID || FriendID))? activeChannel.name : 'No text channel'} userCode={((FriendID))? activeChannel.code : null}>
                    <div style={{
                        width: 10,
                        height: 10,
                        backgroundColor: statusColor[status],
                        display: "flex",
                        marginLeft: "10px",
                        borderRadius: 50
                    }}/>
                </ChannelName>
            </div>
            <div className={style.content}>
                <div className={style.chatFlex}>
                    {((activeChannel.id !== ChannelID && !FriendID)) ? null :
                        <>
                            <MainChat setEditMessage={setEditMessage}/>
                            <div style={{display: 'flex', width: "100%", justifyContent: 'center', alignSelf: 'flex-end', zIndex: 20}}>
                                <ChatBox setEditMessage={setEditMessage} content={editMessage} channel={activeChannel.name} type={type}/>
                            </div>
                        </>
                    }
                </div>
                {(user != null) ?
                    <div className={style.userList}>
                        <UserList/>
                    </div>
                    : null}

            </div>
        </div>
    );


}

export default Chat;