import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TextInput, 
  Button, FileList, StyleSheet, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';  

  const MainScreen = prop => {
    const navigation = useNavigation();

    return(
        <View>
            <View style={{marginBottom: 5}}>
                <TouchableOpacity
                    style={{backgroundColor: '#FFD700',
                    padding: 14,
                    width: '45%',
                    borderRadius: 5,
                    marginTop: 15}}
                    onPress={() => {
                        prop.navigation.push('GeoLocationScreen_1');
                    }}
                >
                    <Text>New Geo Map</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom: 5}}>
                <TouchableOpacity
                    style={{backgroundColor: '#FFD700',
                    padding: 14,
                    width: '45%',
                    borderRadius: 5,
                    marginTop: 15}}
                    onPress={() => {
                        prop.navigation.push('GeoScreen_Test');
                    }}
                >
                    <Text>Old Geo Map</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
  }

  export default MainScreen;