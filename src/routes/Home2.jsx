// Importa i componenti e le risorse necessarie.
import Home from "../Components/Home/Home"
import Footer from "../Components/Footer/Footer"
import video from "../Assets/video5.mp4"
import Destination from "../Components/Destination/Destination"

function Home2() {
    return (
        // Il componente "Home2" renderizza tre componenti figli: "Home", "Destination", e "Footer".
        <>
            {/* Componente "Home" */}
            <Home 
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="Take a tour with us"    // Titolo da visualizzare nel componente "Home".
                subTitle="Our best trips"       // Sottotitolo da visualizzare nel componente "Home".
            />
            
            {/* Componente "Destination" */}
            <Destination/>

            {/* Componente "Footer" */}
            <Footer />
        </>
    )
}

export default Home2
