import React, {useState} from 'react';
import style from "./ChannelList.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import ServerCategory from "../ServerCategory/ServerCategory";
import ChannelSettings from "./ChannelSettings/ChannelSettings";
import CategorySettings from "./CategorySettings/CategorySettings";
const ServerChannels = ({channels}) => {
    //const [settings, setSettings] = useState({})
    //Settings type: Channel:0, category: 1
    const [settings, setSettings] = useState({})
    return (
        <>
            {(settings.id) ? (settings.type) ? <CategorySettings exit={() => setSettings({})} settings={settings} /> : <ChannelSettings exit={() => setSettings({})} settings={settings}/> : null}
            <div className={style.channelList}>
                <Scrollbars autoHide style={{height: "100%"}}>
                    {
                        (channels) ? channels.map(({channelsList, categoryName, categoryId}, i) => (
                            <ServerCategory setSettings={setSettings} key={i} id={categoryId} name={categoryName} channels={channelsList}/>
                        )) : null
                    }
                </Scrollbars>
            </div>
        </>
    );
}

export default ServerChannels;