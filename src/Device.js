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
    getPhoneNumberSync, getSerialNumberSync  } from 'react-native-device-info';
    // import RNSimData from 'react-native-sim-data';
    // import SmsRetriever from 'react-native-sms-retriever';

    // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
const Device = prop => {
    const [phone, setPhone] = useState('');
    let deviceJSON = {};

    // useEffect(() => {
    //     const onPhoneNumberPressed = async () => {
    //         try {
    //             console.log('test');
    //             const phoneNumber = await  SmsRetriever.requestPhoneNumber();
    //             // this.setState({phone: phoneNumber.split('+91')[1]});
    //             console.log('abc ',phoneNumber);
    //             setPhone(phoneNumber.split('+91')[1]);
    //         } catch (error) {
    //             console.log(JSON.stringify(error));
    //         }
    //     }

    //     onPhoneNumberPressed();
    // }, []);

    deviceJSON.batteryLevel = useBatteryLevel();
    deviceJSON.batteryLevelIsLow = useBatteryLevelIsLow();
    deviceJSON.deviceName = useDeviceName();
    deviceJSON.isEmulator = useIsEmulator();
    deviceJSON.uniqueId = getUniqueId();
    deviceJSON.deviceId = getDeviceId();
    deviceJSON.systemName = getSystemName();
    deviceJSON.phoneNumber =  getPhoneNumber();
    deviceJSON.carrierSync =  getCarrierSync();
    deviceJSON.phoneNumberSync =  getPhoneNumberSync();
    deviceJSON.serialNumberSync =  getSerialNumberSync();

    // console.log(deviceJSON);

    

    return(<ScrollView>
        <Text style={styles.instruction}>{JSON.stringify(deviceJSON, null, ' ')}</Text>
        {/* <Button title='Push' onPress={onPhoneNumberPressed}></Button> */}
        <Text>{phone}</Text>
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