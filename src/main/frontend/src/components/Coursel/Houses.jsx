// Mebaselassie Kidane Kebede, mebkeb-0

import React from 'react'
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react'
import { useState } from 'react';
import "swiper/css"
import './Houses.css'
import data from '../../utils/slider.json'
import {sliderSettings} from "../../utils/common.js";

// Function that displays the list of properties with filtering options for search and price using JSON-file.
const Houses = () => {

    const [searchQuery, setSearchQuery] = useState('');
   // const [categoryFilter, setCategoryFilter] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const convertPriceToNumber = (priceString) => {
        return parseFloat(priceString.replace(/,/g, ''));
    };

    const filteredData = data.filter(property => {
        const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesPrice = true;
        if (priceFilter !== 'All') {
            const propertyPrice = convertPriceToNumber(property.price);
            if (priceFilter === '500000') {
                matchesPrice = propertyPrice <= 500000;
            } else if (priceFilter === '1000000') {
                matchesPrice = propertyPrice > 500000 && propertyPrice <= 1000000;
            } else if (priceFilter === '1000000_greater') {
                matchesPrice = propertyPrice > 1000000;
            }
        }
        return matchesSearch && matchesPrice;
    });

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const SliderButtons = () => {
        const swiper = useSwiper();
        return (
            <div className = "flexCenter r-buttons">
                <button onClick={() => swiper.slidePrev()}>&lt;</button>
                <button onClick={() => swiper.slideNext()}>&gt;</button>
            </div>
        )
    }

    return (
        <section className = "r-wrapper">
            <div className = "paddings innerWidth r-container">
                <div className = "r-head flexColStart">
                    <span className = "orangeText">Mest utvalda</span>
                    <span className = "primaryText">Populära fastigheter</span>
                </div>

                <div className = "filter flexCenter r-head">

                <input
                    type="text"
                    placeholder="Sök fastigheter..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                </div>

                <div className = "filter flexCenter r-head">

                <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                    <option value="All">Alla priser</option>
                    <option value="500000">$500,000 eller mindre</option>
                    <option value="1000000">$1,000,000 eller mindre</option>
                    <option value="1000000_greater">$1,000,000 eller större</option>
                </select>
                </div>

                <Swiper {...sliderSettings}>
                    <SliderButtons />
                    {filteredData.map((property, index) => (
                        <SwiperSlide key={index}>
                            <div className="flexColStart r-card">
                                <img src={property.image} alt={property.name} />

                                <span className="secondaryText r-price">
                                    <span style = {{color: "orange"}}>$</span>
                                    {property.price}
                                </span>

                                <span className="primaryText">{property.name}</span>
                                <span className="secondaryText">{property.detail}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </section>
    )
}
export default Houses;

