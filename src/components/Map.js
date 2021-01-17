import React from "react";
import GoogleMapReact from "google-map-react";
import CustomMarker from "./CustomMarker";

class Map extends React.Component {
    render() {
        return (
            <div style={{ height: '300px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyCu3IIob4szoEYvzK9ikoj753CcOJtjRHo" }}
                    defaultCenter={{lat: 55.013872, lng: 82.954099}}
                    defaultZoom={15}
                >
                    <CustomMarker
                        lat={55.013872}
                        lng={82.954099}
                        name="marker"
                        color="green"
                        doorState={this.props.doorState}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}


export default Map;

