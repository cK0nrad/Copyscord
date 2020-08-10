import React, {useState} from 'react';
import style from "./CreateJoinServer.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import AddServer from "./AddServer";
import JoinServer from "./JoinServer";

function CreateJoinServer({outside}) {
    const [type, setType] = useState(0)
    const closePopup = (e) => {
        if (e) {
            e.preventDefault();
            if (e.currentTarget === e.target) {
                outside()
            }
        }else{
            outside()
        }
    }
    return (
        <div className={style.popup} onClick={closePopup}>
            {(!type) ?
                <div className={style.popupHandler}>
                    <div className={style.title}>Join or create a server</div>
                    <div className={style.content}>
                        <div className={style.joinCreate} onClick={() => setType(1)}>
                            <p style={{margin: 0}}><span style={{fontWeight: 700}}>Create</span> a server</p>
                            <FontAwesomeIcon className={style.icons} icon={faPlusSquare}/>
                            <button className={style.create}>Create server</button>
                        </div>
                        <div className={style.joinCreate} onClick={() => setType(2)}>
                            <p style={{margin: 0}}><span style={{fontWeight: 700}}>Join</span> a server</p>
                            <FontAwesomeIcon className={style.icons} icon={faSignInAlt}/>
                            <button className={style.join}>Join server</button>
                        </div>
                    </div>
                </div> :
                (type - 1) ? <JoinServer close={closePopup} back={() => setType(0)}/> :
                    <AddServer close={closePopup} back={() => setType(0)}/>
            }
        </div>
    );
}

export default CreateJoinServer;