import React from 'react';
import style from "./ChannelList.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import FriendChannelButton from "../FriendChannelButton/FriendChannelButton";
const FriendsChannels = ({ChannelID, channels}) => {
    return (
        <>
                <FriendChannelButton id={"@me"} key={0} friendChannel active={ChannelID === undefined}/>
                <div className={style.dmSeparator}>
                    <p>DIRECT MESSAGE: </p>
                </div>
                <div className={style.channelList}>
                    <Scrollbars autoHide style={{height: "100%"}}>
                        {(channels)?channels.map(({id, name, logoUrl, status, code},i) => (
                            <FriendChannelButton userCode={code} key={i} name={name} active={(ChannelID === id)} id={id} src={logoUrl} status={status}/>
                        )):null

                        }
                    </Scrollbars>
                </div>
        </>
    );
}

export default FriendsChannels;