import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { openDatabase, deleteDatabase } from 'react-native-sqlite-storage';
import GeoScreen from './GeoScreen';

const db = openDatabase({
  name: 'geo_sqlite',
})

const HomeScreen = prop => {
  const [isIdEntered, setIsIdEntered] = useState(false);
  const [empId, setEmpId] = useState('');
  const [enteredEmpId, setEnteredEmpId] = useState('');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let getEmpId = enteredEmpId;
  let verifyIdEntered = isIdEntered;

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='empdetails'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS empdetails', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS empdetails(id INTEGER PRIMARY KEY AUTOINCREMENT, empid VARCHAR(5))',
              []
            );
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS empdetails_save(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                emp_cd DECIMAL(5, 0), Device_time datetime, Google_time datetime, Latitute DECIMAL(11, 7),
                Longitude DECIMAL(11, 7), Device_id VARCHAR(20), Sim_id VARCHAR(20))`,
              []
            );
          }
        }
      );
    })

    viewEmp();
  }, []);

  const viewEmp = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM empdetails',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp);

          if(temp.length > 0){
            getEmpId = temp[0].empid;
            setEnteredEmpId(getEmpId);
            verifyIdEntered = true;
            setIsIdEntered(verifyIdEntered);
          }
        }
      );
    });
  }

  const addEmpId = () => {
    if (empId === '') {
      alert('Please Enter Code');
      return;
    }

    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO empdetails (empid) VALUES (?)',
        [empId],
        (tx, result) => {
          console.log('Results', result.rowsAffected);
          if (result.rowsAffected > 0) {
            getEmpId = empId;
            setEnteredEmpId(getEmpId);
            setIsIdEntered(true);
          } else 
          {
            setIsIdEntered(false);
          }
        },
      )
    });
  };

  return (
    <View style={styles.container}>
      {isIdEntered ? (
        <GeoScreen empId = {getEmpId} />
      ) : (
        <View>
          {/* <Text style={styles.headingText}>VMSalgaocar Corporation Pvt. Ltd.</Text> */}
          <View style={[styles.homeTitle, {width: windowWidth}]}>
            <Image source={require('./assets/VMSC_Logo.gif')}></Image>
          </View>
          <View style={styles.container}>
            <TextInput style={styles.inputText} 
              placeholder='Enter Employee ID' 
              onChangeText={empid => setEmpId(empid)}
              maxLength={5}
              value={empId.toString()}
            />
            <View>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={addEmpId}
              >
                <Text style={styles.btnTxt}>Enter Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* <TextInput style={!isIdEntered ? styles.inputText : styles.hide  }
        placeholder='Enter Employee ID'
        onChangeText={empid => setEmpId(empid)}
        value={empId.toString()} />
      <Text style={isIdEntered ? styles.inputText : styles.hide  }>{getEmpId}</Text>  
      <View>
        <TouchableOpacity
          style={!isIdEntered ? styles.userBtn : styles.hide }
          onPress={addEmpId}
        >
          <Text style={styles.btnTxt}>Enter Code</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={isIdEntered ? styles.userBtn : styles.hide }
          onPress={() => prop.navigation.push('GeoScreen', { empId: empId })}
          // onPress = {viewEmp}
        >
          <Text style={styles.btnTxt}>Continue</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeTitle: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth : 1,
    borderColor: '#D3D3D3',
    padding: 8,
    backgroundColor: '#EBF4FA'
  },
  inputText: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  userBtn: {
    backgroundColor: '#FFD700',
    padding: 14,
    width: '45%',
    borderRadius: 5,
    marginTop: 15
  },
  hide: { display: 'none' },
});

export default HomeScreen;