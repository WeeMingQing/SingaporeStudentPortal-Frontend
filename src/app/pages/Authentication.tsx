import "./Authentication.css"
import React, {useState, useRef, useEffect, MutableRefObject} from 'react'
import Modal from "react-overlays/Modal";
import cx from "classnames"
import { useSelectAuthProvider } from "../hooks/AuthProvider";
import {fetchUsersAsync} from '../../features/authentication/authenticationSlice';
import {useAppDispatch}  from '../hooks'

type AuthenticationProps = {
    changeUser: (username: string) => void
}

//The modal that will appear to prompt and enable users to login/signup
export default function Authentication({changeUser}: AuthenticationProps) {
    const dispatch = useAppDispatch();
    const {toggleModal, modalToggle, authType, toggleUsername} = useSelectAuthProvider();
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [showModal, setShowModal] = useState<boolean>(modalToggle);
    const username = useRef<string>("");
    const password = useRef<string>("");
    const email = useRef<string>("");
    const [usernameState, setUsernameState] = useState<string>("");
    const [passwordState, setPasswordState] = useState<string>("");
    const [EmailState, setEmailState] = useState<string>("");
    const [usernameEntered, setUsernameEntered] = useState<string>("");
    const [passwordEntered, setPasswordEntered] = useState<string>("");
    const [EmailEntered, setEmailEntered] = useState<string>("");
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [signupBtn, setSignupBtn] = useState<string>("Sign Up");
    const [loginBtn, setLoginBtn] = useState<string>("Login");

    type handleSignUpProps = {
        event: any
        username: MutableRefObject<string>
        email: MutableRefObject<string>
        password: MutableRefObject<string>
    }
    
    type handleSignInProps = {
        event: any
        username: MutableRefObject<string>
        password: MutableRefObject<string>
    }


    function handleSignUp({event, username, email, password}: handleSignUpProps) {
        event.preventDefault();
        const API_URL = "https://mq-sspr.onrender.com";
        setLoadingButton(true);
        setSignupBtn("Loading...");
        fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    username: username.current.trim(),
                    email: email.current.trim(),
                    password: password.current.trim()
                })
            })
            .then((response) => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error);
                    setLoadingButton(false);
                    setSignupBtn("Sign Up")
                } else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", data.user.id);
                    localStorage.setItem("username", data.username);
                    toggleUsername(data.user.username);
                    changeUser(data.user.username);
                    toggleModal("Close");
                    window.location.reload();
                }

            })
            .catch((error) => {
                setErrorMessage("An error has occurred. Please retry.")
            })
    }

    function handleSignIn({event, username, password}: handleSignInProps) {
        event.preventDefault();
        const API_URL = "https://mq-sspr.onrender.com";
        setLoadingButton(true);
        setLoginBtn("Loading...");
        fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    username: username.current.trim(),
                    password: password.current.trim()
                })
            })
            .then((response) => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error);
                    setLoadingButton(false);
                    setLoginBtn("Login");
                } else {
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("user_id", data.user.id)
                    localStorage.setItem("username", data.username);
                    toggleUsername(data.user.username);
                    changeUser(data.user.username);
                    toggleModal("Close");
                    window.location.reload();
                }

            })
            .catch((error) => {
                setErrorMessage("An error has occurred. Please retry.")
            })

    }

    function handleEmail(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        email.current = target.value;
        setEmailState(email.current);
        if(email.current !== "") {
            setEmailEntered("Authentication_input filled");
        } else {
            setEmailEntered("");       
        }


    }

    function handlePassword(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        password.current = target.value;
        setPasswordState(password.current);
        if(password.current !== "") {
            setPasswordEntered("Authentication_input filled");
        } else {
            setPasswordEntered("");        
        }


    }

    function handleUsername(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        username.current = target.value;
        setUsernameState(username.current);
        if(username.current !== "") {
            setUsernameEntered("Authentication_input filled");
        } else {
            setUsernameEntered("");        
        }


    }

    function resetInput() {
        password.current = "";
        email.current = "";
        username.current = "";
        setEmailState(email.current);
        setPasswordState(password.current);
        setUsernameState(username.current);
        setEmailEntered("");
        setPasswordEntered("");
        setUsernameEntered("");

        }

        useEffect(() => {
            setShowModal(modalToggle);
            setErrorMessage("");
            dispatch(fetchUsersAsync());
        }, [modalToggle, authType, passwordState, EmailState, usernameState, dispatch])

    return (
    <>
    {showModal && (
    <div className="modal_container">
        <Modal className="Authentication_main_container"
        show={showModal}>
            {(authType === "SignUp") ? 
            (<form className="Authentication_form">
                <div className="Authentication_header">
                    <h1>SignUp</h1>
                    <h4>Join us for free now!</h4>
                    <img src="/NavBarMEnuPics/CloseIcon.png"
                    onClick={() => toggleModal("Close")}/>
                </div>
                <div className="Authentication_input_container">
                    <h3 className="Authentication_error">{errorMessage}</h3>
                    <div className={cx("Authentication_input", usernameEntered)}>
                        <input value={usernameState} onChange={(event) => handleUsername(event)}/>
                        <text>Username</text>
                    </div>
                    <div className={cx("Authentication_input", EmailEntered)}>
                        <input value={EmailState} onChange={(event) => handleEmail(event)}/>
                        <text>Email</text>
                    </div>
                    <div className={cx("Authentication_input", passwordEntered)}>
                        <input id="password" value={passwordState} onChange={(event) => handlePassword(event)}/>
                        <text>Password</text>
                    </div>
                    
                </div>
                <button 
                disabled={loadingButton}
                className="Authentication_main_container_button"
                onClick={(event) => {handleSignUp({event, username, email, password})}}>
                    {signupBtn}
                </button>
                <div className="Authentication_switch">
                    <text>Already got an account?</text>
                    <p onClick={() => {resetInput(); toggleModal("Close"); toggleModal("Login")}}>Login</p>
                </div>
                </form>
                )
            :
            (<form className="Authentication_form">
                <div className="Authentication_header">
                    <h1>Login</h1>
                    <h3>Login and start posting now!</h3>
                    <img src="/NavBarMEnuPics/CloseIcon.png"
                    onClick={() => toggleModal("Close")}/>
                </div>
                <div className="Authentication_input_container">
                    <h3 className="Authentication_error">{errorMessage}</h3>
                    <div className={cx("Authentication_input", usernameEntered)}>
                        <input value={usernameState} onChange={(event) => handleUsername(event)}/>
                        <text>Username</text>
                    </div>
                    <div className={cx("Authentication_input", passwordEntered)}>
                        <input id="password" value={passwordState} onChange={(event) => handlePassword(event)}/>
                        <text>Password</text>
                    </div>
                </div>
                <button
                disabled={loadingButton}
                className="Authentication_main_container_button"
                onClick={(event) => handleSignIn({event, username, password})}>
                    {loginBtn}
                </button>
                <div className="Authentication_switch">
                    <text>Not an existing user?</text>
                    <p onClick={() => {resetInput(); toggleModal("Close"); toggleModal("SignUp")}}>Sign Up</p>
                </div>
            </form>)
            }      
        </Modal>
    </div>
    )}
    </>
    )
}
