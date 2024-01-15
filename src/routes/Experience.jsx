// Importa i componenti e le risorse necessarie.
import Home from "../Components/Home/Home"
import video from "../Assets/video10.mp4"
import Footer from "../Components/Footer/Footer"
import Main from "../Components/Main/Main"
import { useAuth } from "../AuthContext"

function Experience() {
    // Utilizza l'hook "useAuth" per ottenere l'oggetto "user" dall'autenticazione.
    const { user } = useAuth()

    return (
        // Il componente "Experience" renderizza quattro componenti figli: "Home", "Main", un div vuoto, e "Footer".
        <>
            {/* Componente "Home" */}
            <Home
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="View a more experience"  // Titolo da visualizzare nel componente "Home".
                subTitle="Desired destinations and shared experiences"  // Sottotitolo da visualizzare nel componente "Home".
            />
            
            {/* Componente "Main" */}
            {user ? (
                <Main />
            ) : (
                // Se l'utente non è autenticato, viene reso un div vuoto.
                <div></div>
            )}

            {/* Componente "Footer" */}
            <Footer />
        </>
    )
}

export default Experience
