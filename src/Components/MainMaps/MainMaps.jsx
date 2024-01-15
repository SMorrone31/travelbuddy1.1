import React, { useEffect, useState } from "react";
import Header from "../Header/Header"
import List from "../List/List"
import Map from "../Map/Map"
import './mainMaps.css'
import { getPlacesData } from "../../api"
import Footer from "../Footer/Footer"

const MainMaps = () => {

    const [places, setPlaces] = useState([])
    const [coordinates, setCoordinates] = useState({})
    const [filterRatingPlaces, setFilterRatingPlaces] = useState([]);
    const [type, setType] = useState('restaurants')
    const [ratings, setRatings] = useState("")
    const [isLoading, setisLoading] = useState(true)
    const [bounds, setBounds] = useState(null)
    // stato per la connessione online
    const [isOnline, setIsOnline] = useState(navigator.onLine)


    //--------------------------------------------------------------------------------------------------------------------------------------------//

    //viene eseguito quando il componente iin cui è defiito viene montato. Monitora lo stato della connessione
    useEffect(() => {
        const handleStatusChange = () => setIsOnline(navigator.onLine);
        // Aggiungi event listener per online e offline
        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        // Rimuovi gli event listener quando il componente si smonta
        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    // Questo useEffect viene eseguito una volta quando il componente viene montato
    useEffect(() => {
        // navigator.geolocation.getCurrentPosition() viene utilizzato per ottenere le coordinate geografiche dell'utente
        // La funzione di callback riceve un oggetto che contiene le coordinate
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            // Le coordinate vengono memorizzate nello stato 'coordinates' utilizzando setCoordinates
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);


    // Questo useEffect viene eseguito ogni volta che il valore di 'ratings' cambia
    useEffect(() => {
        // Viene eseguita una filtraggio degli elementi nell'array 'places' in base al rating
        const filterRatingData = places.filter((place) => place.rating > ratings);

        // I risultati filtrati vengono memorizzati nello stato 'filterRatingPlaces'
        setFilterRatingPlaces(filterRatingData);
    }, [ratings]);
        
    // Questo useEffect viene eseguito quando i valori di 'type', 'coordinates' o 'bounds' cambiano
    useEffect(() => {
        // Imposta isLoading a true per indicare che il caricamento dei dati è in corso
        setisLoading(true);

        // Richiama la funzione 'getPlacesData' per ottenere i dati dei luoghi in base a 'type', 'bounds' e 'coordinates'
        getPlacesData(type, bounds?.sw, bounds?.ne).then((data) => {
            // Imposta gli elementi ottenuti come nuovo stato 'places'
            setPlaces(data);

            // Imposta isLoading a false per indicare che il caricamento dei dati è completato
            setisLoading(false);
        });
    }, [type, coordinates, bounds]);


    return (
        <div className="mainMap">
            {!isOnline && (
                <div className="offline-message">
                    Error, no internet connection. Connect to use Google Maps services.
                </div>
            )}
            <Header
                setType={setType}
                setRatings={setRatings}
                setCoordinates={setCoordinates}
            />
            <List places={filterRatingPlaces.length ? filterRatingPlaces : places}
                isLoading={isLoading} />
            <Map
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                setBounds={setBounds}
                places={filterRatingPlaces.length ? filterRatingPlaces : places}
            />
            <Footer />
        </div>

    )
}

export default MainMaps