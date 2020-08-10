import React from 'react';
import ServerList from './ServerList/ServerList';
import ChannelList from "./ChannelList/ChannelList";
import TopBar from "./TopBar/TopBar";
import style from "./App.module.css";
import FriendList from "./FriendList/FriendList";
import Chat from "./Chat/Chat";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import Login from "./Login/Login";
import Register from "./Login/Register";
import config from "./config";
import {useCookies} from 'react-cookie';


const Copyscord = () => {
    const [{Authorization}] = useCookies();

    if (!Authorization) {
        return (
            <div className={style.handler}>
                <div className={style.container}>
                    <Router>
                        <Switch>
                            <Route path={"/login"}>
                                {(Authorization) ?
                                    <Redirect to={'/@me'}/> : <Login/>
                                }
                            </Route>
                            <Route path={"/register"}>
                                {(Authorization) ?
                                    <Redirect to={'/@me'}/> : <Register/>
                                }
                            </Route>
                            <Route path={"/"}>
                                <Redirect push to={"/login"}/>
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </div>
        )
    } else {


        return (
            <div className={style.handler}>
                {(config.TopBar) ? <TopBar/> : null}
                <div className={style.container}>
                    <Router>
                        <Switch>
                            <Route path="/@me/:FriendID">
                                <ServerList/>
                                <ChannelList type={0} name={"DIRECT MESSAGES"}/>
                                <Chat type={0}/>
                            </Route>
                            <Route path="/@me">
                                <ServerList/>
                                <ChannelList type={0} name={"DIRECT MESSAGES"}/>
                                <FriendList/>
                            </Route>
                            <Route path={"/:ServerID/:ChannelID"}>
                                <ServerList/>
                                <ChannelList type={1}/>
                                <Chat user type={1}/>
                            </Route>
                            <Route path={"/:ServerID"}>
                                <ServerList/>
                                <ChannelList type={1}/>
                                <Chat user type={1}/>
                            </Route>
                            <Route path={"/"}>
                                <Redirect push to={"/@me"}/>
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}
export default Copyscord