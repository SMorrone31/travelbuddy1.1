import Home from "../Components/Home/Home"
import video from "../Assets/video6.mp4"


function Flights() {
    return (
        <>
            <Home
                cName='home-fligth'
                homeVideo={video}
                title="Find your flight"
                subTitle = "Oue destinatios"
            />
        </>
    )
}

export default Flights