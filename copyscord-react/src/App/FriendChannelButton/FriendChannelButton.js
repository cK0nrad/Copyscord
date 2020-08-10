import React, {useContext} from 'react';
import UserLogo from "../UserLogo/UserLogo";
import style from './FriendChannelButton.module.css'
import FriendButton from "../FriendChannelButton/FriendButton";
import {Link} from 'react-router-dom'
import ChannelContext from '../ContextProvider/CurrentChannel'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {useHistory} from 'react-router-dom'
import {DELETE} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import ChannelsContext from "../ContextProvider/Server/ChannelsList";

const FriendChannelButton = ({friendChannel, id, src, active, name, status, userCode}) => {
    const {activeChannel, setChannel} = useContext(ChannelContext);
    const [{Authorization}] = useCookies();
    const history = useHistory()
    const { channelsList, setChannels } = useContext(ChannelsContext);

    const onClick = () => {
        let channelObject = {id: id, name}
        if (userCode) channelObject.code = userCode
        setChannel(channelObject)
    };
    const removeDM = (e) => {
        e.preventDefault()
        DELETE(`client/dm/${id}`, {}, Authorization).then(({error}) => {
            if (!error) {
                if(activeChannel.id === id) setChannel({ id: "@me"})
                setChannels([...channelsList.filter(item => item.id !== id)])
            }
            if (active) history.push('/@me')
        })
    }


    return (
        <Link to={(friendChannel) ? '/@me' : '/@me/' + id} style={{textDecoration: 'none'}}>
            <div onClick={onClick} className={`${((active) ? style.active : "")} ${style.handler} `}>
                {(friendChannel) ?
                    <FriendButton/>
                    :
                    <>
                        <div className={style.nameLogo}>
                            <div className={style.logo}>
                                <UserLogo src={src} status={status} bgcolor={"#343434"}/>
                            </div>
                            <div className={style.username}>{name}</div>
                        </div>
                        <div className={style.remove} onClick={removeDM}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </div>
                    </>
                }
            </div>
        </Link>
    );
}

export default FriendChannelButton;