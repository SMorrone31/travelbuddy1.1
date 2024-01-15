import Home from "../Components/Home/Home"
import video from "../Assets/video10.mp4"
import Footer from "../Components/Footer/Footer"
import Main from "../Components/Main/Main"
import { useAuth } from "../AuthContext"

function Experience() {
    const { user } = useAuth()
    return (
        <>
            <Home
                cName='home'
                homeVideo={video}
                title="View a more experience"
                subTitle="Desired destinations and shared experiences"
            />
            {user? (
                <Main />
            ) : (
                <div></div>
            )}
            <Footer />
        </>
    )
}

export default Experience