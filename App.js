import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import url from './config/config';
import AsyncStorage from '@react-native-community/async-storage';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@latest', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@latest');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export default function App() {
  const [mydata, setData] = useState([]);
  useEffect(() => {
    fetch(url.INCREMENTAL, {})
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      });
  }, []);
  const mylen = mydata.length;

  if (mydata.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{mydata[222].data}</Text>
      <View style={[styles.positivi]}>
        <Text>Nuovi positivi {mydata[222].nuovi_positivi}</Text>
        <Text>
          Variazione da ieri{' '}
          {mydata[222].nuovi_positivi - mydata[221].nuovi_positivi}
        </Text>
      </View>
      <View style={[styles.decessi]}>
        <Text>Descessi {mydata[222].deceduti - mydata[221].deceduti}</Text>
        <Text>In totale {mydata[222].deceduti}</Text>
      </View>
      <View style={[styles.tamponi]}>
        <Text>
          Tamponi {mydata[222].tamponi - mydata[221].tamponi} / Testati{' '}
          {mydata[222].casi_testati - mydata[221].casi_testati}
        </Text>
        <Text>In totale {mydata[222].tamponi}</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  positivi: {
    padding: 20,
    backgroundColor: '#dadada',
  },
  decessi: {
    padding: 20,
    backgroundColor: '#ff0000',
  },
  tamponi: {
    padding: 20,
    backgroundColor: '#adadad',
  },
});
