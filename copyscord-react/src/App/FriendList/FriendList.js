import React, {useState} from 'react';
import ChannelName from "../ChannelName/ChannelName";
import ListPane from './ListPane'
import style from "./FriendList.module.css";
import FriendsTypeSwitcher from "../FriendsTypeSwitcher/FriendsTypeSwitcher";


const FriendList = () => {
    const [type, setType] = useState(0)
    const callback = (type) => {
        setType(type)
    }

    return (
            <div className={style.handler}>
                <div className={style.top}>
                    <ChannelName type={2} name="Friends">
                        <div className={style.verticalSeparator}/>
                        <FriendsTypeSwitcher callback={callback} />
                    </ChannelName>
                </div>
                <ListPane type={type}/>
            </div>
    );
}

export default FriendList;