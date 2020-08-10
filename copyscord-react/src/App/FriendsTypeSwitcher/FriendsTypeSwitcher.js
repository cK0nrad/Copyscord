import React from 'react';
import FriendsTypeButton from './FriendsTypeButton.js'
import style from './FriendsTypeSwitcher.module.css';
import {CurrentFriendsPanel} from "../ContextProvider/CurrentFriendsPanel";

const FriendsTypeSwitcher = ({callback}) => {

    const onClick = (type) => {
        callback(type)
    }

    return (
        <div className={style.switch}>
            <CurrentFriendsPanel activeChannel={{type: "online"}}>
                <FriendsTypeButton callback={() => onClick(0)} type={"online"} text={"Online"} className={style.switcherText} active/>
                <FriendsTypeButton callback={() => onClick(1)} type={"all"} text={"All"} className={style.switcherText}/>
                <FriendsTypeButton callback={() => onClick(2)} type={"request"} text={"Request"} className={style.switcherText}/>
                <FriendsTypeButton callback={() => onClick(3)} type={"add"} text={"Add friend"} className={`${style.switcherText} ${style.addFriendButton}`}/>
            </CurrentFriendsPanel>
        </div>
    );
}

export default FriendsTypeSwitcher;