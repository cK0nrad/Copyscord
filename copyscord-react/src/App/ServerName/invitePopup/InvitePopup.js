import React, {useEffect, useState} from 'react';
import style from "../ServerName.module.css";
import Popup from "../../Popup/Popup";
import {GET, POST} from "../../Util/fetcher";
import {useCookies} from "react-cookie";
import ManageInvite from "./ManageInvite";

function InvitePopup({setPopup, id}) {
    const [lastInvite, setInvite] = useState('')
    const [inviteList, setInviteList] = useState([])
    const [inviteError, setInviteError] = useState('')
    const [manage, setManage] = useState(0)
    const [{Authorization}] = useCookies();

    const createInvite = () => {
        POST(`server/${id}/invites`, {}, Authorization).then(({invite, date, error}) => {
            if (!error) {
                setInviteList([...inviteList,{invite, date}])
                setInvite(invite)
            } else {
                setInviteError(`${error[0].toUpperCase()}${error.slice(1, error.length)}`)
            }
        })
    }

    useEffect(() => {
      if(!lastInvite || inviteList.length === 0)  GET(`server/${id}/invites`, {}, Authorization).then((invites) => {
            if (!invites.error) {
                if (inviteError) setInviteError('')
                if (!invites.length) {
                    POST(`server/${id}/invites`, {}, Authorization).then((invite) => {
                        setInviteList([invite])
                        setInvite(invite.invite)
                    })
                } else {
                    setInviteList(invites)
                    setInvite(invites[invites.length - 1].invite)
                }
            } else {
                setInviteError(`${invites.error[0].toUpperCase()}${invites.error.slice(1, invites.error.length)}`)
            }
        })
    }, [Authorization, id, inviteError, inviteList.length, lastInvite])

    return (
        <Popup
            outside={() => setPopup(false)}
            bottom={
                [
                    <>
                        <button
                            className={style.doneButton}
                            onClick={() => setPopup(false)}>
                            <p>DONE</p>
                        </button>
                        <button
                            className={style.doneButton}
                            onClick={() => createInvite()}>
                            <p>New invite</p>
                        </button>
                        <button
                            className={style.doneButton}
                            onClick={() =>setManage(1)}>
                            <p>Manage invite</p>
                        </button>
                    </>,
                    <>
                        <button
                            className={style.cancelButton}
                            onClick={() => setManage(0)}>
                            <p>Back</p>
                        </button>
                    </>
                ][manage]
            }
            top={
                [<div style={{width: '100%'}}>
                    <p style={{color: '#FFFFFF', fontSize: '12px', fontWeight: 900}}>
                        INVITATION :
                    </p>
                    <input className={`${style.inviteInput} ${(inviteError) ? style.errorBorder : null}`} type={'text'} value={lastInvite} readOnly/>
                    <div style={{fontSize: '13px', color: '#EB5757'}}>{inviteError}</div>
                </div>,
                    ManageInvite(id, inviteList, setInviteList, setInvite)
                ][manage]
            }/>
    );
}

export default InvitePopup;