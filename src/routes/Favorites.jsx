import Home from "../Components/Home/Home"
import video from "../Assets/video10.mp4"
import Footer from "../Components/Footer/Footer"
import MainPrefiriti from "../Components/MainPreferiti/MainPreferiti"
import { useAuth } from "../AuthContext"

function Favorites() {
    const { user } = useAuth()
    return (
        <>
            <Home
                cName='home'
                homeVideo={video}
                title="Your Favorite Experiences"
                subTitle="Check out the experiences you've liked"
            />
            {user? (
                <MainPrefiriti />
            ) : (
                <div></div>
            )}
            <Footer />
        </>
    )
}

export default Favorites