import React, {useContext, useState} from 'react';
import style from '../ChannelSettings/Overview.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useCookies} from "react-cookie";
import ServerContext from "../../ContextProvider/CurrentServer";
import {PUT} from "../../Util/fetcher";

function Overview({settings, exit}) {
    const [categoryName, setCategoryName] = useState(settings.name)
    const [categoryNameErr, setCategoryNameErr] = useState('')

    const [{Authorization}] = useCookies();
    const {activeServer} = useContext(ServerContext);

    const save = (e) => {
        e.preventDefault();
        if (categoryName === settings.name) return true;
        if (!categoryName) return setCategoryNameErr('Name is required')
        if (categoryNameErr) setCategoryNameErr('')
        PUT(`server/${activeServer.id}/${settings.id}`, {name: categoryName}, Authorization).then()
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
                    <div className={style.subTitle}>CATEGORY NAME:</div>
                    <div className={`${style.inputHandler} ${(categoryNameErr) ? style.errorBorder : null}`}>
                        <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type={'text'} className={style.input}/>
                    </div>
                    {(categoryNameErr) ? <div style={{color: '#EB5757'}}>{categoryNameErr}</div> : null}
                    <div className={style.buttonHandler}>
                        <button className={style.saveButton} type={"submit"}>SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Overview;