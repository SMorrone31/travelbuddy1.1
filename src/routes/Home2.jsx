
import Home from "../Components/Home/Home"
import Footer from "../Components/Footer/Footer"
import video from "../Assets/video5.mp4"
import Destination from "../Components/Destination/Destination"


function Home2() {
    return (
        <>
            <Home 
            cName='home' 
            homeVideo={video}
            title="Take a tour with us"
            subTitle="Our best trips"/>
            <Destination/>
            <Footer />
        </>
    )
}

export default Home2