import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faPlus} from "@fortawesome/free-solid-svg-icons";
import style from './ServerCategory.module.css'
import Tippy from '@tippyjs/react';
import Tippy2 from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import '../tippy.css';
import ServerChannel from "./ServerChannel";
import ServerContext from "../ContextProvider/CurrentServer";
import AddChannel from "../AddChannel/AddChannel";
import Popup from "../Popup/Popup";
import {DELETE} from "../Util/fetcher";
import {useCookies} from "react-cookie";
import {useParams} from "react-router-dom";
import ChannelsContext from "../ContextProvider/Server/ChannelsList";

const ServerCategory = ({name, channels, id, setSettings}) => {
    const [{Authorization}] = useCookies();
    const [extended, setExtended] = useState(true)
    const {activeServer} = useContext(ServerContext);
    const [addServer, setAddServer] = useState(false)
    const [deleteCat, setDeleteCat] = useState(false)
    const { channelsList, setChannels } = useContext(ChannelsContext);


    const [instance, setInstance] = useState()
    const {ServerID} = useParams();

    const onClick = () => {
        setExtended(!extended)
    }

    const deleteCategory = () => {
        DELETE(`server/${ServerID}/${id}`, {}, Authorization).then(({id: deletedId, error}) => {
            if (!error) {
                channelsList.some((x, i) => {
                    if (x.categoryId === deletedId) {
                        channelsList.splice(i, 1)
                        setChannels([...channelsList])
                        setDeleteCat(false)
                        return true;
                    }
                    return false;
                })
            }
        })
    }

    if (activeServer.isAdmin) {
        return (<>
            {(addServer) ?
                <AddChannel categoryId={id} categoryName={name} outside={() => setAddServer(false)}/>
                : null
            }
            {(deleteCat) ?
                <Popup
                    outside={() => setDeleteCat(false)}
                    top={
                        <p style={{color: '#FFFFFF'}}>Are you sure you want to delete <span style={{fontWeight: 700}}>'{(name.length > 30) ? `${name.substr(0, 30)}...` : name}'</span></p>
                    }
                    bottom={
                        <>
                            <button onClick={deleteCategory} className={style.deleteButton}>
                                <p>Delete category</p>
                            </button>
                            <button className={style.cancelButton} onClick={() => setDeleteCat(false)}>
                                <p>Cancel</p>
                            </button>
                        </>
                    }
                />
                : null
            }

            <div className={style.category}>
                <div>
                    <div className={style.name}>
                        <div>
                            <Tippy2
                                trigger={'contextmenu'}
                                placement={'bottom'}
                                offset={[15, 5]}
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
                                            setDeleteCat(true)
                                        }}>Delete category
                                        </button>
                                        <button className={`${style.settings} ${style.contextButton}`} onClick={() => {
                                            instance.hide()
                                            setSettings({id, name, type:1})
                                        }}>Category settings
                                        </button>

                                    </div>
                                )}
                            >
                                <div className={style.nameDiv} onClick={onClick}>
                                    <FontAwesomeIcon icon={faAngleDown} rotation={(extended) ? 0 : 270} className={style.arrow}/>
                                    <div className={style.categoryName}><span>{name}</span></div>
                                </div>
                            </Tippy2>
                        </div>
                        <Tippy
                            content="Add channel"
                            placement={'top'}
                            className={"serverTips"}
                            arrow={true}
                            animation={false}
                        >
                            <div className={style.addChannel} onClick={() => setAddServer(true)}>
                                <FontAwesomeIcon icon={faPlus}/>
                            </div>
                        </Tippy>
                    </div>
                </div>
                <div className={(!extended) ? style.hidden : null} style={{marginLeft: 15}}>
                    {(channels) ? (channels.length) ?
                        channels.map(channel => (
                            <ServerChannel setSettings={setSettings} categoryId={id} key={channel.id} channelId={channel.id} type={channel.type} name={channel.name}/>
                        ))
                        : null
                        : null
                    }
                </div>
            </div>
        </>)
    } else {
        return (
            <>
                {(addServer) ?
                    <AddChannel categoryId={id} categoryName={name} outside={() => setAddServer(false)}/>
                    : null
                }
                <div className={style.category}>
                    <div className={style.name}>
                        <div className={style.nameDiv} onClick={onClick}>
                            <FontAwesomeIcon icon={faAngleDown} rotation={(extended) ? 0 : 270} className={style.arrow}/>
                            <div className={style.categoryName}><span>{name}</span></div>
                        </div>
                    </div>
                    <div className={(!extended) ? style.hidden : null} style={{marginLeft: 15}}>
                        {(channels) ? (channels.length) ?
                            channels.map((channel, i) => {
                                return  <ServerChannel key={i} categoryId={id} channelId={channel.id} type={channel.type} name={channel.name}/>
                            })
                            : null
                            : null
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default ServerCategory;