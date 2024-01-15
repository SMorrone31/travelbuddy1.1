import React, { useEffect } from 'react'
import Modal from 'react-modal';
import './home.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import "../Main/main.css"
 // Impostazione dell'elemento radice dell'applicazione per il componente Modal
Modal.setAppElement('#root');

function Home(props) {

  // Inizializzazione di Aos con una durata di animazione di 2000ms
  useEffect(() => {
    Aos.init({ duration: 2000 })
  }, [])

  return (
    <section className={props.cName}>
      <div className="overlay"></div>
      <video src={props.homeVideo} muted autoPlay loop type="video1/mp4" ></video>

      <div className="homeContent container">
        <div className="textDiv">

          <span data-aos='fade-up' className="smallText">
            {props.subTitle}
          </span>

          <h1 data-aos='fade-up' className="homeTitle">
            {props.title}
          </h1>
        </div>

      </div>

    </section >
  )
}

export default Home