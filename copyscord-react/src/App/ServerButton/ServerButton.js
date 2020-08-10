import React, {useContext, useState} from 'react';
import style from './ServerButton.module.css'
import Tippy from '@tippyjs/react';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInbox} from "@fortawesome/free-solid-svg-icons";
import 'tippy.js/dist/tippy.css';
import '../tippy.css';
import serverContext from '../ContextProvider/CurrentServer'
import CreateJoinServer from "../CreateJoinServer/CreateJoinServer";
import ServerLogo from "./ServerLogo";

const ServerButton = ({serverId, serverName, src, dm, addServer, changeServer}) => {
    const {activeServer} = useContext(serverContext);
    const [serverPopup, setServerPopup] = useState(false)

    if (addServer) {
        return (
            <>
                {(serverPopup) ? <CreateJoinServer outside={() => setServerPopup(false)}/> : null}
                <Tippy
                    animation={false}
                    content={(serverName.length > 30) ? `${serverName.substring(0, 30)}...` : serverName}
                    placement={'right'}
                    className={"serverTips"}
                    arrow={true}
                >
                    <div className={style.button}>
                        <div className={`${style.dm} ${style.addServer}`} onClick={() => setServerPopup(true)}>
                            <p className={style.addServerCross}>+</p>
                        </div>

                    </div>
                </Tippy>
            </>
        )
    }

    const serverButt = () => {
        return (
            <div className={style.button}>
                {(dm != null) ?
                    <div className={`${style.dm} ${((activeServer.id === serverId) ? style.active : null)}`}>
                        <FontAwesomeIcon color={"white"} icon={faInbox}/>
                    </div>
                    : ServerLogo({active: (activeServer.id === serverId), name: serverName, logoUrl: src})

                }
            </div>
        )
    }


    return (
        <Tippy
            animation={false}
            content={(serverName.length > 30) ? `${serverName.substring(0, 30)}...` : serverName}
            placement={'right'}
            className={"serverTips"}
            arrow={true}
        >
            {(activeServer.id === serverId) ?
                serverButt()
                :
                <Link to={`/${serverId}`} style={{textDecoration: 'none'}} className={style.serverButton} onClick={() => changeServer(serverId)}>
                    {serverButt()}
                </Link>
            }

        </Tippy>
    );
}
export default ServerButton;