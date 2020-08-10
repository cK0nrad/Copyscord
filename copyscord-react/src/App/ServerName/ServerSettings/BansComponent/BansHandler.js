import React from 'react';
import style from './BansHandler.module.css'
import UserLogo from "../../../UserLogo/UserLogo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

function BansHandler({name, code, logoUrl, id,author, authorLogo, authorCode, removeBan}) {
    return (
        <div className={style.handler}>
            <div className={style.banned}>
                <UserLogo width={35} src={`${logoUrl}`}/>
                <p>{(name.length > 30)? `${name.substr(0,30)}...`:name}#{code.toString().padStart(4,'0')}</p>
            </div>
           <div className={style.banned}>
               <p style={{marginRight:5}}>Banned by: </p>
               <UserLogo width={35} src={`${authorLogo}`}/>
               <p>{(author.length > 30)? `${author.substr(0,30)}...`:author}#{authorCode.toString().padStart(4,'0')}</p>
           </div>
            <div className={style.removeBan} onClick={() => removeBan(id)}>
                <FontAwesomeIcon icon={faTimes}/>
            </div>
        </div>
    );
}

export default BansHandler;