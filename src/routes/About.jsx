import Footer from "../Components/Footer/Footer"
import Home from "../Components/Home/Home"
import video from "../Assets/video1.mp4"
import AboutUs from "../Components/AboutUs/AboutUs"


function About() {
    return (
        <>
            <Home
                cName='home'
                homeVideo={video}
                title="Come and Meet us"
                subTitle ="WHO WE ARE?"
            />
            <AboutUs/>
            <Footer/>
        </>
    )
}

export default About