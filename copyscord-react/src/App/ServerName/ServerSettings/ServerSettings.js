import React, {useContext, useEffect, useState} from 'react';
import Settings from "../../Settings/Settings";
import style from "./ServerSettings.module.css";
import serverContext from "../../ContextProvider/CurrentServer";
import Overview from "./Overview";
import Bans from "./Bans";
import Invites from "./Invites";

function ServerSettings({exit}) {
    const {activeServer} = useContext(serverContext);
    const [currentMenu, setCurrentMenu] = useState(0)

    useEffect(() => {
        const exitSettings = (event) =>  {
            if(event.keyCode === 27){
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
            title={activeServer.name}
            NavBar={
                <>
                    <button onClick={() => (currentMenu !== 0) ? setCurrentMenu(0) : null} className={`${style.navButton} ${(currentMenu === 0) ? style.activeNav : null}`}>Overview</button>
                    <button onClick={() => (currentMenu !== 1) ? setCurrentMenu(1) : null} className={`${style.navButton} ${(currentMenu === 1) ? style.activeNav : null}`}>Bans</button>
                    <button onClick={() => (currentMenu !== 2) ? setCurrentMenu(2) : null} className={`${style.navButton} ${(currentMenu === 2) ? style.activeNav : null}`}>Invites</button>
                </>
            }
            content={
                [Overview({exit}), Bans({exit}), Invites({exit})][currentMenu]
            }
        />
    );
}

export default ServerSettings;