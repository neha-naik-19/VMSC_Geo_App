import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
// import {StackActions} from '@react-navigation/native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Text as SvgText} from 'react-native-svg';
import SvgScreen from '../components/SvgScreen';

const DisplayScreen = props => {
  const navigation = useNavigation();
  const [deviceId, setDeviceId] = useState(props.deviceId);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerBackTitleVisible: true,
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#FFFF',
      },
      headerStyle: {backgroundColor: '#778899'},
      headerLeft: () => {
        return (
          <Image
            source={require('../assets/bits_logo.png')}
            style={{margin: 5}}></Image>
        );
      },
      headerRight: () => {
        return (
          <View>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFFFFF'}}>
              Monthly Calendar
            </Text>
          </View>
        );
      },
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'column',
          width: windowWidth,
        },
      ]}>
        <View
        style={{
          flex: 1,
          paddingRight: '7%',
          flexDirection: 'column',
          width: windowWidth,
        }}>
            <View style={[styles.section, styles.deviceIdView]}>
            <TouchableOpacity
                onPress={() => {
                navigation.push('DeviceDisplay');
                }}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>{deviceId}</Text>
            </TouchableOpacity>
            </View>
            <View
            style={[
                styles.section,
                {
                flex: 0.5,
                backgroundColor: 'deepskyblue',
                },
            ]}
            />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            height: '72%',
            flexGrow: 1,
          }}>
          <View style={styles.welcome}>
            <Text>Welcome to React Native</Text>
          </View>
          <View style={styles.welcome}>
            <Text>Welcome to React Native</Text>
          </View>
          <View style={styles.welcome}>
            <Text>Welcome to React Native</Text>
          </View>
          <Text style={styles.welcome}>Welcome to React Native</Text>
          <Text style={styles.welcome}>Welcome to React Native</Text>
          <Text style={styles.welcome}>Welcome to React Native</Text>
          <Text style={styles.welcome}>Welcome to React Native</Text>
          <Text style={styles.welcome}>Welcome to React Native</Text>
        </ScrollView>
      </View>
      {/* <View
        style={[
          styles.section,
          {
            flex: 0.8,
            backgroundColor: 'powderblue',
          },
        ]}></View>
      <View
        style={[
          styles.section,
          {
            flex: 0.8,
            backgroundColor: 'skyblue',
          },
        ]}
      />
      <View
        style={[
          styles.section,
          {
            flex: 4,
            backgroundColor: 'deepskyblue',
          },
        ]}
      />
      <View
        style={[
          styles.section,
          {
            flex: 2,
            backgroundColor: 'steelblue',
          },
        ]}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  section: {marginBottom: 4, borderWidth: 1, borderColor: '#808080'},
  welcome: {
    // flex: 1,
    // margin: 20,
    backgroundColor: 'lightgreen',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
    paddingTop: '70%',
  },
  deviceIdView: {
    flex: 0.5,
    backgroundColor: '#DCDCDC',
    borderColor: '#DCDCDC',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default DisplayScreen;