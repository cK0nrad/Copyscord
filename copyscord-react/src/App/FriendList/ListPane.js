import React, {useContext, useEffect, useState} from 'react';
import style from "./FriendList.module.css";
import FriendListButton from "./FriendListButton";
import {Scrollbars} from "react-custom-scrollbars";
import {DELETE, GET, POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import AddFriend from "./AddFriend";
import FriendsListContext from "../ContextProvider/FriendsList";

//Type: 0=Online, 1=All, 2=Request
const category = ["ONLINE", "ALL", "REQUEST", "ADD FRIEND"]

const ListPane = ({type}) => {
    const [{Authorization}] = useCookies()
    const [currentType, setType] = useState(2)
    const {friendsList, setFriendsList} = useContext(FriendsListContext);



    const acceptFriend = (id) => {
        POST(`friends`, {userId: id}, Authorization).then(({error}) => {
            if (!error) {
                friendsList.received.some((x, i) => {
                    if (x.id === id) {
                        friendsList.received.splice(i, 1)
                        return true
                    }
                    return false
                })
                setFriendsList({received: friendsList.received, sent: friendsList.sent})
            }

        })
    }

    const removeRequest = (id, sent) => {
        DELETE(`friends/request/${id}`, {}, Authorization).then(({error}) => {
            if (!error) {
                if (sent) {
                    friendsList.received.some((x, i) => {
                        if (x.id === id) {
                            friendsList.received.splice(i, 1)
                            return true
                        }
                        return false
                    })
                    setFriendsList({received: friendsList.received, sent: friendsList.sent})
                } else {
                    friendsList.sent.some((x, i) => {
                        if (x.id === id) {
                            friendsList.sent.splice(i, 1)
                            return true
                        }
                        return false
                    })
                    setFriendsList({received: friendsList.received, sent: friendsList.sent})
                }
            }
        })

    }


    const removeFriend = (id) => {
        DELETE(`friends`, {userId: id}, Authorization).then(({error}) => {
            if (!error) {
                friendsList.some((x, i) => {
                    if (x.id === id) {
                        friendsList.splice(i, 1)
                        setFriendsList([...friendsList])
                        return true
                    }
                    return false
                })
            }
        })
    }



    useEffect(() => {
        if (type === 0 || type === 1) {
            if (currentType !== 1 && currentType !== 0) {
                GET(`friends`, {}, Authorization).then((list) => {
                    setType(type);
                    setFriendsList(list)
                }).catch(() => {
                    setType(type)
                })
            }
        } else if (type === 2) {
            if (currentType !== 2) {
                GET(`friends/request`, {}, Authorization).then((request) => {
                    setType(type);
                    setFriendsList(request)
                })
            }
        } else if (type === 3) {
            if (currentType !== 3) {
                setType(type)
            }
        }
    }, [type, currentType, Authorization, setFriendsList])
    return (
        <Scrollbars style={{height: "100%"}}>
            <div className={style.list}>
                <div className={style.title}>
                    <p>{category[type]}</p>
                </div>
                {(type === 2) ? <p className={style.subTitle}>Sent: </p> : null}
                {(type === 3) ? <AddFriend/> : (friendsList && friendsList[0] && friendsList[0].id) ? (type !== 2) ?
                    friendsList.map(({id, logoUrl, status, name, code}) => {
                        if (!type && status !== 0) {
                            return <FriendListButton removeFriend={removeFriend} userCode={code} key={id} id={id}
                                                     src={logoUrl} username={name} status={status}/>
                        }
                        if (type) {
                            return <FriendListButton removeFriend={removeFriend} userCode={code} key={id} id={id}
                                                     src={logoUrl} username={name} status={status}/>;
                        }
                        return false;
                    }) : null
                    : (friendsList.sent && friendsList.sent[0] && friendsList.sent[0].id) ? friendsList.sent.map(({id, logoUrl, name, code}, i) => {
                        return <FriendListButton acceptFriend={acceptFriend} userCode={code}
                                                 removeRequest={removeRequest} request
                                                 username={name} key={i} id={id} src={logoUrl}/>
                    }) : null}
                {(type === 2) ?
                    <>
                        <p className={style.subTitle}>Received: </p>
                        {(friendsList.received && friendsList.received[0] && friendsList.received[0].id) ? friendsList.received.map(({id, logoUrl, name, code}, i) => {
                            return <FriendListButton acceptFriend={acceptFriend} userCode={code}
                                                     removeRequest={removeRequest} request sent
                                                     username={name} key={i} id={id} src={logoUrl}/>
                        }) : null}
                    </>
                    : null
                }
            </div>
        </Scrollbars>
    );
}

export default ListPane;