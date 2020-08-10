import React, { useState} from 'react';
import Popup from "../Popup/Popup";
import style from './AddChannel.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAt, faHashtag} from "@fortawesome/free-solid-svg-icons";
import {useParams} from "react-router-dom";
import {POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";

function AddChannel({outside, categoryName, categoryId}) {
    const [{Authorization}] = useCookies();
    const [type, setType] = useState(0)
    const [name, setName] = useState('')
    const [error, setError] = useState('')


    const {ServerID} = useParams();

    const createChannel = (e) => {
        e.preventDefault()
        if (!name) return setError('Channel name required')
        POST(`server/${ServerID}/${categoryId}/channels`, {name, type}, Authorization).then(() => {
            outside()
        })

    }

    return (
        <Popup outside={outside}
               bottom={
                   <>
                       <button onClick={createChannel} className={style.createButton}>
                           <p>Create channel</p>
                       </button>
                       <button className={style.cancelButton} onClick={outside}>
                           <p>Cancel</p>
                       </button>
                   </>
               }
               top={
                   <div className={style.content}>
                       <form onSubmit={createChannel}>
                       <div className={style.titleHandler}>
                           <p className={style.title}>CREATE {(type) ? 'voice' : 'text'} CHANNEL</p>
                           <div className={style.categoryName}><span>in {categoryName}</span></div>
                       </div>
                       <div className={style.form}>
                           <p className={style.subTitle}>CHANNEL TYPE</p>
                           <div className={`${style.channelType} ${(!type) ? style.activeType : null}`} onClick={() => (type) ? setType(0) : null}>
                               <label className={style.checkbox}>
                                   <input type={"radio"} name={"checkbox"} checked={type === 0} onChange={() => (type) ? setType(0) : null}/>
                                   <span className={style.checkboxSpan}/>
                               </label>
                               <FontAwesomeIcon className={style.channelTypeFa} icon={faHashtag}/>
                               <p>Text Channel</p>
                           </div>
                           <div className={`${style.channelType} ${(type) ? style.activeType : null}`} onClick={() => (!type) ? setType(1) : null}>
                               <label className={style.checkbox}>
                                   <input type={"radio"} name={"checkbox"} checked={type} onChange={() => (!type) ? setType(1) : null}/>
                                   <span className={style.checkboxSpan}/>
                               </label>
                               <FontAwesomeIcon className={style.channelTypeFa} icon={faAt}/>
                               <p>Voice Channel</p>
                           </div>
                       </div>

                       <div className={style.form}>
                           <p className={style.subTitle}>CHANNEL NAME</p>
                           <div className={style.inputText}>
                               <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} type={'text'} className={`${style.channelName} ${(error) ? style.borderError : null}`}/>
                               {(error) ? <p className={style.error}>{error}</p> : null}
                           </div>
                       </div>
                       </form>
                   </div>
               }

        />
    );
}

export default AddChannel;