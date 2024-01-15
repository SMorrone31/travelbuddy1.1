import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { GiPositionMarker } from 'react-icons/gi'
import { AiFillCloseCircle } from 'react-icons/ai'
import './map.css'

const Map = ({ coordinates, setCoordinates, setBounds, places }) => {
    const [isCard, setisCard] = useState(false);
    const [cardData, setcardData] = useState(null);

   /**
     * Funzione per aprire il sito web associato alla card recuperato dalle API di travelAdvisor
     * Apre il sito web in una nuova finestra (_blank) se è disponibile,
     * altrimenti mostra un avviso.
    */
   const openWebsite = () => {
    if (cardData.web_url) {
        window.open(cardData.web_url, '_blank');
    } else {
        alert('Sito web non disponibile');
    }
};


    return (
        <div className='map'>
            <div className='map-container'>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB7rSPWB2wtr0byWtsPxnHYgArhZqCbhjw' }}
                    defaultCenter={coordinates}
                    center={coordinates}
                    margin={[50, 50, 50, 50]}
                    options={""}
                    onChange={(e) => {
                        setCoordinates({ lat: e.center.lat, lng: e.center.lng })
                        setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw })
                    }}
                    defaultZoom={10}
                    onChildClick={(child) => {
                        setcardData(places[child])
                        setisCard(true)
                    }}
                >
                    {places?.map((place, i) => (
                        place.latitude && place.longitude && (
                            <div className='position' lat={place.latitude} lng={place.longitude} key={i}>
                                <GiPositionMarker style={{ color: 'red', fontSize: '30px' }} />
                            </div>
                        )
                    ))}

                    {
                        isCard && (
                            <div className='card' lat={cardData.latitude} lng={cardData.longitude}>
                                <img
                                    src={
                                        cardData?.photo
                                            ? cardData?.photo?.images?.large?.url
                                            : 'https://media-cdn.tripadvisor.com/media/photo-p/27/36/20/bf/tartare.jpg'
                                    }
                                    className='image'
                                    onClick={openWebsite}
                                />
                                <p className='name'>{cardData.name}</p>
                                <AiFillCloseCircle className="close" onClick={() => { setisCard(false) }} />
                            </div>
                        )
                    }
                </GoogleMapReact>
            </div>

        </div>
    );
}

export default Map