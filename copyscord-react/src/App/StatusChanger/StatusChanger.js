import React, {useContext} from 'react';
import style from './StatusChanger.module.css'
import UserContext from "../ContextProvider/CurrentUser";

function StatusChanger({statusChanger}) {
    const {currentUser} = useContext(UserContext);


    return (
        <div className={style.handler}>
                <div onClick={() => statusChanger(1)} className={`${style.select} ${(currentUser.status === 1) ? style.active : null}`}>
                    <div style={{width: 15, height: 15, borderRadius: '50%', backgroundColor: '#27AE60'}}/>
                    <p>Online</p>
                </div>
                <div onClick={() => statusChanger(2)} className={`${style.select} ${(currentUser.status === 2) ? style.active : null}`}>
                    <div style={{width: 15, height: 15, borderRadius: '50%', backgroundColor: '#F2994A'}}/>
                    <p>Idle</p>
                </div>
                <div onClick={() => statusChanger(3)} className={`${style.select} ${(currentUser.status === 3) ? style.active : null}`}>
                    <div style={{width: 15, height: 15, borderRadius: '50%', backgroundColor: '#EB5757'}}/>
                    <p>Do not disturb</p>
                </div>
                <div onClick={() => statusChanger(0)} className={`${style.select} ${(currentUser.status === 0) ? style.active : null}`}>
                    <div style={{width: 15, height: 15, borderRadius: '50%', backgroundColor: '#BDBDBD'}}/>
                    <p>Offline</p>
                </div>
            </div>
    );
}

export default StatusChanger;