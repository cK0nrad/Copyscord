import React, {useContext, useEffect} from 'react';
import Settings from "../../Settings/Settings";
import style from './UserSettings.module.css'
import MyAccount from "./MyAccount";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'
import UserContext from "../../ContextProvider/CurrentUser";
import ServerListContext from "../../ContextProvider/ServerList";
import ServerContext from "../../ContextProvider/CurrentServer";

function UserSettings({exit}) {
    const [,,deleteCookie] = useCookies();
    const {setUser} = useContext(UserContext);
    const {setServers} = useContext(ServerListContext);
    const {setServer} = useContext(ServerContext);

    const history = useHistory()
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
            title={'USER SETTINGS'}
            NavBar={
                <>
                    <button className={style.navButton}>My account</button>
                    <div className={style.navSeparator}/>
                    <button className={style.logout} onClick={() => {
                        exit()
                        setServers({})
                        setServer({})
                        setUser({})
                        deleteCookie("Authorization")
                        history.push('/login')
                    }}>Logout</button>
                </>
            }
            content={
                <MyAccount exit={exit}/>
            }
        />
    );
}

export default UserSettings;