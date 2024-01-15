import Home from "../Components/Home/Home"
import video from "../Assets/video2.mp4"
import MainMaps from "../Components/MainMaps/MainMaps"
import React from "react"


function Packages() {

    return (
        <>
            <Home
                cName='home'
                homeVideo={video}
                title="Find your place"
                subTitle="INFORMATION"
            />
            <MainMaps />

        </>
    )
}

export default Packages