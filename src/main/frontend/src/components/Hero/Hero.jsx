// Mebaselassie Kidane Kebede, mebkeb-0

// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CiViewList } from "react-icons/ci";
// import HouseList from "./HouseList.jsx";

// Function that defines the body section, including HouseList fetched from an API & database.
const Hero = () => {

   // const [houses] = useState([]);

    return (
        <section className ="hero-wrapper">
            <div className="paddings innerWidth flexCenter2 hero-container">
                <h1 className = "primaryText">VÄLKOMMEN TILL HUS INDEX</h1>
            </div>

            <div className="paddings innerWidth flexCenter2 hero-container">
                <p> Vi hjälper dig lyckas med ditt livs största affär. </p>
                <p> Vi erbjuder listor över fastigheter i Seattle, USA och en guide för
                    att hjälpa dig fatta välgrundade beslut vid husköp. </p>
            </div>

            <div className="paddings innerWidth flexCenter2 hero-container">
                <h2 className = "primaryText">Vad är du intresserad av?</h2>
            </div>

            <div className = "flexCenter2 contactModes hero">
                <div className="flexColStart row">
                    <div className ="flexColCenter mode">
                        <div className = "flexStart">
                            <div className = "flexCenter icon">
                                <FaArrowTrendUp  size={25}/>
                            </div>
                            <div className = "flexColStart detail">
                                <h1 className="primaryText">Gå med i Live budgivning</h1>
                            </div>
                        </div>
                        <div className="flexCenter button">
                            {/*<a href="klicka: anlysera">Klicka här</a>*/}
                            <Link to="/MarketAnalysis" >Klicka här</Link>
                        </div>
                    </div>
                </div>

                <div className ="flexColStart row">
                    <div className ="flexColCenter mode">
                        <div className = "flexStart">
                            <div className = "flexCenter icon">
                                <FaMoneyBillTrendUp size={25}/>
                            </div>
                            <div className = "flexColStart detail">
                                <span className="primaryText">Analysera huspriser</span>
                            </div>
                        </div>
                        <div className="flexCenter button">
                           {/* <a href="klicka: anlysera">Klicka här</a>*/}
                            <Link to="/PriceAnalysis">Klicka här</Link>
                        </div>
                    </div>
                </div>

                <div className ="flexColStart row">
                    <div className ="flexColCenter mode">
                        <div className = "flexStart">
                            <div className = "flexCenter icon">
                                <CiViewList size={25}/>
                            </div>
                            <div className = "flexColStart detail">
                                <span className="primaryText">Lista av alla fastigheter</span>
                            </div>
                        </div>
                        <div className="flexCenter button">
                           {/* <a href="klicka här: fastigheterlistor ">Klicka här</a>*/}
                            {/* <a onClick={handleViewAllHouses}>Klicka här</a>*/}

                            <Link to="/HouseList">Klicka här</Link>
                        </div>
                    </div>
                </div>
               {/* <HouseList houses={houses} /> */}
            </div>
        </section>
    )
}

export default Hero;