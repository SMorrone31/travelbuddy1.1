// Importa i componenti e le risorse necessarie.
import Home from "../Components/Home/Home"
import video from "../Assets/video10.mp4"
import Footer from "../Components/Footer/Footer"
import MainPrefiriti from "../Components/MainPreferiti/MainPreferiti"
import { useAuth } from "../AuthContext"

function Favorites() {
    // Utilizza l'hook "useAuth" per ottenere l'oggetto "user" dall'autenticazione.
    const { user } = useAuth()

    return (
        // Il componente "Favorites" renderizza quattro componenti figli: "Home", "MainPrefiriti", un div vuoto, e "Footer".
        <>
            {/* Componente "Home" */}
            <Home
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="Your Favorite Experiences"  // Titolo da visualizzare nel componente "Home".
                subTitle="Check out the experiences you've liked"  // Sottotitolo da visualizzare nel componente "Home".
            />
            
            {/* Componente "MainPrefiriti" */}
            {user ? (
                <MainPrefiriti />
            ) : (
                // Se l'utente non è autenticato, viene reso un div vuoto.
                <div></div>
            )}

            {/* Componente "Footer" */}
            <Footer />
        </>
    )
}

export default Favorites
