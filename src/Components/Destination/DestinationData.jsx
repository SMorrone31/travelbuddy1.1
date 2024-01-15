import './destination.css'
import { Component } from "react"

class DestinationData extends Component {
    render() {
        return (
            <div data-aos='fade-up' className={this.props.className}>
                <div className="des-text">
                    <h3>{this.props.heading}</h3>
                    <p>{this.props.text}</p>
                </div>
                <div className="image">
                    <img src={this.props.img1} alt="img" />
                    <img src={this.props.img2} alt="img" />
                </div>


            </div>
        )
    }
}

export default DestinationData