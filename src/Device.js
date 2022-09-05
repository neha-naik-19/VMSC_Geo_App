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
import { getUniqueId, getManufacturer, useBatteryLevel, 
    useBatteryLevelIsLow, useDeviceName, useIsEmulator, 
    getDeviceId, getSystemName, getPhoneNumber, getCarrierSync, 
    getPhoneNumberSync, getSerialNumberSync, getSerialNumber, getDeviceToken,
    getBundleId, getAndroidId, getAndroidIdSync, getAvailableLocationProviders, getAvailableLocationProvidersSync  } from 'react-native-device-info';
import axios from 'axios';
   
// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);

const Device = prop => {
  const [res, setRes] = useState([]);
    let deviceJSON = {};

    useEffect(() => {
        // const requestPermission1 = async () => {
        //     try {
        //       const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS)
      
        //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //         console.log("You can read PHONE_NUMBERS");            
        //       } else {
        //         console.log("permission denied")
        //       }

        //     const granted_READ_PHONE_STATE = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE)
    
        //     if (granted_READ_PHONE_STATE === PermissionsAndroid.RESULTS.GRANTED) {
        //     console.log("You can read PHONE_STATE");            
        //     } else {
        //     console.log("permission denied")
        //     }
        //     } catch (err) {
        //       console.warn(err)
        //     }
        //   }

        //   requestPermission1();

        getData();

        // console.log('Test sim data: ',RNSimData.getTelephoneNumber());
    }, []);

    deviceJSON.batteryLevel = useBatteryLevel();
    deviceJSON.batteryLevelIsLow = useBatteryLevelIsLow();
    deviceJSON.deviceName = useDeviceName();
    deviceJSON.isEmulator = useIsEmulator();
    deviceJSON.uniqueId = getUniqueId();
    deviceJSON.deviceId = getDeviceId();
    deviceJSON.systemName = getSystemName();
    // deviceJSON.phoneNumber =  getPhoneNumber();
    deviceJSON.carrierSync =  getCarrierSync();
    deviceJSON.phoneNumberSync =  getPhoneNumberSync();
    deviceJSON.serialNumberSync =  getSerialNumberSync();
    // deviceJSON.serialNumber = getSerialNumber();
    // deviceJSON.deviceToken = getDeviceToken();
    // deviceJSON.bundleId = getBundleId();
    // deviceJSON.androidId = getAndroidIdSync();
    // deviceJSON.availableLocationProviders = getAvailableLocationProvidersSync();

    // console.log(deviceJSON);


    const getData = async () => {
      try {
  
        const configurationObject = {
          method: 'GET',
          url: `http://49.248.4.194/api/sitemaster`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        };
  
        const response = await axios(configurationObject);
        setRes(response.data);

        console.log(response.data);

      } catch (error) {
        console.log(error);
      }
    }

    return(<ScrollView>
        <Text style={styles.instruction}>abc</Text>
        {/* <Button title='Push' onPress={onPhoneNumberPressed}></Button> */}
    </ScrollView>);
}

const styles = StyleSheet.create({
    titleStyle : {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    instruction: {
        textAlign: 'left',
        color: '#333333',
        margin: 5
    }
})

export default Device;