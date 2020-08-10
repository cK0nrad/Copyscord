import React, {useContext, useEffect, useState} from 'react';
import style from './PopupUserProfile.module.css'
import UserLogo from "../UserLogo/UserLogo";
import CommonFriends from "./Sub/CommonFriends";
import CommonServer from "./Sub/CommonServer";
import {GET, POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import UserContext from "../ContextProvider/CurrentUser";
import {useHistory} from 'react-router-dom'

function PopupUserProfile({outside, id, username, logoUrl, userCode}) {
    const [currentTab, setCurrentTab] = useState(0)
    const [addedToFriend, setAddedToFriend] = useState(false)
    const {currentUser} = useContext(UserContext);
    const [{Authorization}] = useCookies();

    const [stateId, setId] = useState('')
    const [user, setUser] = useState({id, username, logoUrl, userCode, commonServer: [], commonFriends: [], friendRequested: false})

    const history = useHistory()

    useEffect(() => {
        if (currentUser.id === user.id && (stateId !== user.id)) {
            setId(currentUser.id)
            return setUser({id: currentUser.id, username: currentUser.username, userCode: currentUser.userCode, logoUrl: currentUser.logoUrl, friendRequested: false, commonServer: [], commonFriends: []})
        }
        if ((stateId !== user.id)) GET(`user/${user.id}`, {}, Authorization).then((userInfo) => {
            if (!userInfo.error) {
                if (userInfo.friendRequested) setAddedToFriend(true)
                setId(userInfo.id)
                setUser(userInfo)
            } else {
                GET(`friends/request`, {}, Authorization).then(({sent}) => {
                    if (sent.some(x => x.id === user.id)) {
                        setAddedToFriend(true)
                    }
                    setId(user.id)
                })
            }
        })
    }, [Authorization, user, stateId, currentUser])

    const serverRedirect = (id) => {
        outside()
        history.push(`/${id}`)
    }

    const profileRedirect = (id) => {
        user.id = id
        setUser({...user})
        setCurrentTab(0)
    }

    const addToFriend = () => {
        setAddedToFriend(true)
        if (!addedToFriend) {
            return POST(`friends`, {userId: id}, Authorization)
        }
    }

    const sendMessage = () => {
        outside()
        history.push(`/@me/${id}`)
    }
    return (
        <div className={style.popup} onClick={(e) => {
            e.preventDefault();
            if (e.currentTarget === e.target) {
                outside()
            }
        }}>
            <div className={style.handler}>
                <div className={style.top}>
                    <div className={style.topContent}>
                        <div className={style.space}>
                            <UserLogo src={user.logoUrl} width={100}/>
                            <div className={style.userNameCode}>
                                <div className={style.username}>{(user.username) ? (user.username.length > 30) ? `${user.username.substr(0, 30)}...` : user.username : null}</div>
                                <div className={style.userCode}>#{(user.userCode) ? user.userCode.toString().padStart(4, '0') : '0000'}</div>
                            </div>
                        </div>
                        <div className={style.space}>
                            {(currentUser.id === user.id) ? null :
                                (!addedToFriend) ?
                                    <button className={style.addFriend} onClick={(user.areFriends) ? sendMessage : addToFriend}>{(user.areFriends) ? 'Send a message' : 'Add to friend'}</button>
                                    : <button className={style.addedFriend} disabled>Friendship requested</button>
                            }
                        </div>
                    </div>
                </div>
                {(currentUser.id !== user.id) ?
                    <>
                        <div className={style.navBar}>
                            <div className={style.navBarContent}>
                                <div className={`${style.navButton} ${(currentTab === 0) ? style.navActive : null}`} onClick={() => (currentTab !== 0) ? setCurrentTab(0) : null}>Mutual Server</div>
                                <div className={`${style.navButton} ${(currentTab === 1) ? style.navActive : null}`} onClick={() => (currentTab !== 1) ? setCurrentTab(1) : null}>Mutual Friends</div>
                            </div>
                        </div>
                        <div className={style.bot}>
                            <div className={style.botContent}>
                                {[CommonServer(user.commonServers, serverRedirect), CommonFriends(user.commonFriends, profileRedirect)][currentTab]}
                            </div>
                        </div>
                    </>
                    : <div className={style.bot} style={{height: 50}}/>}
            </div>
        </div>
    );
}

export default PopupUserProfile;