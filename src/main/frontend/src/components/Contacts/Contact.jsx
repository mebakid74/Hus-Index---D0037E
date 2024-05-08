// Mebaselassie Kidane Kebede, mebkeb-0

import React from 'react'
import './Contact.css'
import {MdCall} from 'react-icons/md'
import {BsFillChatDotsFill} from 'react-icons/bs'
import {HiChatBubbleBottomCenter} from 'react-icons/hi2'
import { IoMdInformationCircleOutline } from "react-icons/io"

// Function that renders contact information with icons for different modes.

const Contact = () => {
    return (
        <section className = "c-wrapper">
            <div className = "paddings innerWidth flexCenter c-container">
                <div className = "flexColStart c-left">
                    <span className = "orangeText">Kontakt oss</span>
                    <span className = "primaryText">Vi är alltid redo att hjälpa dig genom att ge dig
                        den bästa tjänsten.</span>

                    <div className = "flexStart contactModes">
                        <div className="flexColStart row">
                        <div className ="flexColCenter mode">
                                <div className = "flexStart">
                                    <div className = "flexCenter icon">
                                        <IoMdInformationCircleOutline size={25}/>
                                    </div>
                                    <div className = "flexColStart detail">
                                        <span className="primaryText">Mer information</span>
                                        <span>Erbjudande broschyr</span>
                                    </div>
                                </div>
                                <div className="flexCenter button">
                                    <a href="ladda ned: broschyr">Ladda ned</a></div>
                            </div>
                        </div>
                        <div className="flexColStart row">
                            <div className ="flexColCenter mode">
                                <div className = "flexStart">
                                    <div className = "flexCenter icon">
                                        <BsFillChatDotsFill size={25}/>
                                    </div>

                                    <div className = "flexColStart detail">
                                        <span className="primaryText">Online kundtjänst</span>
                                        <span>olinebot</span>
                                    </div>
                                </div>
                                <div className="flexCenter button">
                                    <a href="chatta: onlinebot">Chatta</a></div>
                            </div>
                        </div>
                        <div className="flexColStart row">
                            <div className ="flexColCenter mode">
                                <div className = "flexStart">
                                    <div className = "flexCenter icon">
                                        <HiChatBubbleBottomCenter size={25}/>
                                    </div>

                                    <div className = "flexColStart detail">
                                        <span className="primaryText">E-postadress</span>
                                        <span>husindex@gmail.com</span>
                                    </div>
                                </div>
                                <div className="flexCenter button">
                                    <a href="mejla: husindex@gmail.com">Mejla</a></div>
                            </div>
                        </div>
                        <div className ="flexColStart row">
                            <div className ="flexColCenter mode">
                                <div className = "flexStart">
                                    <div className = "flexCenter icon">
                                        <MdCall size={25}/>
                                    </div>
                                    <div className = "flexColStart detail">
                                        <span className="primaryText">Telefon</span>
                                        <span>0712 120 120</span>
                                    </div>
                                </div>
                                <div className="flexCenter button">
                                    <a href="ring: 0712 120 120">Ring oss</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact;