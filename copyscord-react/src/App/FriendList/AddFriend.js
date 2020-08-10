import React, {useState} from 'react';
import style from './AddFriend.module.css'
import {POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";

function AddFriend() {
    const [input, setInput] = useState('')
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [{Authorization}] = useCookies()

    const splitter = (input) => {
        if (!input) {
            setError('No username')
            return {error}
        }
        input = input.split('#')
        let userCode = input[input.length - 1]
        if (input.length === 1) {
            setError('No user code')
            return {error}
        }
        if (isNaN(userCode) || parseInt(userCode) > 9999 || parseInt(userCode) < 0 || !userCode) {
            setError('Invalid user tag')
            return {error}
        }
        input.pop()
        let username = input.join('#')
        if (error) setError('')
        if (success) setSuccess('')
        return {userCode, username}
    }

    const addFriendFnct = (e) => {
        e.preventDefault()
        let {userCode, username, error} = splitter(input)
        if (!error) {
            POST(`friends`, {username, userCode}, Authorization).then(({error}) => {
                if (error) return setError(`${(error[0]) ? error[0].toUpperCase() : 'error'}${(error[0]) ? error.slice(1, error.length) : ''}`)

                setSuccess(`Successfully added ${username}#${userCode.toString().padStart(4, '0')} to friend`)
            })
        }
    }

    return (
        <>
            {(error) ?
                <div className={`${style.alert}`}>
                    <span className={style.closebtn} onClick={() => setError('')}>&times;</span>
                    {error}
                </div>
                : null
            }
            {(success) ?
                <div className={`${style.success}`}>
                    <span className={style.closebtn} onClick={() => setSuccess('')}>&times;</span>
                    {success}
                </div>
                : null
            }
            <form onSubmit={addFriendFnct}>
                <div className={style.addFriend}>
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={"Ex: foo#2323"}
                           type={'text'} className={style.input}/>
                    <button className={style.button} type={"submit"}>Add to friend</button>
                </div>
            </form>
        </>
    );
}

export default AddFriend;