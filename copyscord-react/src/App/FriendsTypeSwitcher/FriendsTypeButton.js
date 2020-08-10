import React, {useContext} from 'react';
import FriendsPanelContext from '../ContextProvider/CurrentFriendsPanel'
import style from './FriendsTypeSwitcher.module.css';

const FriendsTypeButton = ({type, className, text, callback}) => {
    const {activeFPanel, setFriendsPanel} = useContext(FriendsPanelContext)
    const onClick = () => {
        callback(type)
        setFriendsPanel({type: type})
    }
    return (
        <div className={style.switcher}>
            <p className={`${className} ${((activeFPanel.type === type) ? style.active : null)}`} onClick={onClick}>{text}</p>
        </div>
    );
}

export default FriendsTypeButton;