import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { set } from 'react-native-reanimated';
// import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const EmpList = prop => {
  // const navigation = useNavigation();
  // const [currentDate, setCurrentDate] = useState(`${("0" + new Date().getDate()).slice(-2)}-${("0" + (new Date().getMonth() + 1)).slice(-2)}-${new Date().getFullYear()}`);
  const [currentDate, setCurrentDate] = useState('');
  const [empList, setEmpList]  = useState([]);
  const [disablePrevColor, setDisablePrevColor]  = useState(false);
  const [disableNextColor, setDisableNextColor]  = useState(true);

  const propObjempList = prop.route.params.empList;

  useEffect(() => {
    setEmpList(prevArray());

    prop.navigation.setOptions({
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
              {prop.route.params.empId}
            </Text>
          </View>
        );
      },
    });
  }, []);

  //Previous dates
  const prevArray = () => {
    if(prop.route.params.dtPrevCopy.length > 0 ){
      prop.route.params.dtPrev = prop.route.params.dtPrevCopy.reverse();
      prop.route.params.dtPrev.push(...prop.route.params.dtNextCopy)
      prop.route.params.dtPrevCopy = [];
      prop.route.params.dtNextCopy = [];
    }

    if(prop.route.params.dtPrev.length > 0)
    {
      let dt = prop.route.params.dtPrev.shift();

      prop.route.params.dtNext.push(dt);

      prop.route.params.finalItems = propObjempList.filter((item) => item.date === dt).map(
        ({Latitute, Longitude, date, id, time}) => ({Latitute, Longitude, date, id, time}));

      setCurrentDate(dt);
      if(prop.route.params.nextColor === 0)
      {
        prop.route.params.nextColor = 1;
        setDisableNextColor(true);
      }else{
        setDisableNextColor(false);
      }

      if(prop.route.params.dtPrev.length === 0){
        setDisablePrevColor(true);
      }
    }
    else
    {
      setDisablePrevColor(true);
      setDisableNextColor(false);
    }

    return prop.route.params.finalItems;
  }

  //Next dates
  const nextArray = () => {
    if(prop.route.params.dtNext.length > 0)
    {
      if(prop.route.params.dtNextCopy.length === 0 ){
        prop.route.params.dtNextCopy = prop.route.params.dtPrev;
      }

      if(prop.route.params.dtPrev.length > 0)  prop.route.params.dtPrev = [];

      let dt = [];
      let dt1 = [];
      if(prop.route.params.dtNext.length > 1)
      {
        dt = prop.route.params.dtNext.slice(-2)[0];
        dt1 = prop.route.params.dtNext.slice(-1)[0];
      
        prop.route.params.dtPrevCopy.push(dt1);

        prop.route.params.dtNext.pop();

        prop.route.params.finalNextItems = propObjempList.filter((item) => item.date === dt).map(
          ({Latitute, Longitude, date, id, time}) => ({Latitute, Longitude, date, id, time})); 

        setCurrentDate(dt);

        if(prop.route.params.dtNext.length === 1){
          setDisableNextColor(true);
        }

        if(prop.route.params.dtPrevCopy.length > 0)
        {
          setDisablePrevColor(false);
        }
      }
    }else{
      setDisableNextColor(true);
      setDisablePrevColor(false);
    }

    return prop.route.params.finalNextItems;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center', marginBottom: '3%'}}>
        <TouchableOpacity style={styles.userBtn}
          onPress={() => setEmpList(prevArray())}
        >
          <Ionicons name="caret-back-outline" size={35} color={!disablePrevColor ? '#4C4E52' : 'silver'}></Ionicons>
        </TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000000', marginLeft: '8%', marginRight: '8%'}}>{currentDate}</Text>
        <TouchableOpacity style={styles.userBtn}
          onPress={() => setEmpList(nextArray())}
        >
          <Ionicons name="caret-forward-outline" size={35} color={!disableNextColor ? '#4C4E52' : 'silver'}></Ionicons>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={empList}
        keyExtractor={(item, index) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <View style={styles.insideView}>
                <Text style={styles.headerText}>Time</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.headerText}>Latitute</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.headerText}>Longitude</Text>
              </View>
          </View>
        )}
        stickyHeaderIndices={[0]}
        extraData={empList}
        // renderItem={renderItem}
        renderItem={({item, index}) => {
          return (
            <View style={styles.item}>
              <View style={styles.insideView}>
                <Text style={styles.text}>{item.time}</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.text}>{item.Latitute}</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.text}>{item.Longitude}</Text>
              </View>
            </View>
          )
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '4%',
    paddingLeft : '1%',
    paddingRight : '1%',
    paddingBottom : '2%',
  },
  headingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight:'bold',
    color:'#191970'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#8D918D',
    padding: 8,
    MarginBottom: 0,
    marginHorizontal: 16,
    borderRadius : 3
  },
  headerText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  insideView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
    borderRadius : 8
  },
  text: {
    fontSize: 15,
    color: 'black',
  }
});

export default EmpList;