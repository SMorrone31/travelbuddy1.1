// Importa i componenti e le risorse necessarie.
import Home from "../Components/Home/Home"
import video from "../Assets/video6.mp4"
import ReviewUs from "../Components/Review/ReviewUs"
import Footer from "../Components/Footer/Footer"

function Review() {
    return (
        // Il componente "Review" renderizza tre componenti figli: "Home", "ReviewUs", e "Footer".
        <>
            {/* Componente "Home" */}
            <Home
                cName='home'                    // Classe CSS personalizzata per il componente "Home".
                homeVideo={video}               // URL del video da utilizzare nel componente "Home".
                title="Leave your review"       // Titolo da visualizzare nel componente "Home".
                subTitle="Make sure to find out what other people think about TravelBuddy."  // Sottotitolo da visualizzare nel componente "Home".
            />
            
            {/* Componente "ReviewUs" */}
            <ReviewUs/>

            {/* Componente "Footer" */}
            <Footer />
        </>
    )
}

export default Review
