import React from 'react';
import style from './Common.module.css'
import UserLogo from "../../UserLogo/UserLogo";
import {Scrollbars} from "react-custom-scrollbars";

function CommonFriends(mutualFriends, profileRedirect) {

    return (
        <div className={style.handler}>
            <Scrollbars autoHide autoHeight>
                {(mutualFriends && mutualFriends[0]) ? mutualFriends.map((x, i) => (
                        <div key={i} className={style.listUser} onClick={() => profileRedirect(x.id)}>
                            <UserLogo status={x.status} src={x.logoUrl} bgcolor={'#434343'} width={35}/>
                            <div className={style.name}>{(x.username.length > 30) ? `${x.username.substr(0, 30)}...` : x.username}</div>
                            <div className={style.userCode}>#{x.userCode.toString().padStart(4, '0')}</div>
                        </div>
                    )) :
                    <div style={{color: '#FFFFFF'}}>
                        You have no mutual friends
                    </div>
                }</Scrollbars>
        </div>
    );
}

export default CommonFriends;