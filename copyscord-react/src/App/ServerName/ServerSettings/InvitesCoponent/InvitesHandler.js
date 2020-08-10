import React from 'react';
import style from '../BansComponent/BansHandler.module.css'
import UserLogo from "../../../UserLogo/UserLogo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

function InvitesHandler({name, code, logoUrl, invite, date, removeInvite}) {
    return (
        <div className={style.handler}>
            <div className={style.banned}>
                <UserLogo width={35} src={`${logoUrl}`}/>
                <p>{(name.length > 30)? `${name.substr(0,30)}...`:name}#{code.toString().padStart(4,'0')}</p>
            </div>
           <div className={style.banned} style={{flex: 1}}>
               <p>{invite}</p>
           </div>
            <div className={style.banned}>
                <p>Creation date: {new Date(date).toLocaleDateString('en-EN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    hour12: false,
                    minute: 'numeric',
                    second: 'numeric'
                })}</p>
           </div>
            <div className={style.removeBan} onClick={() => removeInvite(invite)}>
                <FontAwesomeIcon icon={faTimes}/>
            </div>
        </div>
    );
}

export default InvitesHandler;