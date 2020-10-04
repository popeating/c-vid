import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import url from './config/config';
import AsyncStorage from '@react-native-community/async-storage';
import { format } from 'date-fns';
import itloc from 'date-fns/locale/it';

import { colors, sizes } from './config/theme';

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
  console.log(colors);
  const last_update = Date.parse(mydata[mylen - 1].data);

  const date_update = format(last_update, 'dd MMMM yyyy', { locale: itloc });
  const time_update = format(last_update, 'HH:MM', { locale: itloc });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.updatecontainer}>
          <Text style={styles.update}>Aggiornamento</Text>
          <Text style={styles.update}>
            {date_update} {time_update}
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />

      <View style={[styles.positivi]}>
        <Text>Nuovi positivi {mydata[mylen - 1].nuovi_positivi}</Text>
        <Text>
          Variazione da ieri{' '}
          {mydata[mylen - 1].nuovi_positivi - mydata[mylen - 2].nuovi_positivi}
        </Text>
      </View>
      <View style={[styles.decessi]}>
        <Text>
          Descessi {mydata[mylen - 1].deceduti - mydata[mylen - 2].deceduti}
        </Text>
        <Text>In totale {mydata[mylen - 1].deceduti}</Text>
      </View>
      <View style={[styles.tamponi]}>
        <Text>
          Tamponi {mydata[mylen - 1].tamponi - mydata[mylen - 2].tamponi} /
          Testati{' '}
          {mydata[mylen - 1].casi_testati - mydata[mylen - 2].casi_testati}
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
    // alignItems: 'center',
    // justifyContent: 'center',
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
  header: {
    justifyContent: 'flex-end',
    width: '100%',
    height: 250,
    backgroundColor: colors.blue,
    borderBottomRightRadius: 100,
    marginBottom: sizes.base,
  },
  updatecontainer: {
    padding: sizes.padding,
  },
  update: { color: colors.canary, fontSize: sizes.title, fontWeight: '800' },
});
