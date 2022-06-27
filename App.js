import React, {Component, useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  platform,
  image,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Image,
  PermissionsAndroid, ScrollView
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import RNSimData from 'react-native-sim-data'
// import Icon from 'react-native-vector-icons/Ionicons';
// import Geocoder from 'react-native-geocoder';
import { getUniqueId, getManufacturer, useBatteryLevel, 
  useBatteryLevelIsLow, useDeviceName, useIsEmulator } from 'react-native-device-info';
import axios from 'axios';
import moment from 'moment';
// import imei from 'react-native-imei';
import Timer from "react-native-background-timer-android";

const App = prop => {
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');
  // Geocoder.fallbackToGoogle('AIzaSyDl4WjiXse1SS-UWOiLcSrHfxdmwBZgURA');
  const [deviceImei, setDeviceImei] = useState('');

  let deviceJSON = {};
  deviceJSON.batteryLevel = useBatteryLevel();
  deviceJSON.batteryLevelIsLow = useBatteryLevelIsLow();
  deviceJSON.deviceName = useDeviceName();
  deviceJSON.deviceName = useDeviceName();
  deviceJSON.isEmulator = useIsEmulator();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
           
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    const requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can read the phone state");            
        } else {
          console.log("permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
    }

    const requestPermission1 = async () => {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can read the phone state 11");            
        } else {
          console.log("permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
    }

    requestLocationPermission();
    // requestPermission();
    requestPermission1();

    // setInterval(()=> postData(), 3000)
    // Timer.setInterval(() => console.log("tic"), 500);

    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const postData1 = () =>{
    console.log('post to database every 5 min');
  }

  // console.log('ans2 : ', Object.entries(receiveDataFromDevice.toString()));

  // DeviceInfo.getPhoneNumber().then((phoneNumber) => {
  //   // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
  //   console.log('test',phoneNumber);
  // });

  // getPhoneNumber().then(thing => console.log('c', thing, 'c'))

  // getPhoneNumber().then((productname) => console.log(productname))

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        
          //console.log('test: ',currentLongitude);

        postData(currentLatitude,currentLongitude); //first post
        setInterval(()=> postData(currentLatitude,currentLongitude), 10000)

        // setInterval(()=> console.log('test: ',currentLongitude), 3000)
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
      
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        // console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        
        //console.log('test 1: ',currentLongitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
      },
    );
  };

  // const navigateBack = async () => {
  //   var NY = {
  //     lat: parseFloat(currentLatitude),
  //     lng: parseFloat(currentLongitude),
  //   };

  //   const addr = await Geocoder.geocodePosition(NY);

  //   prop.navigation.navigate('Scan', {
  //     latitude: currentLatitude,
  //     longitude: currentLongitude,
  //     addr: addr[0],
  //   });
  // };

  // console.log(RNSimData.getSimInfo());

  const onComplete = () =>{     
    const phoneNumber = DeviceInfo.getPhoneNumber();   

    // const test = Object.entries(phoneNumber).map(i => {
    //   return i
    // })

    alert(Object.keys(JSON.stringify(phoneNumber)));
    // alert(test);
    //this.props.navigation.replace('Login_second',{mobile:phoneNumber});
  }

  // const getDeviceIMEI = () => {
  //   const IMEI = require('react-native-imei')
  //   // this.setState({
  //   //   DeviceIMEI: IMEI.getImei(),
  //   // })
  //   setDeviceImei(IMEI.getImei());
  //   console.log('imei : ',deviceImei);
  // }

  const postData = async (lat,lng) => {
    try {

      const date = moment(new Date()).utc('YYYY-MM-DD HH:mm:ss');

      const configurationObject = {
        method: 'POST',
        url: `https://flat-taxis-raise-136-232-4-6.loca.lt/api/GPS/save`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
                Emp_cd  : 90541, 
                Device_time : date,
                Google_time : date,
                Latitute  : parseFloat(lat),
                Longitude : parseFloat(lng), 
                Device_id : DeviceInfo.getUniqueId(),
                Sim_id  : '12345'
              },
      };

      const response = await axios(configurationObject);

      console.log(response.data);

    } catch (error) {
        console.log(error);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          zoomLevel={18}
          loadingEnabled
          scrollEnabled
          zoomEnabled
          pitchEnabled
          rotateEnabled
          region={{
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          {/* <Marker
            coordinate={{
              latitude: parseFloat(currentLatitude),
              longitude: parseFloat(currentLongitude),
            }}
            draggable
            tracksViewChanges={true}
            onDragEnd={e => {
              console.log('dragEnd', e.nativeEvent.coordinate);
            }}
            pinColor="#CD5C5C"
          /> */}
        </MapView>
        <View style={styles.btnView}>
          <Text style={styles.boldText}>{locationStatus}</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {parseFloat(currentLongitude)}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {parseFloat(currentLatitude)}
            </Text>
            <Text>Device Unique ID: {DeviceInfo.getUniqueId()}</Text>
            {/* <ScrollView>
              <Text>{JSON.stringify(deviceJSON, null, ' ')}</Text>
            </ScrollView> */}
        </View>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={styles.button} onPress={postData}>
            <Text>Post</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{...styles.button, marginLeft: 5}} onPress={getDeviceIMEI}>
            <Text>IMEI</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{display: 'none'}}>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
            }}
            style={{width: 100, height: 100}}
          />
          <Text style={styles.boldText}>{locationStatus}</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {currentLatitude}
          </Text>
          <View style={{marginTop: 20}}>
            <Button title="Button" onPress={getOneTimeLocation} />
          </View>
        </View>
        <View style={{display: 'none'}}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: 'grey',
            }}>
            React Native Geolocation
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: 'grey',
            }}>
            www.aboutreact.com
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontSize: 20,
    color: 'red',
    fontWeight: '600',
    marginVertical: 10,
  },
  container: {
    flex: 2,
    // backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.3,
  },
  btnView: {
    posiotion: 'absolute',
    elevation: 10,
  },
  touchableButton: {
    alignItems: 'center',
    // backgroundColor: '#E0FFFF',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#00008B',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});

export default App;
