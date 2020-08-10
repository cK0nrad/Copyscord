import React, {useContext, useEffect, useState} from 'react';
import BansHandler from "./BansComponent/BansHandler";
import style from "./Overview.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {DELETE, GET} from "../../Util/fetcher";
import serverContext from "../../ContextProvider/CurrentServer";
import {useCookies} from "react-cookie";
import {Scrollbars} from "react-custom-scrollbars";

function Bans({exit}) {
    const [banList, setBanList] = useState([])
    const {activeServer} = useContext(serverContext);
    const [{Authorization}] = useCookies();

    useEffect(() => {
        GET(`server/${activeServer.id}/bans`, {}, Authorization).then((bans) => {
            setBanList(bans)
        })
    }, [Authorization, activeServer.id])

    const removeBan = (id) => {
        DELETE(`server/${activeServer.id}/bans/${id}`, {}, Authorization).then(({error}) => {
            if (!error) {
                banList.some((x, i) => {
                    if (x.banned.id === id) {
                        banList.splice(i, 1)
                        setBanList([...banList])
                        return true
                    }
                    return false
                })
            }
        })

    }

    return (
        <div className={style.handler}>
            <div className={style.titleExit}>
                <p className={style.title}>BANS</p>
                <div className={style.exitButton} onClick={exit}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            <Scrollbars autoHide style={{flex: 1}}>
                <div style={{marginRight: 36, height: "100%", padding: '15px 0'}}>
                    {banList[0] ?
                        banList.map((ban, i) => (
                            <BansHandler key={i}
                                         name={ban.banned.username}
                                         code={ban.banned.userCode}
                                         logoUrl={ban.banned.logoUrl}
                                         id={ban.banned.id}
                                         author={ban.author.username}
                                         authorLogo={ban.author.logoUrl}
                                         authorCode={ban.author.userCode}
                                         removeBan={removeBan}
                            />

                        )) : <div style={{color: '#FFFFFF', fontWeight: 900}}>Nothing to show</div>
                    }
                </div>
            </Scrollbars>
        </div>
    );
}

export default Bans;

