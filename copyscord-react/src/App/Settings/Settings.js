import React from 'react';
import style from './Settings.module.css'

function Settings({NavBar, title, content}) {
    return (
        <div className={style.settings}>
            <div className={style.navBar}>
                <div className={style.buttonList}>
                    <div className={style.title}><p>{title}</p></div>
                    {NavBar}
                </div>
            </div>
            <div className={style.content}>
                {content}
            </div>
        </div>
    );
}

export default Settings;