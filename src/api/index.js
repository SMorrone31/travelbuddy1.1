// funzione che recuperare dati dalle API "travel-advisor.p.rapidapi.com". Accetta i parametri per l'area geografica

export const getPlacesData = async (type, sw, ne) => {
    // controllo dei parametri sw e ne sono definiti e contengono le proprietà lat e lng
    if (!sw || !ne || !sw.lat || !sw.lng || !ne.lat || !ne.lng) {
        console.error("Coordinate non valide");
        return null;
    }

    try {
        // richiesta HTTP GET asincrona all'URL
        const response = await fetch(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary?bl_latitude=${sw.lat}&tr_latitude=${ne.lat}&bl_longitude=${sw.lng}&tr_longitude=${ne.lng}`, {
            method: 'GET',
            // contiene le chiavi necessarie per autenticaare la richiesta con l'API di Travel Advisor
            headers: {
                'X-RapidAPI-Key': '776de9660bmsh761deb6661a5b3ap1fda1ajsn32df06be91b4',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            },
        });

        // consersione della risposta (stringa) in json
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Fetch data Error: ", error);
        if (error.name === 'TypeError') {
            console.log("Errore nel caricamento dei dati di google maps")
        }
        console.log("Ops. An error occured a google maps api")
    }
}






