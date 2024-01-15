// Importa i componenti e le risorse necessarie.
import Home from "../Components/Home/Home"
import video from "../Assets/video2.mp4"
import MainMaps from "../Components/MainMaps/MainMaps"
import React from "react"

function Packages() {
    return (
        // Il componente "Packages" renderizza due componenti figli: "Home" e "MainMaps".
        <>
            {/* Componente "Home" */}
            <Home
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="Find your place"         // Titolo da visualizzare nel componente "Home".
                subTitle="INFORMATION"          // Sottotitolo da visualizzare nel componente "Home".
            />

            {/* Componente "MainMaps" */}
            <MainMaps />
        </>
    )
}

export default Packages
