import React, { useState } from 'react';
import './placeDetails.css';
import Rating from 'react-rating-stars-component';
import { FaLocationDot } from 'react-icons/fa6';

const PlaceDetails = ({ place }) => {
    // Inizializzazione dello stato 'rating' con il valore iniziale 0
    const [rating, setRating] = useState(0);

    // Funzione per gestire il cambiamento del valore di 'rating'
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    // Funzione per aprire il sito web del luogo, se disponibile
    const openWebsite = () => {
        if (place.web_url) {
            window.open(place.web_url, '_blank');
        } else {
            alert('Sito web non disponibile');
        }
    }

    // Se non è presente un luogo, restituisci null
    if (!place) {
        return null;
    }

    // Estrazione delle informazioni dal luogo
    const { name, price, rating: placeRating, num_reviews, price_level, ranking, open_now_text, dietary_restrictions, address, photo } = place;

    // Inizializzazione della classe di testo in base allo stato 'open_now_text'
    let textColorClass = 'open-now-text-yellow';

    if (open_now_text === 'Open Now') {
        textColorClass = 'open-now-text-green';
    } else if (open_now_text === 'Closed Now') {
        textColorClass = 'open-now-text-red';
    }


    return (
        <div className='placeDetails'>
            <div className="imageContainer">
                {photo && photo.images.large && (
                    <img
                        src={photo.images.large.url}
                        className='image'
                        alt='Place Image'
                    />
                )}
            </div>

            <div className='singleCard'>
                <div className='card'>
                    <p className='name' onClick={openWebsite}>{name}</p>
                    {price && <p className='price'>{price}</p>}
                    {placeRating && (
                        <div className='rating'>
                            <Rating
                                count={5}
                                value={Number(placeRating)}
                                onChange={handleRatingChange}
                                size={11}
                                activeColor='#ffd700'
                                inactiveColor='#ccc'
                                edit={false}
                            />
                            <p className='reviews'>{`(${num_reviews})`}</p>
                            {price_level && <p className='price-level'>{price_level}</p>}
                        </div>
                    )}
                    {ranking && <p className="ranking">{ranking}</p>}
                    {open_now_text && (
                        <p className={`open-now-text ${textColorClass}`}>
                            {open_now_text}
                        </p>
                    )}

                    {dietary_restrictions && (
                        <div className="dietary">
                            {dietary_restrictions.map((restriction, i) => (
                                restriction.name && <div className="dietaryNames" key={i}>{restriction.name}</div>
                            ))}
                        </div>
                    )}

                    {address && (
                        <div className="location">
                            <FaLocationDot className='iconLocation' />
                            <div className="text">{address}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaceDetails;
