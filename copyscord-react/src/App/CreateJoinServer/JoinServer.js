import React, {useContext, useState} from 'react';
import style from "./AddCreate.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons";
import {useCookies} from "react-cookie";
import ServerListContext from "../ContextProvider/ServerList";
import {useHistory} from "react-router-dom";
import {POST} from "../Util/fetcher";

function JoinServer({back, close}) {
    const [{Authorization}] = useCookies()
    const [error, setError] = useState('')
    const [invitation, setInvitation] = useState('')
    const {serverList, setServers} = useContext(ServerListContext);
    const history = useHistory()

    const joinServer = (e) => {
        e.preventDefault()
        if (!invitation) return setError('Invitation required')
        POST(`server/join`, {invitation}, Authorization).then(({error, serverName, logoUrl, id}) => {
            if (!error) {
                (serverList[0])?setServers([...serverList, {id, logoUrl: logoUrl, name: serverName}]):setServers([{id, logoUrl: logoUrl, name: serverName}])
                history.push(`/${id}`)
                close()
            } else {
                setError(`${(error[0]) ? error[0].toUpperCase(): 'error'}${(error[0])?error.slice(1, error.length):''}`)
            }
        })
    }

    return (
        <div className={style.popupHandler}>
            <div className={style.top}>
                <div className={style.title} style={{color: '#27AE60'}}>
                    <p>JOIN A SERVER</p>
                </div>
                <form onSubmit={joinServer}>
                    <div className={style.topContent}>

                        <p style={{fontWeight: 700, fontSize: '11px'}}>INVITATION: </p>
                        <input type={'text'} value={invitation} onChange={(e) => setInvitation(e.target.value)} className={`${style.input} ${(error) ? style.error : null}`}/>
                    </div>
                </form>
                {(error) ?
                    <div className={`${style.alert}`}>
                        <span className={style.closebtn} onClick={() => setError('')}>&times;</span>
                        {error}
                    </div>
                    : null
                }
            </div>
            <div className={style.bot}>
                <div className={style.botContent}>
                    <button onClick={back} className={style.backButton}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
                        <p style={{marginLeft: 5}}>BACK</p>
                    </button>
                    <button className={style.joinButton} onClick={joinServer}>Join</button>
                </div>
            </div>
        </div>
    );
}

export default JoinServer;