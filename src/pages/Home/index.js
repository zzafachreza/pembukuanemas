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

export default function Home({ navigation }) {
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
            fontFamily: fonts.secondary[600],
            fontSize: 20,
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
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <Image source={require('../../assets/logo.png')} style={{
          width: 220,
          height: '100%',
          resizeMode: 'contain'
        }} />
      </View>
      <View style={{
        flex: 1,
        alignItems: 'center',
      }}>


        <View style={{
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>

          <TouchableOpacity onPress={() => navigation.navigate('InputData')} style={{
            width: windowWidth / 2.2,
            borderRadius: 10,
            backgroundColor: colors.primary,
            borderWidth: 1,
            height: windowHeight / 5,

            justifyContent: 'center',
            alignItems: 'center',

            marginRight: 10,
            padding: 10,
          }}>
            <Icon type='ionicon' name='duplicate' size={55} color={colors.white} />
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: 18,
              marginTop: 5,
              color: colors.white
            }}>Input Data</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LihatData')} style={{
            width: windowWidth / 2.2,
            borderRadius: 10,
            backgroundColor: colors.primary,
            borderWidth: 1,
            height: windowHeight / 5,

            justifyContent: 'center',
            alignItems: 'center',

            marginRight: 10,
            padding: 10,
          }}>
            <Icon type='ionicon' name='receipt' size={55} color={colors.white} />
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: 18,
              marginTop: 5,
              color: colors.white
            }}>Lihat Data</Text>
          </TouchableOpacity>

        </View>
        <View style={{
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>

          <TouchableOpacity onPress={() => navigation.navigate('Laporan')} style={{
            width: windowWidth / 2.2,
            borderRadius: 10,
            backgroundColor: colors.primary,
            borderWidth: 1,
            height: windowHeight / 5,

            justifyContent: 'center',
            alignItems: 'center',

            marginRight: 10,
            padding: 10,
          }}>
            <Icon type='ionicon' name='bar-chart' size={55} color={colors.white} />
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: 18,
              marginTop: 5,
              color: colors.white
            }}>Laporan Data</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Database')} style={{
            width: windowWidth / 2.2,
            borderRadius: 10,
            backgroundColor: colors.primary,
            borderWidth: 1,
            height: windowHeight / 5,

            justifyContent: 'center',
            alignItems: 'center',

            marginRight: 10,
            padding: 10,
          }}>
            <Icon type='ionicon' name='server' size={55} color={colors.white} />
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: 18,
              marginTop: 5,
              color: colors.white
            }}>Database</Text>
          </TouchableOpacity>

        </View>

      </View>

      <View style={{
        padding: 10,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          textAlign: 'center',
          fontSize: 20
        }}>Toko Emas Permata</Text>
        <Text style={{
          fontFamily: fonts.secondary[400],
          textAlign: 'center',
          fontSize: 14
        }}>Jl. Baturaja No. 324 Tanjung Enim Sumatra Selatan</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})