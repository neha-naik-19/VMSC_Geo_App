import React, {Component, useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid, ScrollView, Dimensions
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from "react-native-geolocation-service";
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
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
  const navigation = useNavigation();
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [coordinates, setCoordinates]= useState([]);
  const [locationStatus, setLocationStatus] = useState('');
  const [postDataLabel, setPostDataLabel] = useState('Post Data');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let deviceJSON = {};
  // deviceJSON.batteryLevel = useBatteryLevel();
  // deviceJSON.batteryLevelIsLow = useBatteryLevelIsLow();
  // deviceJSON.deviceName = useDeviceName();
  // deviceJSON.deviceName = useDeviceName();
  // deviceJSON.isEmulator = useIsEmulator();
  // deviceJSON.phoneNumberSync = getPhoneNumberSync();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      // headerBackTitleVisible: true,
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      //   color: '#FFFF',
      // },
      headerStyle: {backgroundColor: '#EBF4FA'},
      headerLeft: () => {
        return (
          <Image
            source={require('./assets/VMSC_Logo.gif')}
            style={{margin: 5}}></Image>
        );
      },
      headerRight: () => {
        return (
          <View>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#000000'}}>
              {prop.empId}
            </Text>
          </View>
        );
      },
    });

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
      position => {
        setLocationStatus('You are Here');
        const currentLongitude = position.coords.longitude;
        const currentLatitude = position.coords.latitude;

        const currentCoordinates = coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude});

        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        setCoordinates(currentCoordinates);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      },
      
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        setLocationStatus('You are Here');
        const currentLongitude = position.coords.longitude;
        const currentLatitude = position.coords.latitude;

        const currentCoordinates = coordinates.concat({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude});

        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        setCoordinates(currentCoordinates);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 0
      },
    );
  };

  const getDevicePhoneNumber = async () => {
    deviceJSON.phoneNumber = await getPhoneNumber();
    let obj = JSON.parse(JSON.stringify(deviceJSON, null, ' '));
    return obj.phoneNumber;
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
                Latitute: results.rows.item(i).Latitute,
                Longitude: results.rows.item(i).Longitude,
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
          // console.log('DELETION OK : ', result);
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
            Latitute: lat,
            Longitude: lng,
            Device_id: DeviceInfo.getUniqueId(),
            Sim_id: await getDevicePhoneNumber(),
          },
        };

        const response = await axios(configurationObject);

        await insertOfflineData();

        setPostDataLabel('Post Data')
        alert('Saved Suceessfully!')
      } catch (error) {
        addEmpDetails_Save(prop.empId, date, lat, lng, 
                            DeviceInfo.getUniqueId(), await getDevicePhoneNumber());

        alert(error)
        setPostDataLabel('Post Data')
      }
    }
    else
    {
      alert('Please check geo location Co-ordinates')
    }
  }

   const navigateEmplist = async () => {
    try {
      const configurationObject = {
          method: 'GET',
          url: `http://49.248.4.194/api/empdetails/${prop.empId}`,
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
      };
  
    const response = await axios(configurationObject);

    const items = response.data.map(i => {
      return {
        id : i.Entry_id,
        Latitute : i.Latitute,
        Longitude : i.Longitude,
        // date : i.Device_time,
        date : `${("0" + new Date(i.Device_time).getDate()).slice(-2)}-${("0" + (new Date(i.Device_time).getMonth() + 1)).slice(-2)}-${new Date(i.Device_time).getFullYear()}`,
        time : i.time
      }
    })

    let currentDate = `${("0" + new Date().getDate()).slice(-2)}-${("0" + (new Date().getMonth() + 1)).slice(-2)}-${new Date().getFullYear()}`;

    const currrentDateItems = items.filter((item) => item.date === currentDate).map(
      ({Latitute, Longitude, date, id, time}) => ({Latitute, Longitude, date, id, time}));

    // console.log('currrentDateItems : ',currrentDateItems);  

    navigation.navigate('EmpList', {
        empId: prop.empId,
        // empList: currrentDateItems,
        // empDetails : items
        empList: items,
        dtPrev : [... new Set(items.map(l => l.date))],
        dtPrevCopy : [],
        dtNext : [],
        dtNextCopy : [],
        finalPrevItems : [],
        finalNextItems : [],
        nextColor : 0
    });

    } catch (error) {
      console.log('Error : ', error.message);
    }
  };

  return (
    <View style={[
      styles.container,
      {
        flexDirection: 'column',
        width: windowWidth,
      },
    ]}>
      <View
          style={[
            styles.section,
            {
              flex: 2.2,
            },
          ]}
      >
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
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          <Marker
            coordinate={{
              latitude: currentLatitude,
              longitude: currentLongitude,
            }}>
          </Marker>
        </MapView>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
              height: '72%',
              flexGrow: 1,
          }}
        >
          <View style={styles.welcome}>
            <Text style={styles.boldText}>{locationStatus}</Text>
            <Text
                style={styles.coOrdinateText}>
                  Latitude:  {currentLatitude}
              </Text>
              <Text
                style={styles.coOrdinateText}>
                Longitude:  {currentLongitude}
              </Text>
          </View>
          <View style={{flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D3D3D3', borderRadius: 10}}>
            <View style={styles.btnVisuals}>
              <TouchableOpacity style={styles.userBtn}
              onPress={() => postData(currentLatitude,currentLongitude)}
              >
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{postDataLabel}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnVisuals}>
              <TouchableOpacity style={styles.userBtn}
                onPress={navigateEmplist}
              >
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontSize: 20,
    color: 'red',
    fontWeight: '600',
    marginVertical: 10,
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    paddingRight: '1%',
    paddingLeft: '1%',
    // paddingTop: '1%',
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  map: {
    flex: 1
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
    // width: '45%',
    borderRadius: 5,
    // marginTop: 15,
  },
  headingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight:'bold',
    color:'#191970'
  },
  section: {marginBottom: 4, borderWidth: 1, borderColor: '#F8F0E3'},
  welcome: {
    // flex: 1,
    // margin: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
    padding: '2%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3'
  },
  coOrdinateText: {
    marginTop: 5, 
    alignSelf: 'center',
    fontWeight: '900', 
    color: '#000080'
  },
  btnVisuals: {
    flex: 1, justifyContent: 'center',margin : 8, borderRadius: 5
  },
  btnViewVisuals:{
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#D3D3D3', 
    borderRadius: 10
  }
});

export default GeoScreen;
