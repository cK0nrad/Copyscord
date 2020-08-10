import React, {useState} from 'react';
import Popup from "../Popup/Popup";
import style from '../AddChannel/AddChannel.module.css'
import {useParams} from "react-router-dom";
import {POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";

function AddCategory({outside}) {
    const [{Authorization}] = useCookies();
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const {ServerID} = useParams();

    const createChannel = (e) => {
        e.preventDefault();
        if (!name) return setError('Category name required')
        POST(`server/${ServerID}/category`, {name}, Authorization).then(({error, id, name}) => {
            outside()
            }
        )
    }

    return (
        <Popup outside={outside}
               bottom={
                   <>
                       <button onClick={createChannel} className={style.createButton}>
                           <p>Create category</p>
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
                               <p className={style.title}>CREATE CATEGORY</p>
                           </div>

                           <div className={style.form}>
                               <p className={style.subTitle}>CATEGORY NAME</p>
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

export default AddCategory;