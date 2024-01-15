// Importa i componenti e le risorse necessarie.
import Footer from "../Components/Footer/Footer"
import Home from "../Components/Home/Home"
import video from "../Assets/video1.mp4"
import AboutUs from "../Components/AboutUs/AboutUs"

function About() {
    return (
        // Il componente "About" renderizza tre componenti figli: "Home", "AboutUs", e "Footer".
        <>
            {/* Componente "Home" */}
            <Home
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="Come and Meet us"        // Titolo da visualizzare nel componente "Home".
                subTitle="WHO WE ARE?"          // Sottotitolo da visualizzare nel componente "Home".
            />
            
            {/* Componente "AboutUs" */}
            <AboutUs/>

            {/* Componente "Footer" */}
            <Footer/>
        </>
    )
}

export default About
