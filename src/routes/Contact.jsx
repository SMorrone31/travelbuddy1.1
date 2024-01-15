// Importa i componenti e le risorse necessarie.
import Home from "../Components/Home/Home"
import video from "../Assets/video9.mp4"
import ContactUs from "../Components/ContactUs/ContactUs"
import Footer from "../Components/Footer/Footer"

function Contact() {
    return (
        // Il componente "Contact" renderizza tre componenti figli: "Home", "ContactUs", e "Footer".
        <>
            {/* Componente "Home" */}
            <Home
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="Contact Us"             // Titolo da visualizzare nel componente "Home".
            />
            
            {/* Componente "ContactUs" */}
            <ContactUs />

            {/* Componente "Footer" */}
            <Footer />
        </>
    )
}

export default Contact
