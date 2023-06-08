import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { fonts, windowWidth, colors } from '../../utils';
import { MyInput, MyGap, MyButton } from '../../components';
import axios from 'axios';
import { apiURL, api_token, MYAPP, storeData } from '../../utils/localStorage';
import { showMessage } from 'react-native-flash-message';
import SQLite from 'react-native-sqlite-storage';

export default function ({ navigation }) {

  const [kirim, setKirim] = useState({
    api_token: api_token,
    password: null
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {

  }, [])

  const masuk = () => {
    const MYDB = SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
      console.log("Database OPENED");
    }, () => {
      console.log("SQL Error: " + err);
    })



    if (kirim.password == null) {
      Alert.alert(MYAPP, 'Kode Akses Harus di isi !');
    } else {

      if (kirim.password !== 'sbalavaz') {
        Alert.alert(MYAPP, 'Kode Akses salah !');
      } else {
        // setLoading(true);
        console.log(kirim);

        MYDB.transaction((tx) => {
          tx.executeSql("CREATE TABLE IF NOT EXISTS transaksi (id integer PRIMARY KEY AUTOINCREMENT, tanggal date NOT NULL,jenis_transaksi text NOT NULL,berat double NOT NULL,kadar text NOT NULL,jenis text NOT NULL,harga double NOT NULL)", [], (tx, results) => {
            console.log("Query Create Table is completed");
            navigation.replace('Home');
            storeData('user', {
              password: kirim.password,
            });
          });
        });


      }







    }




  }

  useEffect(() => {

    // const backAction = () => {
    //   Alert.alert("Info Wks", "Apakah kamu yakin akan keluar aplikasi ?", [
    //     {
    //       text: "Cancel",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );

    // return () => backHandler.remove();
  }, [])

  return (
    <>
      <ScrollView style={{ padding: 10, flex: 1, backgroundColor: colors.white, position: 'relative' }}>


        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingTop: 10 }}>

          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>

            <Image
              source={require('../../assets/logo.png')}
              style={
                {
                  width: windowWidth / 1.7,
                  height: windowWidth / 2,
                  resizeMode: 'contain'
                }
              }
            />



          </View>


        </View>
        <MyGap jarak={10} />
        <View style={{ padding: 10, marginVertical: 10, flex: 1 }}>
          <MyInput autoFocus
            onChangeText={val => setKirim({
              ...kirim,
              password: val
            })}
            fontSize={20}
            secureTextEntry={true}
            label="Kode Akses"
            iconname="lock-closed"
            placeholder="Masukan kata sandi"
          />
          <MyGap jarak={30} />
          {!loading &&


            <MyButton
              onPress={masuk}
              title="Masuk"
              warna={colors.foourty}
              Icons="log-in-outline"
            />

          }

        </View>
        {loading && <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>}
      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({});
