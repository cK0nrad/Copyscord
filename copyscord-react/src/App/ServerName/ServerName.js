import React, {useContext, useState} from 'react';
import Tippy from '@tippyjs/react/headless';
import style from './ServerName.module.css'
import ServerContext from "../ContextProvider/CurrentServer";
import Popup from "../Popup/Popup";
import AddCategory from "../AddCategory/AddCategory";
import ServerSettings from "./ServerSettings/ServerSettings";
import InvitePopup from "./invitePopup/InvitePopup";

const ServerName = ({name, type, leaveServer, deleteServer}) => {
    const {activeServer} = useContext(ServerContext);
    const [addCategory, setAddCategory] = useState(false)
    const [popup, setPopup] = useState(false)
    //0: Nothing, 1: invite, 2: leave, 3: delete
    const [popupType, setPopupType] = useState(0)
    const [instance, setInstance] = useState()
    const [serverSettings, setServerSettings] = useState(false)

    const leaveServerFnct = () => {
        instance.hide()
        setPopupType(3)
        setPopup(true)
    }
    const deleteServerFnct = () => {
        instance.hide()
        setPopupType(2)
        setPopup(true)
    }

    const invitePopup = () => {
        instance.hide()
        setPopupType(1)
        setPopup(true)
    }

    if (!type) {
        return (
            <div className={style.handler}>
                <div className={style.serverName}>
                    <p>{name}</p>
                </div>
            </div>
        )
    } else {
        return (<>
                {(addCategory) ? <AddCategory outside={() => setAddCategory(false)} />:null}
                {(serverSettings && activeServer.name) ? <ServerSettings exit={() => setServerSettings(false)} />:null}
                {(popup) ?
                    (popupType === 2 || popupType === 3) ?
                        <Popup outside={() => setPopup(false)}
                               bottom={
                                   <>
                                       <button className={style.leaveButton}
                                               onClick={() => {
                                                   setPopup(false)
                                                   if (popupType === 2) {
                                                       deleteServer(activeServer.id)
                                                   } else {
                                                       leaveServer(activeServer.id)
                                                   }
                                               }}
                                       >
                                           <p>{(popupType === 2) ? 'DELETE' : 'Leave'}</p>
                                       </button>

                                       <button className={style.cancelButton} onClick={() => setPopup(false)}>
                                           <p>Cancel</p>
                                       </button>
                                   </>
                               }

                               top={
                                   <p style={{color: '#FFFFFF', fontSize: '15px', fontWeight: 400}}>
                                       Are you sure to {(popupType === 2) ?
                                       <span style={{color: '#EB5757'}}>DELETE</span> : 'leave'}
                                       <span style={{fontWeight: 900}}> '{(name.length > 30) ? `${name.substr(0,30)}...`:name}'</span>?
                                   </p>
                               }
                        /> : (popupType === 1) ?
                            <InvitePopup setPopup={setPopup} id={activeServer.id}/>
                        : null
                    : null
                }
                <Tippy
                    trigger={'click'}
                    placement={'bottom-start'}
                    arrow={false}
                    offset={[15,5]}
                    interactive={true}
                    hideOnClick={true}
                    onTrigger={((instance, event) => {
                        setInstance(instance)
                        instance.show();
                    })}
                    render={(attrs, content) => (
                        <div className={`${style.contextMenu} ${style.slideIn}`}>
                            {(activeServer.isAdmin) ?
                                <button className={`${style.normalContext} ${style.contextButton}`} onClick={() => {
                                    instance.hide()
                                    setServerSettings(true)
                                }}>Edit server</button> : null
                            }
                            <button className={`${style.normalContext} ${style.contextButton}`} onClick={invitePopup}>
                                Invite
                            </button>
                            {(activeServer.isAdmin) ?
                                <button className={`${style.normalContext} ${style.contextButton}`} onClick={() => {
                                    instance.hide()
                                    setAddCategory(true)
                                }}>Create category </button> : null
                            }
                            {(activeServer.isOwner) ?
                                <button className={`${style.leave} ${style.contextButton}`} onClick={deleteServerFnct}>DELETE server</button> :
                                <button className={`${style.leave} ${style.contextButton}`} onClick={leaveServerFnct}>Leave server</button>
                            }
                        </div>
                    )}
                >
                    <div className={style.handler}>
                        <div className={style.serverName}>
                            {name}
                        </div>
                    </div>
                </Tippy></>
        );
    }
}

export default ServerName;