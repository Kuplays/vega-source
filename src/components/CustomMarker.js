import React from "react";
import './CustomMarker.css';

class CustomMarker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "default",
            doorState: this.props.doorState
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.doorState !== this.props.doorState)
            this.setState({doorState: this.props.doorState});
    }

    render() {
        return (
            <div className="custom_marker"
                style={{ backgroundColor: "green", cursor: 'pointer' }}
                title={this.state.name}
            >
                <img className = "imgCustom" src={this.state.doorState === 0 ? "/open.svg" : "/closed.svg"} alt = "Состояние двери" />
            </div>
        );
    }
}

export default CustomMarker;