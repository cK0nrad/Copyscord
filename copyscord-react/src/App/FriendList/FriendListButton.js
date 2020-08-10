import React, {useState} from 'react';
import style from "./FriendList.module.css";
import UserLogo from "../UserLogo/UserLogo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentAlt, faEllipsisV, faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom'
import Tippy from '@tippyjs/react/headless';
import Popup from "../Popup/Popup";

const FriendListButton = ({removeFriend, sent, src, status, username, id, request, acceptFriend, removeRequest, userCode}) => {
    const [instance, setInstance] = useState();
    const [friendDeletePopup, setFriendDeletePopup] = useState(false)

    const removeFriendPopup = () => {
        instance.hide()
        setFriendDeletePopup(true)
    }

    if (request) {
        return (
            <div className={style.user}>
                <div className={style.separator}>
                    <div className={style.userLogo}>
                        <UserLogo src={src} status={status} bgcolor={"#4A4A4A"}/>
                    </div>
                    <p className={style.username}>{username}<span className={style.userCode}>#{userCode.toString().padStart(4, '0')}</span></p>

                </div>
                <div className={style.separator}>
                    {(sent) ? <div className={style.action} onClick={() => acceptFriend(id)}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </div> : null}
                    <div className={style.action} onClick={() => removeRequest(id, sent)}>
                        <FontAwesomeIcon icon={faMinus}/>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            {(friendDeletePopup) ?
                <Popup outside={() => setFriendDeletePopup(false)}
                       top={
                           <p style={{color: '#FFFFFF'}}>Are you sure you want to delete <span style={{fontWeight: 700}}>'{(username.length > 30) ? `${username.substr(0, 30)}...` : username}' </span>from your friends</p>
                       }
                       bottom={
                           <>
                               <button onClick={() => removeFriend(id)} className={style.deleteButton}>
                                   <p>Remove</p>
                               </button>
                               <button className={style.cancelButton} onClick={() => setFriendDeletePopup(false)}>
                                   <p>Cancel</p>
                               </button>
                           </>
                       }
                />
                : null}
            <div className={style.user}>
                <div className={style.separator}>
                    <div className={style.userLogo}>
                        <UserLogo src={src} status={status} bgcolor={"#4A4A4A"}/>
                    </div>
                    <div className={style.username}>{username}<span className={style.userCode}>#{userCode.toString().padStart(4, '0')}</span></div>
                </div>
                <div className={style.separator}>
                    <Link to={`/@me/${id}`} style={{textDecoration: 'none'}}>
                        <div className={style.action}>
                            <FontAwesomeIcon icon={faCommentAlt}/>
                        </div>
                    </Link>
                    <Tippy
                        placement={'bottom'}
                        trigger={'click'}
                        interactive={true}
                        onTrigger={((instance, event) => {
                            setInstance(instance)
                            instance.show();
                        })}
                        render={(attrs, content) => {
                            return (
                                <div className={style.contextMenu}>
                                    <button onClick={removeFriendPopup} className={`${style.delete} ${style.contextButton}`}>Remove friend</button>
                                </div>
                            )
                        }}
                    >
                        <div className={style.action}>
                            <FontAwesomeIcon icon={faEllipsisV}/>
                        </div>
                    </Tippy>
                </div>
            </div>
        </>
    );
}

export default FriendListButton;