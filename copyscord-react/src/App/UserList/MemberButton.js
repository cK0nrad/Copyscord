import React, {useContext, useState} from 'react';
import style from "./UserList.module.css";
import UserLogo from "../UserLogo/UserLogo";
import Tippy from "@tippyjs/react/headless";
import UserTippyProfile from "../UserTippyProfile/UserTippyProfile";
import serverContext from "../ContextProvider/CurrentServer";
import {POST, PUT} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import {useParams} from 'react-router-dom'
import Popup from "../Popup/Popup";
import PopupUserProfile from "../PopupUserProfile/PopupUserProfile";
import UsersListContext from "../ContextProvider/Server/UsersList";

const MemberButton = ({logo, name, userCode, rank, userId, status}) => {
    const [{Authorization}] = useCookies()
    const [instance, setInstance] = useState()
    const [instanceProfile, setInstanceProfile] = useState()
    const [userProfile, setUserProfile] = useState()
    const {activeServer} = useContext(serverContext);
    const [active, setActive] = useState(false)
    const [banPopup, setBanPopup] = useState(false)
    const {ServerID} = useParams()
    const { usersList, setUsersList } = useContext(UsersListContext);



    const onClick = () => {
        setActive(true)
    }
    const hide = () => {
        setActive(false)
    }

    const rankUpdate = (rank) => {
        PUT(`server/${ServerID}/members/${userId}`, {role: rank}, Authorization).then(({error}) => {
            if (!error) {
                usersList.some((x) => {
                    if (x.id === userId) {
                        x.role = rank
                        setUsersList([...usersList])
                        return true;
                    }
                    return false;
                })
            }
        })
    }

    const ban = () => {
        POST(`server/${activeServer.id}/bans/${userId}`, {}, Authorization).then(({error}) => {
            if (!error) {
                usersList.some((x, i) => {
                    if (x.id === userId) {
                        usersList.splice(i, 1)
                        setUsersList([...usersList])
                        return true;
                    }
                    return false;
                })
            }
        })

    }

    if (!activeServer.isAdmin) {
        return (
            <div>
                {(userProfile)? <PopupUserProfile username={name} logoUrl={logo} userCode={userCode} id={userProfile} outside={() => setUserProfile(false)} />:null}

                <Tippy
                    appendTo={() => document.getElementById('root')}
                    interactive={true}
                    onTrigger={(i) => setInstanceProfile(i)}
                    render={() => (
                        <UserTippyProfile showProfile={(id) => {
                            instanceProfile.hide()
                            setUserProfile(id)
                        }} id={userId} left userCode={userCode} name={name} logo={logo} bot={
                            <p className={style.profileRank}>Rank: {(rank === 0) ? 'User' : (rank === 1) ? 'Admin' : 'Owner'}</p>
                        }/>
                    )}
                    onHide={hide}
                    trigger={'click'}
                    placement={'left'}
                >
                    <div onClick={onClick} className={`${style.member} ${(active) ? style.active : null}`}>
                        <UserLogo bgcolor={'#343434'} src={logo} status={status}/>
                        <p className={style.memberName}>{name}</p>
                    </div>
                </Tippy>
            </div>
        );
    } else {
        return (
            <div>
                {(userProfile)? <PopupUserProfile username={name} logoUrl={logo} userCode={userCode} id={userProfile} outside={() => setUserProfile(false)} />:null}

                {(banPopup) ?
                    <Popup
                        outside={() => setBanPopup(false)}
                        top={
                            <p style={{color: '#FFFFFF', fontSize: '15px', fontWeight: 400}}>
                                Are you sure to <span style={{color: '#EB5757'}}>BAN </span>
                                {(name.length > 30) ? `${name.substr(0, 30)}...` : name}
                            </p>
                        }
                        bottom={
                            <>
                                <button className={style.leaveButton}
                                        onClick={() => {
                                            setBanPopup(false)
                                            ban()
                                        }}
                                >
                                    <p>BAN</p>
                                </button>

                                <button className={style.cancelButton} onClick={() => setBanPopup(false)}>
                                    <p>Cancel</p>
                                </button>
                            </>
                        }
                    />

                    : null}
                <Tippy
                    trigger={'contextmenu'}
                    placement={'bottom'}
                    offset={[15, 5]}
                    arrow={false}
                    hideOnClick={true}
                    interactive={true}
                    onTrigger={((instance, event) => {
                        setInstance(instance)
                        instance.setProps({
                            getReferenceClientRect: () => ({
                                width: 0,
                                height: 0,
                                top: event.clientY,
                                bottom: event.clientY,
                                left: event.clientX,
                                right: event.clientX,
                            }),
                        });
                        instance.show();
                    })}
                    render={(attrs, content) => (
                        <div className={style.contextMenu}>
                            <button className={`${(rank === 2) ? null : style.normalContext} ${style.contextButton}`} onClick={() => {
                                if (rank !== 2) {
                                    rankUpdate((!rank) ? 1 : 0)
                                    instance.hide()
                                }
                            }} disabled={(rank === 2)}> Set {(!rank) ? 'admin' : 'user'}
                            </button>
                            <button className={`${(rank !== 2) ? style.banButton : null} ${style.contextButton}`} onClick={() => {
                                if (rank !== 2) {
                                    instance.hide()
                                    setBanPopup(true)
                                }
                            }}>Ban
                            </button>
                        </div>
                    )}
                >
                    <Tippy
                        appendTo={() => document.getElementById('root')}
                        interactive={true}
                        onTrigger={i => setInstanceProfile(i)}
                        render={() => (
                            <UserTippyProfile showProfile={(id) => {
                                instanceProfile.hide()
                                setUserProfile(id)
                            }} id={userId} left userCode={userCode} name={name} logo={logo} bot={
                                <p className={style.profileRank}>Rank: {(rank === 0) ? 'User' : (rank === 1) ? 'Admin' : 'Owner'}</p>
                            }/>
                        )}
                        onHide={hide}
                        trigger={'click'}
                        placement={'left'}
                    >
                        <div onClick={onClick} className={`${style.member} ${(active) ? style.active : null}`}>
                            <UserLogo bgcolor={'#343434'} src={logo} status={status}/>
                            <p className={style.memberName}>{(name.length > 20) ? `${name.substr(0, 20)}...` : name}</p>
                        </div>
                    </Tippy>
                </Tippy>
            </div>
        );
    }
}
export default MemberButton;