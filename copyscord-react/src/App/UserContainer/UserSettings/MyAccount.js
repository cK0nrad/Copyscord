import React, {useContext, useState} from 'react';
import style from './UserSettings.module.css'
import UserLogo from "../../UserLogo/UserLogo";
import UserContext from "../../ContextProvider/CurrentUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {DELETE, PUT} from "../../Util/fetcher";
import {useCookies} from "react-cookie";

function MyAccount({exit}) {
    const {currentUser, setUser} = useContext(UserContext);
    const [edit, setEdit] = useState(false)
    const [{Authorization}] = useCookies();

    // Value
    const [username, setUsername] = useState(currentUser.username)
    const [email, setEmail] = useState(currentUser.email)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [updatePassword, setUpdatePassword] = useState(false)

    // Error handler
    const [emailError, setEmailError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')


    const updateProfile = (e) => {
        e.preventDefault()
        let error = false;
        let passError = false;
        if (!password) {
            setPasswordError('Password required')
            error = true
            passError = true
        }
        if (!username) {
            setUsernameError('No username')
            error = true
        } else if (usernameError) setUsernameError('')
        if (!email) {
            setEmailError('No email')
            error = true
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            setEmailError('Invalid email')
            error = true
        } else if (emailError) setEmailError('')

        if (updatePassword && !newPassword && !passError) {
            error = true
            passError = true
            setPasswordError('New password required')
        }

        if (updatePassword && newPassword === password && !passError) {
            setPasswordError('New and old password are the same')
            passError = true
            error = true
        } else if (passwordError && !passError) setPasswordError('')

        if (updatePassword && newPassword.length < 5 && !passError) {
            setPasswordError('New password is too short')
        } else if (passwordError && !passError) setPasswordError('')

        if (!error) {
            let whatToUpdate = {username: '', email: '',}


            if (currentUser.username !== username) whatToUpdate.username = username
            if (currentUser.email !== email) whatToUpdate.email = email


            PUT(`client`, {password, username: whatToUpdate.username, newpassword: newPassword, email: whatToUpdate.email}, Authorization).then(({error, errorCode, userCode}) => {
                if (!error) {
                    currentUser.email = email
                    if (username) currentUser.username = username
                    if (userCode) currentUser.userCode = userCode
                    setUser({...currentUser})
                    setPassword('')
                    setNewPassword('')
                    setEdit(false)
                    setUpdatePassword(false)
                } else if (error === 'unauthorized' || errorCode === 10006) {
                    setPasswordError('Wrong password')
                } else if (errorCode === 10002) {
                    setPassword('')
                    setNewPassword('')
                    setUpdatePassword(false)
                    setEdit(false)
                }
            })

        }


    }

    const uploadImage = (event) => {
        let form = new FormData()
        form.append('logo', event.target.files[0])
        PUT(`client/logo`, {}, Authorization, form).then(({error, logoUrl}) => {
            if (!error) {
                currentUser.logoUrl = logoUrl
                setUser({...currentUser})
            }
        })
    }

    const deleteProfilePicture = () => {
        DELETE(`client/logo`, {}, Authorization).then(({error}) => {
            if (!error) {
                currentUser.logoUrl = '/logo/default.png'
                setUser({...currentUser})
            }
        })
    }

    const dm = (bool) => {
        PUT(`client/dmable`, {dmFromEveryone:bool}, Authorization).then(({error}) => {
            if(!error){
                currentUser.dm = bool
                setUser({...currentUser})
            }
        })
    }

    return (
        <div className={style.handler}>
            <div className={style.titleExit}>
                <p className={style.title}>MY ACCOUNT</p>
                <div className={style.exitButton} onClick={exit}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            {(!edit) ?
                <div className={style.userContainer}>
                    <div style={{margin: '0 10px 0 0'}}>
                        <UserLogo width={128} src={currentUser.logoUrl}/>
                    </div>
                    <div className={style.userInfo}>
                        <div className={style.userInfoHandler}>
                            <div className={style.userInfoTitle}>USERNAME</div>
                            <div className={style.userInfoText}>{(currentUser.username) ? (currentUser.username.length > 30) ? `${currentUser.username.substr(0, 30)}...` : currentUser.username : 'loading'}#{(currentUser.userCode) ? currentUser.userCode.toString().padStart(4, '0'): '#0000'}</div>
                        </div>
                        <div className={style.userInfoHandler}>
                            <div className={style.userInfoTitle}>E-MAIL</div>
                            <div className={style.userInfoText}>{(currentUser.email)?currentUser.email:'loading...'}</div>
                        </div>
                    </div>
                    <div className={style.end}>
                        <button className={style.edit} onClick={() => setEdit(true)}>EDIT</button>
                    </div>
                </div>
                :
                <form onSubmit={updateProfile}>
                    <div className={style.userContainer}>
                        <div style={{margin: '0 10px 0 0', display:'flex', alignItems:'center', flexDirection:'column'}}>
                            <label>
                                <input type={"file"} className={style.imageInput} onChange={uploadImage}/>
                                <UserLogo width={128} src={currentUser.logoUrl}/>
                                <div className={style.changeAvatar}>
                                    <p>CHANGE</p>
                                    <p>AVATAR</p>
                                </div>
                            </label>
                            <div className={style.deleteProfilePicture} onClick={deleteProfilePicture}>REMOVE</div>
                        </div>
                        <div className={style.userInfo}>
                            <div className={style.userInfoHandler}>
                                <div className={style.userInfoTitle}>USERNAME</div>
                                <div className={`${style.inputHandler} ${(usernameError) ? style.errorBorder : null}`}>
                                    <input autoComplete="false" type={'text'} className={style.input} value={username} onChange={(e) => setUsername(e.target.value)} maxLength={100}/>
                                </div>
                                {(usernameError) ? <div className={style.errorText}>{usernameError}</div> : null}
                            </div>
                            <div className={style.userInfoHandler}>
                                <div className={style.userInfoTitle}>E-MAIL</div>
                                <div className={`${style.inputHandler} ${(emailError) ? style.errorBorder : null}`}>
                                    <input autoComplete="false" type={'text'} className={style.input} value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                {(emailError) ? <div className={style.errorText}>{emailError}</div> : null}
                            </div>
                            {(updatePassword) ?
                                <div className={style.userInfoHandler}>
                                    <div className={style.userInfoTitle}>NEW PASSWORD</div>
                                    <div className={style.inputHandler}>
                                        <input autoComplete={'new-password'} type={'password'} className={style.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                                    </div>
                                </div>
                                : null}
                            <div className={style.userInfoHandler}>
                                <div className={style.userInfoTitle}>CURRENT PASSWORD</div>
                                <div className={`${style.inputHandler} ${(passwordError) ? style.errorBorder : null}`}>
                                    <input autoComplete={'new-password'} type={'password'} className={style.input} value={password} onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                {(passwordError) ? <div className={style.errorText}>{passwordError}</div> : null}

                            </div>

                            <div style={{padding: '5px 0', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <button type={"button"} className={style.changePassword} onClick={() => setUpdatePassword(!updatePassword)}>{(!updatePassword) ? 'Change password' : 'Cancel'}</button>
                                    <button type={"button"} className={`${(currentUser.dm)?style.canReceiveDM:style.changePassword}`} onClick={() => dm(!currentUser.dm)}>{(!currentUser.dm) ? 'DM: close' : 'DM: open'}</button>
                                </div>
                                <div>
                                    <button type={"button"} className={style.cancelButton} onClick={() => {
                                        setEdit(false)
                                        setUpdatePassword(false)
                                    }}><p>Cancel</p></button>
                                    <button className={style.updateButton} type={"submit"}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            }
        </div>
    );
}

export default MyAccount;