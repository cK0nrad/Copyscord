import React, {useContext, useState} from 'react';
import style from './Overview.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useCookies} from "react-cookie";
import ServerContext from "../../ContextProvider/CurrentServer";
import {PUT} from "../../Util/fetcher";
import channelContext from "../../ContextProvider/CurrentChannel";
import ChannelsContext from "../../ContextProvider/Server/ChannelsList";

function Overview({settings, exit}) {
    const [channelName, setChannelName] = useState(settings.name)
    const [channelNameErr, setChannelNameErr] = useState('')
    const {activeChannel, setChannel} = useContext(channelContext);
    const { channelsList, setChannels } = useContext(ChannelsContext);

    const [{Authorization}] = useCookies();
    const {activeServer} = useContext(ServerContext);

    const save = (e) => {
        e.preventDefault()
        if (channelName === settings.name) return true;
        if (!channelName) return setChannelNameErr('Name is required')
        if (channelNameErr) setChannelNameErr('')
        PUT(`channels/${activeServer.id}/${settings.id}`, {name: channelName}, Authorization).then(({error}) => {
            channelsList.some(x => {
                if (x.categoryId === settings.categoryId) {
                    x.channelsList.some(j => {
                        if (j.id === settings.id) {
                            if(activeChannel.id === settings.id) {
                                activeChannel.name = channelName
                                settings.name = channelName
                                setChannel({...activeChannel})
                            }
                            j.name = channelName
                            setChannels([...channelsList])
                            return true
                        }
                        return false
                    })
                    return true
                }
                return false
            })
        })
    }

    return (
        <div className={style.handler}>
            <div className={style.titleExit}>
                <p className={style.title}>OVERVIEW</p>
                <div className={style.exitButton} onClick={exit}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            <div className={style.overview}>
                <form onSubmit={save} action={"#"}>
                    <div className={style.subTitle}>CHANNEL NAME:</div>
                    <div className={style.inputHandler}>
                        <input value={channelName} onChange={(e) => setChannelName(e.target.value)} type={'text'} className={style.input}/>
                    </div>
                    {(channelNameErr) ? <div style={{color: '#EB5757'}}>{channelNameErr}</div> : null}
                    <div className={style.buttonHandler}>
                        <button className={style.saveButton} type={"submit"}>SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Overview;