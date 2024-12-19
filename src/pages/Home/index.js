import { Alert, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Dimensions, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyHeader, MyInput } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { color } from 'react-native-elements/dist/helpers';
import { launchCamera } from 'react-native-image-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Orientation from 'react-native-orientation-locker';


const MyMenu = ({ onPress, label = "Input Transaksi", icon = "duplicate" }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{
      // backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      width: windowWidth / 2.3,
      borderRadius: 10,
      backgroundColor: colors.primary,
      height: windowWidth / 4,
    }}>
      <View style={{

        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Icon type='ionicon' name={icon} size={50} color={colors.white} />
        <Text style={{
          marginTop: 4,
          fontFamily: fonts.secondary[600],
          fontSize: 10,
          textAlign: 'center',
          color: colors.white,
        }}>{label}</Text>
      </View>


    </TouchableOpacity>
  )
}



export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      Orientation.lockToPortrait();
    }
  }, [isFocused])


  return (
    <SafeAreaView style={{
      flex: 1,

      backgroundColor: colors.white
    }}>
      <View style={{
        // alignItems: 'center',
        flexDirection: 'row',

        padding: 10,

      }}>

        <View style={{
          flex: 1,
          justifyContent: 'center',

        }}>
          <Text style={{
            paddingLeft: 10,
            ...fonts.headline3,
          }}>Pembukuan Toko Emas</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AAAtur')} style={{
          backgroundColor: colors.primary,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          width: 40,
        }}>
          <Image source={require('../../assets/menu.png')} style={{
            width: 18,
            height: 18,
          }} />
        </TouchableOpacity>
      </View>

      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image source={require('../../assets/logo.png')} style={{
          width: 180,
          height: 130,
          resizeMode: 'contain'
        }} />
      </View>

      <View style={{
        flex: 1,
        padding: 10,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
          <MyMenu label="Input Transaksi" icon='cart' onPress={() => navigation.navigate('InputData')} />
          <MyMenu label="Lihat Laporan Laba Rugi" icon='bar-chart' />

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
          <MyMenu label='Lihat Jurnal Harian' onPress={() => navigation.navigate('LihatData')} icon='receipt' />
          <MyMenu label='Lihat Neraca' icon='pie-chart' />

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
          <MyMenu label='Lihat Jurnal Khusus' icon='logo-windows' />
          <MyMenu label='Data Custom' icon='logo-react' />

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
          <MyMenu label='Lihat Balance Barang' onPress={() => navigation.navigate('Laporan')} icon='logo-stackoverflow' />
          <MyMenu label='Data Base' onPress={() => navigation.navigate('Database')} icon='server' />

        </View>


      </View>

      <View style={{
        padding: 10,
      }}>
        <Text style={{
          ...fonts.headline4,
          textAlign: 'center',

        }}>Toko Emas Permata</Text>
        <Text style={{
          ...fonts.caption,
          textAlign: 'center',
        }}>Jl. Baturaja No. 324 Tanjung Enim Sumatra Selatan</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})