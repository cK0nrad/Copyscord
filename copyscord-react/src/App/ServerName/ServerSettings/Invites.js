import React, {useContext, useEffect, useState} from 'react';
import style from "./Overview.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {DELETE, GET} from "../../Util/fetcher";
import serverContext from "../../ContextProvider/CurrentServer";
import {useCookies} from "react-cookie";
import InvitesHandler from "./InvitesCoponent/InvitesHandler";
import {Scrollbars} from "react-custom-scrollbars";

function Invites({exit}) {
    const [InvitesList, setInvitesList] = useState([])
    const {activeServer} = useContext(serverContext);
    const [{Authorization}] = useCookies();

    useEffect(() => {
        GET(`server/${activeServer.id}/invites/all`, {}, Authorization).then((invites) => {
            setInvitesList(invites)
        })
    }, [Authorization, activeServer.id])

    const removeInvite = (id) => {
        DELETE(`server/${activeServer.id}/invites/`, {invite:id}, Authorization).then(({error}) => {
            if (!error) {
                InvitesList.some((x, i) => {
                    if (x.invite === id) {
                        InvitesList.splice(i, 1)
                        setInvitesList([...InvitesList])
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
                <Scrollbars autoHide style={{flex:1}}>

                <div style={{marginRight: 36, height: "100%", padding: '15px 0'}}>

                    {InvitesList[0] ?
                        InvitesList.map((invite, i) => (
                            <InvitesHandler key={i}
                                            name={invite.username}
                                            code={invite.userCode}
                                            logoUrl={invite.logoUrl}
                                            invite={invite.invite}
                                            date={invite.date}
                                            removeInvite={removeInvite}
                            />

                        )) : <div style={{color: '#FFFFFF', fontWeight: 900}}>Nothing to show</div>
                    }

                </div>
                </Scrollbars>

            </div>

    );
}

export default Invites;