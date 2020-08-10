import React, {useState} from 'react';
import style from "./Register.module.css";
import {Link} from 'react-router-dom'
import {POST} from "../Util/fetcher";
import {useCookies} from "react-cookie";

const Register = () => {
    const [, setCookie] = useCookies();
    //Data
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    //Error
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [emailError, setEmailError] = useState('')



    const register = (e) => {
        e.preventDefault()
        POST(`user`, {email, username, password}, null).then(({error, errorCode, authorization}) => {
            if(errorCode === 5005){
                if(usernameError) setPasswordError('')
                if(emailError) setEmailError('')
                return setPasswordError(error)
            }else if(errorCode === 5008){
                if(usernameError) setPasswordError('')
                if(passwordError) setPasswordError('')
                return setEmailError(error)
            }else if(errorCode === 5006){
                if(passwordError) setPasswordError('')
                if(emailError) setEmailError('')
                return setUsernameError(error)
            }else{
                setCookie("Authorization", authorization);
            }
        })


    }


    return (
        <div className={`${style.login} ${style.slideInTop}`}>
            <form onSubmit={register}>
            <div className={style.input}>
                <p className={style.inputText}>E-MAIL</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type={"email"} className={`${style.inputForm} ${(emailError)?style.errorBorder:null}`} required/>
                {(emailError)?<div style={{color:"#EB5757"}}>{emailError}</div>:null}
            </div>
            <div className={style.input}>
                <p className={style.inputText}>USERNAME</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type={"text"} className={`${style.inputForm} ${(usernameError)?style.errorBorder:null}`} required/>
                {(usernameError)?<div style={{color:"#EB5757"}}>{usernameError}</div>:null}
            </div>
            <div className={style.input}>
                <p className={style.inputText}>PASSWORD</p>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={"password"} className={`${style.inputForm} ${(passwordError)?style.errorBorder:null}`} required/>
                {(passwordError)?<div style={{color:"#EB5757"}}>{passwordError}</div>:null}
            </div>
            <input type="submit" className={style.inputButton} value="Register"/>
            <div className={style.bottom}>
                <p className={style.redirect}>Already an account ? </p>
                <Link to={"/login"} style={{textDecoration: 'none'}}><p className={style.switch}> Login</p></Link>
            </div>
            </form>
        </div>
    );
}

export default Register;