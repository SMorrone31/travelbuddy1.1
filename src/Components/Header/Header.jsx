import React, {useState } from 'react'
import Modal from 'react-modal'
import './header.css'
import { BiRestaurant } from 'react-icons/bi'
import { BiMapAlt, BiHotel, BiSearchAlt } from 'react-icons/bi'
import { Autocomplete } from '@react-google-maps/api'

// Impostazione dell'elemento radice dell'applicazione per il componente Modal
Modal.setAppElement('#root');

const Header = ({ setType, setCoordinates }) => {
    const [autocomplete, setAutocomplete] = useState(null);

    // Funzione per caricare l'elemento Autocomplete
    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            setCoordinates({
                // Imposta la latitudine e longitudine del luogo selezionato
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
        }
    }

    return (
        <div className="header1">
            <div className='headerFlex' >
                <div className="headerAutocomplete">
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <div className='autocomplete'>
                            <input
                                type='text'
                                placeholder='Search on Google Map...'
                                className='custom-input'
                            />
                            <div className="search-icon">
                                <BiSearchAlt color='gray' fontSize={15} />
                            </div>
                        </div>
                    </Autocomplete>
                </div>



                <div className='buttonContainer'>
                    <button className="buttonRatings" onClick={() => setType("restaurants")}><BiRestaurant style={{ color: "black", padding: '1px', fontSize: '14px', justifyContent: 'space-around' }} />Restaurants</button>
                    <button className="buttonRatings" onClick={() => setType("attractions")}><BiMapAlt style={{ color: "black", padding: '1px', fontSize: '14px', justifyContent: 'space-around' }} />Attractions</button>
                    <button className="buttonRatings" onClick={() => setType("hotels")}><BiHotel style={{ color: "black", padding: '1px', fontSize: '14px', justifyContent: 'space-around' }} />Hotels</button>
                </div>


            </div >

        </div >)
}

export default Header