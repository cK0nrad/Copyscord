import React, {useContext, useEffect, useState} from 'react';
import UserLogo from "../UserLogo/UserLogo";
import style from './UserTippyProfile.module.css'
import UserContext from "../ContextProvider/CurrentUser";
import {useHistory} from 'react-router-dom'
import {POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";

function UserTippyProfile({id, logo, bot, userCode, name, left, showProfile}) {
    const {currentUser} = useContext(UserContext);
    const [dmMessage, setDmMessage] = useState('')
    const history = useHistory()
    const [{Authorization}] = useCookies();

    const [dmError, setDmError] = useState('')

    const sendDm = (e) => {
        e.preventDefault()
        POST(`client/dm/${id}`, {content: dmMessage}, Authorization).then(({error}) => {
            if (error) {
                if (error === 'user not found') return setDmError(`User can only receive message from friends`)
                return setDmError(`${error[0].toUpperCase()}${error.slice(1, error.length)}`)
            } else {
                if (dmError) setDmError('')
                history.push(`/@me/${id}`)
            }
        })
    }
    useEffect(() => {
        if (!dmMessage && dmError) setDmError('')
    }, [dmMessage, dmError])

    return (
        <div className={`${style.profile} ${(left) ? style.slideLeft : style.slideRight}`}>
            <div className={style.profileTop}>
                <div className={style.profileLogo} onClick={() => showProfile(id)}>
                    <UserLogo src={logo} width={85}/>
                </div>
                <div className={style.profileUsername}>
                    <p>{(name.length > 20) ? `${name.substr(0, 20)}...` : name}</p>
                    <p className={style.profileUsernameID}>#{(userCode) ? userCode.toString().padStart(4, '0') : '#0000'}</p>
                </div>
            </div>
            <div className={style.profileBot}>
                {bot}
                {(currentUser.id !== id) ? <div className={style.dmHandler}>
                    <div className={`${style.dmInputHandler} ${(dmError) ? style.errorBorder : null}`}>
                        <form onSubmit={sendDm}>
                            <input value={dmMessage} onChange={(e) => setDmMessage(e.target.value)} placeholder={`Message @${(name.length > 30) ? `${name.substr(0, 20)}...` : name}`} className={style.dmInput}/>
                        </form>
                    </div>
                    <div style={{color: '#EB5757', fontSize: '13px'}}>{dmError}</div>
                </div> : null}
            </div>
        </div>
    );
}

export default UserTippyProfile;