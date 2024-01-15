import Home from "../Components/Home/Home"
import video from "../Assets/video10.mp4"

function Hotels() {
    return (
        <>
            <Home
                cName='home-H'
                homeVideo={video}
                title="Find an hotel"
                subTitle = "Our locations"
            />
        </>
    )
}

export default Hotels