// Mebaselassie Kidane Kebede, mebkeb-0

import React, { useState, useEffect } from 'react';
import './HouseList.css'

// Function that displays the list of houses fetched from the API endpoint, utilizes search query and sorting.
const HouseList = () => {

    const [houses, setHouses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    //const [sortBy, setSortBy] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder] = useState('asc');

    useEffect(() => {
        fetch('http://localhost:8081/lista_av_alla_fastighter')
            .then(response => response.json())
            .then(data => {
                setHouses(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching houses:', error));
    }, []);

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    //let sortedHouses = [...houses];
    let sortedHouses = Array.isArray(houses) ? [...houses] : [];

    if (sortBy === 'NewConstruction') {
        sortedHouses.sort((a, b) => {
            if (sortOrder === 'asc') {
                return b.NewConstruction.localeCompare(a.NewConstruction);
            } else {
                return a.NewConstruction.localeCompare(b.NewConstruction);
            }
        });
    } else if (sortBy) {
        sortedHouses.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] - b[sortBy];
            } else {
                return b[sortBy] - a[sortBy];
            }
        });
    }

    const filteredHouses = sortedHouses.filter(house => {
        return house.PropertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            house.ZipCode.includes(searchQuery);
        {/* house.NewConstruction.toLowerCase().includes(searchQuery.toLowerCase());*/}
    });

    return (
        <section className ="hero-wrapper">

        <div className="innerWidth flexCenter2 paddings hero-container">
                <h1 className = "primaryText r-head">Lista av alla fastigheter</h1>

            <div className="paddings innerWidth r-container">

                <div className = "filter flexCenter r-head">
                    <input
                        type="text"
                        placeholder="Sök fastighter..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className = "filter flexCenter r-head">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Återställ</option>
                        <option value="SalePrice">Pris (Lågt - Högt)</option>
                        <option value="ZipCode">Postnummer (Stigande ordning)</option>
                        <option value="Bathrooms">Badrum (Min - Max)</option>
                        <option value="Bedrooms">Sovrum (Min - Max)</option>
                        <option value="NewConstruction">Nybygg (Sant - Falskt)</option>
                    </select>
                </div>
            </div>

            <div className="houses-container">
                <table>
                    <thead className="table">
                    <tr>
                        {/*<th>Beskrivning</th>*/}
                        <th>Fastigheter ID</th>
                        <th>Fastigheter namn</th>
                        <th>Fastigheter typ</th>
                        <th>Badrum</th>
                        <th>Sovrum</th>
                        <th>Försäljningspris</th>
                        <th>Postnummer</th>
                        <th>Nybyggd</th>
                        <th>Bild</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredHouses.map((house, index) => (
                        <tr className = "secondaryText" key={index}>
                            <td>{house.PropertyID}</td>
                            {/* <td>{house.PropertyName}</td> */}
                            <td>{house.PropertyType}</td>
                            <td>{house.Bathrooms}</td>
                            <td>{house.Bedrooms}</td>
                            <td> $ {house.SalePrice}</td>
                            <td>{house.ZipCode}</td>
                            <td>{house.NewConstruction}</td>
                            <td>
                                <img src={`/${house.Img}`} alt={house.Img} />
                                {/* <img src={house.images} alt="House" /> */}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </section>
    );
};
export default HouseList;
