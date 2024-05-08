// Mebaselassie Kidane Kebede, mebkeb-0

import React from 'react'
import './Footer.css'

// Function that defines the footer section.
const Footer = () => {
    return (
        <section className="f-wrapper">
            <div className="paddings innerWidth flexCenter f-container">
                <div className="flexColStart f-left">
                    <div className="image-footer">
                        <img src="./logo.jpg" alt="" width={120} />
                    </div>

                    <span>
                        Vår vision är att göra det enklare för dig <br />
                        att hitta bästa fastigheter att bo på.
                    </span>
                </div>

                <div className="flexColStart f-right">
                    <span className="primaryText">Adress</span>
                    <span className="secondaryText">85 111 Seattle, road 5, USA</span>

                    <div className="flexCenter f-menu">
                        <span>Fastigheter</span>
                        <span>Tjänster</span>
                        <span>Om oss</span>
                    </div>
                </div>
            </div>

            <div className="flexColCenter footer-container">
                <footer>
                        <p>&copy; 2024 Hus Index. Alla rättigheter förbehållna.</p>
                </footer>
            </div>

        </section>
    )
}

export default Footer;