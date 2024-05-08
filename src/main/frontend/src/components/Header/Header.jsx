// Mebaselassie Kidane Kebede, mebkeb-0

import React, {useEffect} from 'react'
import './Header.css';
import Axios from 'axios'
import { useState } from 'react';
import Register from "../Account/Register.jsx";

// Function that defines the header section utilizing states hooks and Axios to handle request from server.
const Header = () => {

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value);
    };

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    };

    const handleSignupEmailChange = (e) => {
        setSignupEmail(e.target.value);
    };

    const handleSignupPasswordChange = (e) => {
        setSignupPassword(e.target.value);
    };

    const [buttonPopup, setButtonPopup] = useState(false);

    const [LoginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true;
    const reg = () => {
        Axios.post('http://localhost:8081/register', {
            email: signupEmail,
            password: signupPassword,
        }).then((response) => {
            console.log(response);
        });
    };

    const log = () => {
        Axios.post('http://localhost:8081/login', {
            email: loginEmail,
            password: loginPassword,
        }).then((response) => {
            console.log(response);
        });
    };

    useEffect(() => {
        Axios.get("http://localhost:5173/login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoginStatus(response.data.user[0].email);
            }
        });
    }, [])

    return (
        <section className = "h-wrapper">
            <div className = "flexCenter hero-wrapper">

                <div className="logo-container">
                    <img src="./logo.jpg" alt="logo" width="100" />
                    <span className="primaryText logo-text">Hus Index</span>
                </div>

                <div className="flexCenter h-menu paddings header">

                    <a className="button" href="">Hem</a>

                    <a className="button" href="">Om oss</a>

                    <a className="button" href="">Kontakt</a>

                    <button className="button" onClick={() =>
                        setButtonPopup(true)}> Konto
                    </button>

                </div>

                <div className = "kontoinfo">
                <Register trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                    <h2 className="primaryText flexCenter innerWidth h-container">
                        Logga in
                    </h2>
                    <form className="form hero-wrapper">
                        <div className="form-group">
                            <label className=" secondaryText flexCenter innerWidth h-container">
                                Användarnamn:
                            </label>
                            <input type="email" id="login-email" value={loginEmail}
                                   onChange={handleLoginEmailChange} required />
                        </div>

                        <div className="form-group flexColStart row">
                            <label className="secondaryText flexCenter innerWidth h-container">
                                Lösenord:
                            </label>
                            <input type="password" id="login-password" value={loginPassword}
                                   onChange={handleLoginPasswordChange} required />
                        </div>

                        <div>
                            <button type="submit" onClick={log}>Logga in</button>
                        </div>
                    </form>
                </Register>

                <Register trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                    <h3 className="primaryText flexCenter innerWidth h-container">
                        Skapa konto
                    </h3>

                    <form className="form">
                        <div className="form-group">
                            <label className=" secondaryText flexCenter innerWidth h-container">
                                Användarnamn:
                            </label>
                            <input type="email" id="signup-email" value={signupEmail}
                                   onChange={handleSignupEmailChange} required />
                        </div>

                        <div className="form-group flexColStart row">
                            <label className="secondaryText flexCenter innerWidth h-container">
                                Lösenord:
                            </label>
                            <input type="password" id="signup-password" value={signupPassword}
                                   onChange={handleSignupPasswordChange} required />
                        </div>

                        <div>
                            <button type="submit" onClick={reg}> Skapa konto</button>
                        </div>
                    </form>
                </Register>
                </div>
            </div>
        </section>
    )
}

export default Header;
