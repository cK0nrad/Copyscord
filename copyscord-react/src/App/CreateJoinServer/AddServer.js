import React, {useContext, useState} from 'react';
import style from "./AddCreate.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons";
import ServerListContext from "../ContextProvider/ServerList";
import {POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router-dom"

function AddServer({back, close}) {
    const [{Authorization}] = useCookies()
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const {serverList, setServers} = useContext(ServerListContext);
    const history = useHistory()

    const createServer = (e) => {
        e.preventDefault()
        if (!name) return setError('Server name required')
        POST(`server`, {name}, Authorization).then(({error, id, serverName}) => {
            if (!error) {
                setServers([...serverList, {id, logoUrl: 'default', name: serverName}])
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
                <div className={style.title}>
                    <p>CREATE YOUR SERVER</p>
                </div>
                <form onSubmit={createServer}>
                    <div className={style.topContent}>
                        <p style={{fontWeight: 700, fontSize: '11px'}}>SERVER NAME: </p>
                        <input value={name} onChange={(e) => setName(e.target.value)} type={'text'}
                               className={`${style.input} ${(error) ? style.error : null}`}/>
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
                    <button type={"button"} onClick={back} className={style.backButton}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
                        <p style={{marginLeft: 5}}>BACK</p>
                    </button>
                    <button className={style.createButton} type={"submit"} onClick={createServer}>Create</button>
                </div>
            </div>
        </div>

    );
}

export default AddServer;