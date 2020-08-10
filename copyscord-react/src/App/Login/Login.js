import React, {useRef, useState} from 'react';
import style from "./Login.module.css"
import {Link, useHistory} from "react-router-dom";
import {GET} from '../Util/fetcher'
import {useCookies} from 'react-cookie';

const Login = () => {
    const [error, setError] = useState("")
    // eslint-disable-next-line
    const [, setCookie] = useCookies();
    const email = useRef()
    const password = useRef()
    const history = useHistory()
    const logMe = (e) => {
        e.preventDefault();
        GET("authorize", {email: email.current.value, password: password.current.value}).then(({error, errorCode, loginToken}) => {
            if (errorCode === 2001) return setError("Wrong email or password")
            if (!error) {
                if (loginToken) {
                    setCookie("Authorization", loginToken);
                    history.push(`/@me`)
                } else {
                    setError('Unknown error')
                }
            }
        }).catch(() => {
            setError('Unknown error')
        })
        return true
    }
    const hideError = () => {
        setError("")
    }
    return (
        <div className={style.handler}>
            {(error) ?
                <div className={`${style.alert}`}>
                    <span className={style.closebtn} onClick={(hideError)}>&times;</span>
                    {error}
                </div>
                : null
            }

            <div className={`${style.login} ${style.slideInTop}`}>
                <form onSubmit={logMe}>
                    <div className={style.input}>
                        <p className={style.inputText}>E-MAIL</p>
                        <input type={"email"} className={style.inputForm} ref={email} required/>
                    </div>
                    <div className={style.input}>
                        <p className={style.inputText}>PASSWORD</p>
                        <input type={"password"} className={style.inputForm} ref={password} required/>
                    </div>
                    <input type={"submit"} className={style.inputButton} value="Login"/>
                    <div className={style.bottom}>
                        <p className={style.redirect}>Need an account ? </p>
                        <Link to={"/register"} style={{textDecoration: 'none'}}><p className={style.switch}>Register</p></Link>
                    </div>
                </form>

            </div>
        </div>

    );
}

export default Login;