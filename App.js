import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import url from './config/config';
import { format } from 'date-fns';
import itloc from 'date-fns/locale/it';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import { colors, sizes } from './config/theme';

export default function App() {
  const [mydata, setData] = useState([]);
  useEffect(() => {
    fetch(url.INCREMENTAL, {})
      .then((res) => res.json())
      .then((result) => {
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

  const last_update = Date.parse(mydata[mylen - 1].data);
  const date_update = format(last_update, 'dd MMMM yyyy', { locale: itloc });
  const time_update = format(last_update, 'HH:MM', { locale: itloc });
  const positivi = mydata[mylen - 1].nuovi_positivi;
  const tot_positivi = mydata[mylen - 1].totale_positivi;
  var new_variation =
    mydata[mylen - 1].nuovi_positivi - mydata[mylen - 2].nuovi_positivi;
  new_variation = (new_variation > 0 ? '+' : '') + new_variation;

  const death_variation =
    mydata[mylen - 1].deceduti - mydata[mylen - 2].deceduti;

  const tamponi = mydata[mylen - 1].tamponi - mydata[mylen - 2].tamponi;
  const testati =
    mydata[mylen - 1].casi_testati - mydata[mylen - 2].casi_testati;

  const rapporto = ((positivi / tamponi) * 100).toFixed(2) + '%';
  const rapporto_t = ((positivi / testati) * 100).toFixed(2) + '%';

  const guariti =
    mydata[mylen - 1].dimessi_guariti - mydata[mylen - 2].dimessi_guariti;
  const guariti_tot = mydata[mylen - 1].dimessi_guariti;
  const terapia_intensiva = mydata[mylen - 1].terapia_intensiva;
  var var_terapia_intensiva =
    mydata[mylen - 1].terapia_intensiva - mydata[mylen - 2].terapia_intensiva;

  var_terapia_intensiva =
    (var_terapia_intensiva > 0 ? '+' : '') + var_terapia_intensiva;

  const ospedalizzati = mydata[mylen - 1].totale_ospedalizzati;

  var var_ospedalizzati =
    mydata[mylen - 1].totale_ospedalizzati -
    mydata[mylen - 2].totale_ospedalizzati;
  var_ospedalizzati = (var_ospedalizzati > 0 ? '+' : '') + var_ospedalizzati;
  const data = [];
  const data_death = [];
  const dates = [];
  const data_ti = [];
  const data_postamp = [];
  const data_postest = [];
  for (var i = 8; i >= 1; i--) {
    //console.log(mylen - i);

    if (mylen - i + 1 < mylen) {
      const tamp = mydata[mylen - i + 1].tamponi - mydata[mylen - i].tamponi;
      const test =
        mydata[mylen - i + 1].casi_testati - mydata[mylen - i].casi_testati;

      data_postamp.push(
        ((mydata[mylen - i + 1].nuovi_positivi / tamponi) * 100).toFixed(2)
      );
      data_postest.push(
        ((mydata[mylen - i + 1].nuovi_positivi / test) * 100).toFixed(2)
      );
      //const rapporto_t = ((positivi / testati) * 100).toFixed(2);
    }

    dates.push(
      format(Date.parse(mydata[mylen - i].data), 'dd/MM', { locale: itloc })
    );
    data.push(mydata[mylen - i].nuovi_positivi);

    if (mylen - i + 1 < mylen) {
      data_death.push(
        mydata[mylen - i + 1].deceduti - mydata[mylen - i].deceduti
      );
    }

    if (mylen - i + 1 < mylen) {
      data_ti.push(mydata[mylen - i].terapia_intensiva);
    }
  }
  //console.log(data_postest);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.updatecontainer}>
          <Text style={styles.totali}>
            CASI TOTALI: {mydata[mylen - 1].totale_casi}
          </Text>
          <Text style={styles.update}>Aggiornamento</Text>
          <Text style={styles.update}>
            {date_update} {time_update}
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
      <ScrollView style={{ width: '80%' }}>
        <View style={[styles.positivicontainer, styles.boxes]}>
          <Text style={[styles.title]}>Totale positivi {tot_positivi}</Text>
          <Text style={[styles.title]}>Nuovi positivi {positivi}</Text>
          <Text>Variazione da ieri {new_variation}</Text>
          <LineChart
            width={300} // from react-native
            height={260}
            withShadow={true}
            data={{
              datasets: [{ data: data }],
              labels: dates,
            }}
            yAxisInterval={1}
            verticalLabelRotation={-45}
            chartConfig={{
              backgroundColor: colors.tgreen,
              backgroundGradientFrom: colors.tgreen,
              backgroundGradientTo: colors.tgreen,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 10,
            }}
          />
        </View>
        <View style={[styles.decessicontainer, styles.boxes]}>
          <Text style={[styles.title]}>Decessi {death_variation}</Text>
          <Text>In totale {mydata[mylen - 1].deceduti}</Text>
          <LineChart
            width={300} // from react-native
            height={220}
            data={{ datasets: [{ data: data_death }], labels: dates }}
            yAxisInterval={1}
            verticalLabelRotation={-45}
            chartConfig={{
              backgroundColor: colors.ruby,
              backgroundGradientFrom: colors.ruby,
              backgroundGradientTo: colors.ruby,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 0,
              },
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
          />
        </View>
        <View style={[styles.tamponicontainer, styles.boxes]}>
          <Text style={[styles.title]}>
            Tamponi {tamponi} / Testati {testati}
          </Text>
          <Text>In totale {mydata[222].tamponi}</Text>
          <Text>Rapporto positivi/tamponi {rapporto}</Text>
          <Text>Rapporto positivi/testati {rapporto_t}</Text>
          <LineChart
            width={300} // from react-native
            height={260}
            withShadow={false}
            data={{
              datasets: [
                {
                  data: data_postest,
                  color: (opacity = 1) => `rgba(220, 80, 80, ${opacity})`,
                },
                { data: data_postamp },
              ],
              labels: dates,
            }}
            yAxisInterval={1}
            verticalLabelRotation={-45}
            chartConfig={{
              backgroundColor: colors.ogreen,
              backgroundGradientFrom: colors.ogreen,
              backgroundGradientTo: colors.ogreen,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '1',
                strokeWidth: '1',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 10,
            }}
          />
        </View>
        <View style={[styles.hospcontainer, styles.boxes]}>
          <Text style={[styles.title]}>
            Guariti {guariti} / in totale {guariti_tot}
          </Text>
          <Text>
            Terapia intensiva {terapia_intensiva} ({var_terapia_intensiva})
          </Text>
          <Text>
            Ospedalizzati {ospedalizzati} ({var_ospedalizzati})
          </Text>

          <LineChart
            width={300} // from react-native
            height={260}
            withShadow={false}
            data={{ datasets: [{ data: data_ti }], labels: dates }}
            yAxisInterval={1}
            verticalLabelRotation={-45}
            chartConfig={{
              backgroundColor: colors.canary,
              backgroundGradientFrom: colors.canary,
              backgroundGradientTo: colors.canary,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 10,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  boxes: {
    padding: 20,
    width: '100%',
    borderRadius: sizes.radius,
    marginBottom: sizes.base,
  },
  positivicontainer: {
    backgroundColor: colors.tgreen,
  },

  title: {
    fontSize: sizes.biggerfont,
    fontWeight: 'bold',
  },
  decessicontainer: {
    backgroundColor: colors.ruby,
  },
  tamponicontainer: {
    backgroundColor: colors.ogreen,
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
  totali: {
    color: colors.canary,
    fontSize: sizes.title,
    fontWeight: '800',
    marginBottom: 20,
  },
  hospcontainer: {
    backgroundColor: colors.canary,
  },
});
