import React from 'react';
import style from "./ServerButton.module.css";
import config from "../config";

function ServerLogo({active, name, logoUrl}) {
    return (
        (logoUrl === 'default' || !logoUrl) ?
            <>
                <div className={`${style.dm} ${((active) ? style.active : null)}`}>
                    {name[0].toUpperCase()}
                </div>
            </> :
            <img className={(active) ? style.active : style.image} src={`${config.APIUrl}${logoUrl}`} width={"48"} height={"48"} alt={""}/>
    );
}

export default ServerLogo;