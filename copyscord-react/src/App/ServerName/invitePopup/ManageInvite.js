import React from 'react';
import {useCookies} from "react-cookie";
import {DELETE} from "../../Util/fetcher";
import style from './ManageInvite.module.css'
import {Scrollbars} from "react-custom-scrollbars";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
function ManageInvite(id, inviteList, setInviteList, setInvite) {


    const [{Authorization}] = useCookies();

    const deleteInvite = (invite) => {
        if(inviteList.length === 1) return false
        DELETE(`server/${id}/invites`, {invite}, Authorization).then(({error})=> {
            if(!error){
                inviteList.some((x,i) => {
                    if(x.invite === invite){
                        inviteList.splice(i,1)
                        if(inviteList[0])setInvite(inviteList[inviteList.length - 1].invite)
                        setInviteList([...inviteList])
                        return true
                    }
                    return false
                })
            }
        })
    }

    return (


        <div className={style.handler}>
            <Scrollbars autoHide style={{height: "100%"}}>
            {(inviteList[0])?
                inviteList.map((x,i) => (
                    <div key={i} className={style.invite}>
                        <div>{x.invite}</div>
                        <div>{new Date(x.date).toLocaleDateString('en-EN', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            hour12: false,
                            minute: 'numeric',
                            second: 'numeric'
                        })}</div>
                        <div className={style.delete} onClick={() => deleteInvite(x.invite)}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </div>
                    </div>
                ))
                :<p style={{color:'#FFFFFF'}}>No invites</p>}
            </Scrollbars>
        </div>

    );
}

export default ManageInvite;