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
import {
  getUniqueId,
  getManufacturer,
  useBatteryLevel,
  useBatteryLevelIsLow,
  useDeviceName,
  useIsEmulator,
  getPhoneNumberSync,
  getPhoneNumber,
} from 'react-native-device-info';
import axios from 'axios';
import moment from 'moment';
import { openDatabase, deleteDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({
  name: 'geo_sqlite',
})

const GeoScreen = prop => {
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');
  const [postDataLabel, setPostDataLabel] = useState('Post Data');

  let deviceJSON = {};
  // deviceJSON.batteryLevel = useBatteryLevel();
  // deviceJSON.batteryLevelIsLow = useBatteryLevelIsLow();
  // deviceJSON.deviceName = useDeviceName();
  // deviceJSON.deviceName = useDeviceName();
  // deviceJSON.isEmulator = useIsEmulator();
  // deviceJSON.phoneNumberSync = getPhoneNumberSync();

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
            requestPermissionPhoneState();
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

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const requestPermissionPhoneState = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        requestPermissionPhoneNumber();
        console.log('You can read the phone state');
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPermissionPhoneNumber = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // getDevicePhoneNumber();
        console.log('You can read the phone number');
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

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
        
        // postData(currentLatitude, currentLongitude); //first post
        // setInterval(() => postData(currentLatitude, currentLongitude), 10000); // This does not run in the background
        
        // Important
        // Timer.setInterval(
        //   () => postData(currentLatitude, currentLongitude),
        //   50000,
        // );
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1,
        // distanceFilter: 5
      },
      
    );
  };

  const getDevicePhoneNumber = async () => {
    // deviceJSON.phoneNumberSync = getPhoneNumberSync();
    deviceJSON.phoneNumber = await getPhoneNumber();
    let obj = JSON.parse(JSON.stringify(deviceJSON, null, ' '));
    return obj.phoneNumber;
    //console.log(obj.phoneNumber);
    //console.log('phone number - ', JSON.stringify(deviceJSON));
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

  const addEmpDetails_Save = (empcd, dt, lat, lng, deviceInfo, phoneNumber) => {
    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO empdetails_save (emp_cd, Device_time, Google_time, Latitute, Longitude, Device_id, Sim_id ) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [empcd, dt, dt, lat, lng, deviceInfo.toString(), phoneNumber.toString()],
        (tx, result) => {
          // console.log('Results Added : ', result.rowsAffected);
        },
      )
    });
  };

  const insertOfflineData = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM empdetails_save',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < (results.rows.length); ++i){
            temp.push(results.rows.item(i));
            // console.log('test temp:- ',temp);
            // console.log('test data1 :- ', results.rows.item(i).emp_cd);
            
            const configurationObject1 = {
              method: 'POST',
              url: `http://49.248.4.194/api/GPS/save`,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              data: {
                Emp_cd: results.rows.item(i).emp_cd,
                Device_time: results.rows.item(i).Device_time,
                Google_time: results.rows.item(i).Google_time,
                Latitute: parseFloat(results.rows.item(i).Latitute),
                Longitude: parseFloat(results.rows.item(i).Longitude),
                Device_id: results.rows.item(i).Device_id,
                Sim_id: results.rows.item(i).Sim_id,
              },
            };
      
            const response =  axios(configurationObject1);
            console.log('offline response :- ',response.data);
          }
        }
      );
    });

    //Delete from table
    db.transaction(txn => {
      txn.executeSql(
        `DELETE FROM empdetails_save`,
        [],
        (tx, result) => {
          console.log('DELETION OK : ', result);
        },(tx, error) => 
        {
            console.log(error);
        }
      )
    });
  }

  const postData = async (lat, lng) => {
    const date = moment(new Date()).utc('YYYY-MM-DD HH:mm:ss');
    if(lat != 0 && lng !=0){
      try {
        setPostDataLabel('Posting....')

        const configurationObject = {
          method: 'POST',
          url: `http://49.248.4.194/api/GPS/save`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          data: {
            Emp_cd: prop.empId,
            Device_time: date,
            Google_time: date,
            Latitute: parseFloat(lat),
            Longitude: parseFloat(lng),
            Device_id: DeviceInfo.getUniqueId(),
            Sim_id: await getDevicePhoneNumber(),
          },
        };

        const response = await axios(configurationObject);

        await insertOfflineData();
        // console.log('here it comes!');

        setPostDataLabel('Post Data')
        alert('Saved Suceessfully!')
        // console.log('Response :- ',response.data);
      } catch (error) {
        addEmpDetails_Save(prop.empId, date, parseFloat(lat), parseFloat(lng), 
                            DeviceInfo.getUniqueId(), await getDevicePhoneNumber());

        // console.log(error);
        alert(error)
        setPostDataLabel('Post Data')
      }
    }
    else
    {
      alert('Please check geo location co-ordinates')
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 0.2, alignItems: 'center'}}>
          <Text style={styles.headingText}>VMSalgaocar Corporation Pvt. Ltd.</Text>
          <Text style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  fontWeight: 'bold',
                  fontSize: 20,
                  color:'#191970'
                }}>
                  {prop.empId}
          </Text>
      </View>
      <View style={{flex: 1, alignItems: 'center', marginBottom: 20}}>
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
      </View>
      <View style={{flex: 0.4, alignItems: 'center'}}>
          <Text style={styles.boldText}>{locationStatus}</Text>
          <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
              }}>
                Latitude: {parseFloat(currentLatitude)}
            </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {parseFloat(currentLongitude)}
          </Text>
          <View>
            <TouchableOpacity style={styles.userBtn}
              onPress={() => postData(parseFloat(currentLatitude),parseFloat(currentLongitude))}
            >
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{postDataLabel}</Text>
            </TouchableOpacity>
          </View>
      </View>
      {/* <View style={styles.container}> */}
 
        
        {/* <View style={styles.btnView}> */}
            
            
            {/* <Text>Device Unique ID: {DeviceInfo.getUniqueId()}</Text> */}
            {/* <ScrollView>
              <Text>{JSON.stringify(deviceJSON, null, ' ')}</Text>
            </ScrollView> */}
        {/* </View> */}
        {/* <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={styles.userBtn}
            onPress={() => postData(parseFloat(currentLatitude),parseFloat(currentLongitude))}
          >
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{postDataLabel}</Text>
          </TouchableOpacity> */}
        {/* </View> */}
      {/* </View> */}
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
    // marginTop: 15,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.6,
  },
  btnView: {
    posiotion: 'absolute',
    elevation: 10,
  },
  touchableButton: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#00008B',
  },
  userBtn: {
    backgroundColor: '#FFD700',
    padding: 14,
    width: '45%',
    borderRadius: 5,
    marginTop: 15,
  },
  headingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight:'bold',
    color:'#191970'
  },
});

export default GeoScreen;
