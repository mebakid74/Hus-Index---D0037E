// Mebaselassie Kidane Kebede, mebkeb-0
import { Link } from 'react-router-dom';
import React, {useEffect} from 'react'
import './Header.css';
import Axios from 'axios'
import { useState } from 'react';
import Register from "../Account/Register.jsx";

// Function that defines the header section utilizing states hooks and Axios to handle request from server.
const Header = () => {

    const [loginUser, setLoginUser] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPopup, setAdminPopup] = useState(false);

    const handleLoginUserChange = (e) => {
        setLoginUser(e.target.value);
    };

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    };

    const adminLogin = () => {
        const predefinedAdmin = {
            username: 'admin',
            password: 'pass'
        };
        if (loginUser === predefinedAdmin.username && loginPassword === predefinedAdmin.password) {
            setIsAdmin(true);
            setAdminPopup(false);
        } else {
            alert('Ogiltiga administratörsuppgifter');
        }
    };

    const AdminPanel = () => {
        const [bids, setBids] = useState([]);

        useEffect(() => {
            // Fetch bid history from server
            const fetchBids = async () => {
                try {
                    const response = await Axios.get('http://localhost:3000/admin/bids');
                    setBids(response.data);
                } catch (error) {
                    console.error('Error fetching bids:', error);
                }
            };
            fetchBids();
        }, []);

    return (
        <div>
            <h2>Bid History</h2>
            <pre>{JSON.stringify(bids, null, 2)}</pre>
        </div>
    );
};

    return (
        <section className = "h-wrapper">
            <div className = "flexCenter hero-wrapper">

                <div className="logo-container">
                    <img src="./logo.jpg" alt="logo" width="100" />
                    <span className="primaryText logo-text">Hus Index</span>
                </div>

                <div className="flexCenter h-menu paddings header">

                    <Link to="/" className="button">Hem</Link>

                    <a className="button" href="">Om oss</a>

                    <a className="button" href="">Kontakt</a>

                    <button className="button" onClick={() => setAdminPopup(true)}>Konto</button>

                </div>

                <div className = "kontoinfo">
                <Register trigger={adminPopup} setTrigger={setAdminPopup}>
                <h2 className="primaryText flexCenter innerWidth h-container">Logga in</h2>
                <form className="form hero-wrapper">
                    <div className="form-group">
                        <label className=" secondaryText flexCenter innerWidth h-container"> Användarnamn: </label>
                        <input type="email" id="admin-email" value={loginUser} onChange={handleLoginUserChange} required />
                    </div>
                    <div className="form-group flexColStart row">
                        <label className="secondaryText flexCenter innerWidth h-container">Lösenord:</label>
                        <input type="password" id="admin-password" value={loginPassword} onChange={handleLoginPasswordChange} required />
                    </div>
                    <div>
                        <button className="button" type="button" onClick={adminLogin}>Logga in</button>
                    </div>
                </form>
                </Register>
                </div>
            </div>
            {isAdmin && <AdminPanel />}
        </section>
    )
}



export default Header;
