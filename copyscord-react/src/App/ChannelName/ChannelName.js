import React from 'react';
import style from './ChannelName.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserFriends, faHashtag, faAt} from "@fortawesome/free-solid-svg-icons";

// Type: 0=DM, 1=Server chat channel, 2=Friends list,
const ChannelType = [faAt, faHashtag, faUserFriends]
const ServerName = ({type, name, children, userCode}) => {

    return (
        <div className={style.handler}>
            <div className={style.channelInfo} >
                <FontAwesomeIcon className={style.channelLogo} icon={ChannelType[type]} color={"#999999"}/>
                <div className={style.channelName}>{(name)? (name.length > 30) ? `${name.substr(0, 30)}...` : name :null}{(userCode)?<span className={style.userCode}>#{userCode.toString().padStart(4, '0')}</span>:null}</div>
                {(children) ? children : null}
            </div>
        </div>
    );
}

export default ServerName;