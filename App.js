import React, { useEffect, useState } from 'react';
import {View, Text, StatusBar, TextInput, Button, FileList} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import GeoScreen from './src/GeoScreen';
import EmpList from './src/EmpList';
// import MainScreen from './src/MainScreen';

const Stack = createNativeStackNavigator();

function App() {
  return(
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName="HomeScreen"
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            headerShown: false,
          }}
        /> */}
        <Stack.Screen
          name="GeoScreen"
          component={GeoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EmpList"
          component={EmpList}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
 );
}

export default App;