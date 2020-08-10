import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserFriends} from '@fortawesome/free-solid-svg-icons'
import style from './FriendChannelButton.module.css'

const FriendButton = () => {

    return (
            <div>
                <FontAwesomeIcon icon={faUserFriends} color={"#999999"} fontSize={18} className={style.friendsButton}/>
                <p className={style.friendsText}>Friends</p>
            </div>
        );
}

export default FriendButton;