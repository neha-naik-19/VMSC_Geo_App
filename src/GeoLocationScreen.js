import React from "react";
import { View, Text } from "react-native";
import MapView, {
  Polyline,
  PROVIDER_GOOGLE,
  Marker
} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
        latitude: 0,
        longitude: 0,
        coordinates: [],
     };
  }

  render() {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
      },
      error => {
        alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );

    Geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
      },
      error => {
        console.log(error);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 0
      }
    );

    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          <Marker
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              }}>
          </Marker>
        </MapView>
        <Polyline
          coordinates={this.state.coordinates}
          strokeColor="#bf8221"
          strokeColors={[ '#bf8221', '#ffe066', '#ffe066', '#ffe066', '#ffe066', ]}
          strokeWidth={3}
        />
        <View>
          <Text>{`Latitude : ${this.state.latitude}`}</Text>
          <Text>{`Longitude : ${this.state.longitude}`}</Text>
        </View>
      </View>
    );
  }
}