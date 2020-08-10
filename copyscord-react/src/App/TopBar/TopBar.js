import React from 'react';
import style from './TopBar.module.css';
import ContextButton from './ContextButton'
import {faMinus, faTimes} from '@fortawesome/free-solid-svg-icons'
import {faSquare} from "@fortawesome/free-regular-svg-icons";

const TopBar = () => {

    return (
        <div className={`${style.topBar} selectRemover`}>
            <p className={style.appName}>COPYSCORD</p>
            <div className={style.controlMenu}>
                <ContextButton id={"reduce"} fa={faMinus} hoverColor={"#343434"}/>
                <ContextButton id={"enlarge"} fa={faSquare} hoverColor={"#343434"}/>
                <ContextButton id={"exit"} fa={faTimes} hoverColor={"#c0392b"}/>
            </div>
        </div>
    );
};
export default TopBar;