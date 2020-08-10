import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAt, faHashtag, faCog} from "@fortawesome/free-solid-svg-icons";
import style from './ServerCategory.module.css'
import channelContext from '../ContextProvider/CurrentChannel'
import VoiceChannelContext from '../ContextProvider/CurrentVoiceChannel'
import {Link, useParams} from "react-router-dom";
import ServerContext from "../ContextProvider/CurrentServer";
import Tippy from "@tippyjs/react/headless";
import Popup from "../Popup/Popup";
import {DELETE} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import ChannelsContext from "../ContextProvider/Server/ChannelsList";
import VoiceUsersContext from "../ContextProvider/Server/VocieUsers";
import UserLogo from "../UserLogo/UserLogo";

//Type: 0:text, 1:voice
//Admin: If user  is admin show the cog for edit it.

const ServerChannel = ({channelId, type, name, categoryId, setSettings}) => {
    const [{Authorization}] = useCookies();
    const {activeChannel, setChannel} = useContext(channelContext);
    const {activeServer} = useContext(ServerContext);
    const {activeVoiceChannel, setVoiceChannel} = useContext(VoiceChannelContext);
    const {ServerID} = useParams()
    const [deleteCha, setDeleteCha] = useState(false)
    const [instance, setInstance] = useState()
    const {channelsList, setChannels} = useContext(ChannelsContext);
    const {voiceUserList} = useContext(VoiceUsersContext);

    const deleteChannel = () => {
        DELETE(`channels/${ServerID}/${channelId}`, {}, Authorization).then(({error}) => {
            if (!error) {
                channelsList.some((x, i) => {
                    if (x.categoryId === categoryId) {
                        x.channelsList.some((z, y) => {
                            if (z.id === channelId) {
                                x.channelsList.splice(y, 1)
                                setChannels([...channelsList])
                                setDeleteCha(false)
                                return true
                            }
                            return false
                        })
                        return true
                    }
                    return false
                })
            }
        })

    }

    const onClick = () => {
        (!type) ? setChannel({id: channelId, name}) : setVoiceChannel({id: channelId, name, serverID: activeServer.id})
    }


    const voiceUser = (logo, username, id, key) => {
        return (
            <div key={key} className={style.voiceUser}>
                <UserLogo src={logo} width={32} />
                <div className={style.voiceUsername}>{username}</div>
            </div>
        )
    }


    const button = () => {
        return (
            <div>
                <div className={`${style.channel} ${((activeChannel.id === channelId || activeVoiceChannel.id === channelId) ? style.activeChannel : style.nonactiveChannel)}`}>
                    <Link to={(!type) ? `/${ServerID}/${channelId}` : '#'} className={`${((activeChannel.id === channelId || activeVoiceChannel.id === channelId) ? style.activeChannel : style.nonactiveChannel)}`}>
                        <div onClick={onClick} style={{height: '30px', display: 'flex', flexDirection: 'row', alignItems: 'center', textDecoration: 'none'}}>
                            <FontAwesomeIcon color={'#999999'} icon={(type) ? faAt : faHashtag}/>
                            <div className={style.channelName}>{name}</div>
                        </div>
                    </Link>
                    {
                        (activeServer.isAdmin) ?
                            <div className={style.channelOption} onClick={(e) => {
                                e.preventDefault()
                                setSettings({id: channelId, type: 0, name, categoryId})
                            }}>
                                <FontAwesomeIcon icon={faCog}/>
                            </div>
                            : null
                    }

                </div>
                <div className={style.userList}>
                    {(type)?
                        (voiceUserList && voiceUserList[channelId])?
                            voiceUserList[channelId].map((x,i) => voiceUser(x.logoUrl, x.username, x.id, i))
                            :null
                    :null}
                </div>
            </div>
        )
    }


    if (type) {
        if (activeServer.isAdmin) {
            return (
                <>
                    {(deleteCha) ?
                        <Popup
                            top={
                                <p style={{color: '#FFFFFF', fontWeight: '200'}}>Are you sure you want to delete <span style={{fontWeight: 700}}>'{(name.length > 30) ? `${name.substr(0, 30)}...` : name}'</span></p>
                            }
                            bottom={
                                <>
                                    <button onClick={deleteChannel} className={style.deleteButton}>
                                        <p>Delete channel</p>
                                    </button>
                                    <button className={style.cancelButton} onClick={() => setDeleteCha(false)}>
                                        <p>Cancel</p>
                                    </button>
                                </>
                            }
                            outside={() => setDeleteCha(false)}
                        />
                        : null}
                    <div className={`${((activeChannel.id === channelId || activeVoiceChannel.id === channelId) ? null : style.nonactiveChannel)}`}>
                        <Tippy
                            trigger={'contextmenu'}
                            placement={'bottom'}
                            offset={[5, 5]}
                            arrow={false}
                            hideOnClick={true}
                            interactive={true}
                            onTrigger={((instance, event) => {
                                setInstance(instance)
                                instance.show();
                            })}
                            render={(attrs, content) => (
                                <div className={style.contextMenu}>
                                    <button className={`${style.leave} ${style.contextButton}`} onClick={() => {
                                        instance.hide()
                                        setDeleteCha(true)
                                    }}>Delete channel
                                    </button>
                                </div>
                            )}
                        >
                            {button()}
                        </Tippy>
                    </div>
                </>
            );
        } else {
            return (
                button()
            );
        }
    } else {
        if (activeServer.isAdmin) {
            return (
                <>
                    {(deleteCha) ?
                        <Popup
                            top={
                                <p style={{color: '#FFFFFF', fontWeight: '200'}}>Are you sure you want to delete <span style={{fontWeight: 700}}>'{(name.length > 30) ? `${name.substr(0, 30)}...` : name}'</span></p>
                            }
                            bottom={
                                <>
                                    <button onClick={deleteChannel} className={style.deleteButton}>
                                        <p>Delete channel</p>
                                    </button>
                                    <button className={style.cancelButton} onClick={() => setDeleteCha(false)}>
                                        <p>Cancel</p>
                                    </button>
                                </>
                            }
                            outside={() => setDeleteCha(false)}
                        />
                        : null}
                    <div className={`${((activeChannel.id === channelId || activeVoiceChannel.id === channelId) ? null : style.nonactiveChannel)}`}>
                        <Tippy
                            trigger={'contextmenu'}
                            placement={'bottom'}
                            offset={[0, 5]}
                            arrow={false}
                            hideOnClick={true}
                            interactive={true}
                            onTrigger={((instance, event) => {
                                setInstance(instance)
                                instance.show();
                            })}
                            render={(attrs, content) => (
                                <div className={style.contextMenu}>
                                    <button className={`${style.leave} ${style.contextButton}`} onClick={() => {
                                        instance.hide()
                                        setDeleteCha(true)
                                    }}>Delete channel
                                    </button>
                                </div>
                            )}
                        >
                            {button()}
                        </Tippy>
                    </div>
                </>
            );
        } else {
            return button()
        }

    }


}


export default ServerChannel;