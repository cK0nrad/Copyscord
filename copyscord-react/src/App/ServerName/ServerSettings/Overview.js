import React, {useContext, useState} from 'react';
import style from "./Overview.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import UserLogo from "../../UserLogo/UserLogo";
import serverContext from "../../ContextProvider/CurrentServer";
import {DELETE, PUT} from "../../Util/fetcher";
import {useCookies} from "react-cookie";
import ServerListContext from "../../ContextProvider/ServerList";

function Overview({exit}) {
    const {activeServer, setServer} = useContext(serverContext);

    const [{Authorization}] = useCookies();
    const {serverList, setServers} = useContext(ServerListContext);

    // Data
    const [serverName, setServerName] = useState(activeServer.name)
    // Error
    const [serverNameError, setServerNameError] = useState('')

    const updateServer = (e) => {
        e.preventDefault()
        if (serverName !== activeServer.name) {
            if (!serverName) return setServerNameError('Server name required')
            if (serverNameError) setServerNameError('')
            PUT(`server/${activeServer.id}/`, {name: serverName}, Authorization).then(({error}) => {
                if (!error) {
                    activeServer.name = serverName
                    serverList.some(x => {
                        if (x.id === activeServer.id) {
                            x.name = serverName
                            setServers([...serverList])
                            return true
                        }
                        return false
                    })
                    setServer({...activeServer})
                }
            })
        }
    }

    const uploadImage = (event) => {
        let form = new FormData()
        form.append('logo', event.target.files[0])
        PUT(`server/${activeServer.id}/logo`, {}, Authorization, form).then(({error, logoUrl}) => {
            if (!error) {
                activeServer.logoUrl = logoUrl
                serverList.some(x => {
                    if (x.id === activeServer.id) {
                        x.logoUrl = logoUrl
                        setServers([...serverList])
                        return true
                    }
                    return false
                })
                setServer({...activeServer})
            }
        })
    }

    const deleteServerPicture = () => {
        DELETE(`server/${activeServer.id}/logo`, {}, Authorization).then(({error}) => {
            if (!error) {
                activeServer.logoUrl = 'default'
                serverList.some(x => {
                    if (x.id === activeServer.id) {
                        x.logoUrl = 'default'
                        setServers([...serverList])
                        return true
                    }
                    return false
                })
                setServer({...activeServer})
            }
        })
    }
    return (
        <div className={style.handler}>
            <div className={style.titleExit}>
                <p className={style.title}>OVERVIEW</p>
                <div className={style.exitButton} onClick={exit}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            <form onSubmit={updateServer}>

                <div className={style.overview}>
                    <div style={{margin: '0 10px 0 0', display:'flex', alignItems:'center', flexDirection:'column'}}>

                        <label>
                            <input type={"file"} className={style.imageInput} onChange={uploadImage}/>
                            {(activeServer.logoUrl) ?
                                (activeServer.logoUrl === 'default') ?
                                    <>
                                        <div className={style.logo}>
                                            {activeServer.name[0].toUpperCase()}
                                        </div>
                                    </>
                                    : <div className={style.logo}>
                                        <UserLogo width={128} src={activeServer.logoUrl}/>
                                    </div>
                                : null
                            }
                            <div className={style.changeAvatar}>
                                <p>CHANGE</p>
                                <p>AVATAR</p>
                            </div>
                        </label>
                        <div className={style.deleteServerPicture} onClick={deleteServerPicture}>REMOVE</div>
                    </div>
                    <div style={{padding: '5px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', position: 'relative'}}>
                        <div className={style.changeName}>
                            <div style={{position: "absolute", top: 30, fontSize: 13, color: '#828282', fontWeight: 900}}>SERVER NAME:</div>
                            <div className={`${style.inputHandler} ${(serverNameError) ? style.errorBorder : null}`}>
                                <input value={serverName} onChange={(e) => setServerName(e.target.value)} type={"text"} className={style.input}/>
                            </div>
                            {(serverNameError) ? <p style={{color: "#EB5757", lineHeight: 0}}>{serverNameError}</p> : null}

                        </div>
                        <div style={{position: 'absolute', bottom: 0, right: 0}}>
                            <button className={style.save} type={"submit"}>Save</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
}

export default Overview;