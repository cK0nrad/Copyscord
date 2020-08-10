import React from 'react';
import style from "./TopBar.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ContextButton = ({id, fa}) => {
    return (
        <div id={id}  className={`${style.menuButton} ${style[id]}`}>
            <FontAwesomeIcon icon={fa}/>
        </div>
    );
}

export default ContextButton;