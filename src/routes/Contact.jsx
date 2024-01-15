import Home from "../Components/Home/Home"
import video from "../Assets/video9.mp4"
import ContactUs from "../Components/ContactUs/ContactUs"
import Footer from "../Components/Footer/Footer"

function Contact() {
    return (
        <>
            <Home
                cName='home'
                homeVideo={video}
                title="Contact Us"
            />
            <ContactUs />
            <Footer />
        </>
    )
}

export default Contact