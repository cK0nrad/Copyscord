import React from 'react';
import style from './UserLogo.module.css';
import config from "../config";
//0: Offline, 1: Online, 2: idle, 3: DnD,
const color = ['#BDBDBD', '#27AE60', '#F2994A', '#EB5757']

const UserLogo = ({bgcolor, status, src, width}) => {

    return (
            <div className={style.handler}>
                <img alt={""} width={(width) ? width : 32} height={(width) ? width : 32} style={{borderRadius: '50%'}} src={`${config.APIUrl}${src}`}/>
                {(status != null) ? <div className={style.status} style={{backgroundColor: color[status],  borderColor: bgcolor}}/> : null}
            </div>
        )
}

export default UserLogo;