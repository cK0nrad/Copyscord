import React from 'react';
import style from "./Common.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import UserLogo from "../../UserLogo/UserLogo";

function CommonServer(mutualServers, serverRedirect) {
    return (
        <div className={style.handler}>
            <Scrollbars autoHide autoHeight>
                {(mutualServers && mutualServers[0]) ? mutualServers.map((x, i) => (
                        <div key={i} className={style.listUser}  onClick={() => serverRedirect(x.id)}>
                            {
                                (x.logoUrl === 'default') ?
                                    <>
                                        <div className={style.serverLogo}>
                                            {x.name[0].toUpperCase()}
                                        </div>
                                    </> :
                                    <UserLogo width={35} src={x.logoUrl}/>
                            }

                            <div className={style.name}>{(x.name.length > 45) ? `${x.name.substr(0, 45)}...` : x.name}</div>
                        </div>
                    )) :
                    <div style={{color: '#FFFFFF'}}>
                        You have no mutual servers
                    </div>
                }</Scrollbars>
        </div>
    );
}

export default CommonServer;