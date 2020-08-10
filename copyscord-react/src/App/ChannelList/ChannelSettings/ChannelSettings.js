import React, {useEffect} from 'react';
import Settings from "../../Settings/Settings";
import style from './ChannelSettings.module.css'
import Overview from "./Overview";
function ChannelSettings({exit, settings}) {

    useEffect(() => {
        const exitSettings = (event) => {
            if (event.keyCode === 27) {
                exit()
            }
        }
        window.addEventListener('keyup', exitSettings);
        return () => {
            window.removeEventListener('keyup', exitSettings);
        };
    }, [exit]);

    return (
        <Settings
            NavBar={
                <button className={style.navButton}>Overview</button>
            }
            content={
                <Overview exit={exit} settings={settings}/>
            }
            title={
                settings.name
            }/>
    );
}

export default ChannelSettings;