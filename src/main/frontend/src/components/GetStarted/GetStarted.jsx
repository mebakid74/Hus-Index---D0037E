// Mebaselassie Kidane Kebede, mebkeb-0

import React from 'react'
import './GetStarted.css'

// Function that defines a call-to-action section for subscription service.
const GetStarted = () => {
    return (
        <section className="g-wrapper">
            <div className="paddings innerWidth g-container">
                <div className="flexColCenter inner-container">
                    <span className="primaryText">Komma igång med Hus Index</span>
                    <span className="secondaryText">Prenumerera på vårt veckobrev och hitta superattraktiva
                        prisofferter från oss.
                    <br />
                        Helt gratis!
                    </span>
                    <button className="button">
                        <a href="mejla: husindex@gmail.com">Fortsätta</a>
                    </button>
                </div>
            </div>
        </section>

    )
}

export default GetStarted;