import React from 'react';
import style from './Popup.module.css'

function Popup({top, bottom, outside}) {
    return (
        <div className={style.popup} onClick={(e) => {
            e.preventDefault();
            if(e.currentTarget === e.target){
                outside()
            }
        }}>
            <div className={style.popupHandler}>
                <div className={style.top}>
                    {top}
                </div>
                <div className={style.bottom}>
                    {bottom}
                </div>
            </div>
        </div>
    );
}

export default Popup;