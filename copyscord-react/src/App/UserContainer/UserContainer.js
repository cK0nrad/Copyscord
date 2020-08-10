import React, {useCallback, useContext, useEffect, useState} from 'react';
import style from './UserContainer.module.css';
import UserLogo from "../UserLogo/UserLogo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMicrophone, faVolumeUp, faCog, faVolumeMute, faMicrophoneSlash} from "@fortawesome/free-solid-svg-icons";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../tippy.css';
import UserContext from "../ContextProvider/CurrentUser";
import StatusChanger from "../StatusChanger/StatusChanger";
import {GET, PUT} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import UserSettings from "./UserSettings/UserSettings";
import VoiceChannelContext from "../ContextProvider/CurrentVoiceChannel";
import VoiceStatus from "../VoiceStatus/VoiceStatus";

const UserContainer = () => {
    const {currentUser, setUser} = useContext(UserContext);
    const [loaded, setLoaded] = useState(false)
    const [{Authorization}] = useCookies();
    const [changeStatus, setChangeStatus] = useState(false)
    const [userSettings, setUserSettings] = useState(false)
    const {activeVoiceChannel} = useContext(VoiceChannelContext);

    const [voiceSocket, setVoiceSocket] = useState();


    if (!loaded && currentUser.id) {
        setLoaded(true)
    }

    const [isDeaf, setIsDeaf] = useState(false)
    const [isMute, setIsMute] = useState(false)


    useEffect(() => {
        if (!currentUser.id) {
            GET(`client`, {}, Authorization).then(({id, username, logoUrl, userCode, status, email, dm, error}) => {
                if (!error) {
                    setUser({id, username, logoUrl, userCode, status, email, dm})
                }
            })
        }
    }, [currentUser.id, Authorization, setUser])

    const statusChanger = (stat) => {
        PUT(`client/status`, {status: stat}, Authorization).then(({error}) => {
            if (!error) {
                currentUser.status = stat
                setUser({...currentUser})
            }
            setChangeStatus(!changeStatus)
        })
    }

    const muteMe = useCallback(() => {
        setIsMute(!isMute)
        if (voiceSocket) {
            if (isMute) {
                voiceSocket.emit('unmuteMe')
            } else {
                voiceSocket.emit('muteMe')
            }
        }
    }, [setIsMute, isMute, voiceSocket])
    const deafMe = useCallback(() => {
        setIsDeaf(!isDeaf)
        if (voiceSocket) {
            if (isDeaf) {
                voiceSocket.emit('undeafMe')
            } else {
                if (!isMute) muteMe()
                voiceSocket.emit('deafMe')
            }
        }
    }, [setIsDeaf, isDeaf, isMute, muteMe, voiceSocket])


    return (
        <>
            {(activeVoiceChannel.id) ?
                <VoiceStatus voiceSocket={voiceSocket} setVoiceSocket={setVoiceSocket}/>
                : null}
            {(changeStatus) ? <StatusChanger statusChanger={statusChanger} status={currentUser.status}/> : null}
            {(userSettings) ? <UserSettings exit={() => setUserSettings(false)}/> : null}

            <div className={style.handler}>
                <div className={style.userLogo} onClick={() => setChangeStatus(!changeStatus)}>
                    <UserLogo
                        src={(loaded) ? currentUser.logoUrl : '/logo/default.png'}
                        status={currentUser.status} bgcolor={"#222222"}/>
                </div>
                <div className={style.infoWrapper}>
                    <div className={style.userInfo}>
                        <p className={style.username}>{(loaded) ? (currentUser.username) : 'loading'}</p>
                        <p className={style.usercode}>#{(loaded) ? (currentUser.userCode) ? (currentUser.userCode.toString().padStart(4, '0')) : '0000' : '0000'}</p>
                    </div>
                </div>
                <div className={style.controller}>
                    <Tippy content={"Mute"} placement={'top'} className={"serverTips"} animation={false} arrow={true}>
                        <button className={style.controlButton} onClick={muteMe}>
                            <FontAwesomeIcon color={"white"} icon={(!isMute) ? faMicrophone : faMicrophoneSlash}/>
                        </button>
                    </Tippy>
                    <Tippy content={"Deaf"} placement={'top'} className={"serverTips"} animation={false} arrow={true}>
                        <button className={style.controlButton} onClick={deafMe}>
                            <FontAwesomeIcon color={"white"} icon={(!isDeaf) ? faVolumeUp : faVolumeMute}/>
                        </button>
                    </Tippy>
                    <Tippy content={"Settings"} placement={'top'} className={"serverTips"} animation={false} arrow={true}>
                        <button className={style.controlButton} onClick={() => setUserSettings(true)}>
                            <FontAwesomeIcon color={"white"} icon={faCog}/>
                        </button>
                    </Tippy>
                </div>
            </div>
        </>
    );
}

export default UserContainer;