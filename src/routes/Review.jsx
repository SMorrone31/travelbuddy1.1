import Home from "../Components/Home/Home"
import video from "../Assets/video6.mp4"
import ReviewUs from "../Components/Review/ReviewUs"
import Footer from "../Components/Footer/Footer"

function Review() {
    return (
        <>
            <Home
                cName='home'
                homeVideo={video}
                title="Leave your review"
                subTitle="Make sure to find out what other people think about TravelBuddy."
            />
            <ReviewUs/>
            <Footer />
        </>
    )
}

export default Review