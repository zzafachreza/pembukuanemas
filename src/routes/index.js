import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Splash,
  Home,
  Login,
  Register,
  SCek,
  SPenyakit,
  STentang,
  SHasil,
  SDaftar,
  SAdd,
  SHutang,
  GetStarted,
  TimAdd,
  TimList,
  TimDetail,
  TimAddPemain,
  TimSet,
  TimSetDetail,
  TimMulai,
  TimHasil,
  Account,
  Riwayat,
  Anggota,
  AnggotaDetail,
  AnggotaAdd,
  Kegiatan,
  KegiatanAdd,
  AccountEdit,
  Pengguna,
  PenggunaAdd,
  PenggunaEdit,
  SliderAdd,
  Slider,
  AktifitasAdd,
  Aktifitas,
  AktifitasLaporan,
  AktifitasDetail,
  AANilai,
  AAMateri,
  AAMateriVideo,
  AAMateriPdf,
  AATesawal,
  AATesAkhir,
  AATesglobal,
  AASubbab,
  AAInput,
  AABidan,
  AAKategori,
  AAAtur,
  AAKategoriSeks,
  STentangApp,
  InputData,
  LihatData,
  LaporanHarian,
  LaporanBulanan,
  DetailData,
  EditData,
  Laporan,
  Database,
} from '../pages';
import { colors } from '../utils';
import { Icon } from 'react-native-elements';

const Stack = createStackNavigator();

export default function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />




      <Stack.Screen
        name="AAAtur"
        component={AAAtur}
        options={{
          headerShown: false,
        }}
      />




      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          // headerTitle: 'Detail',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />


      <Stack.Screen
        name="InputData"
        component={InputData}
        options={{
          headerShown: true,
          headerTitle: 'Input Data',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="LihatData"
        component={LihatData}
        options={{
          headerShown: true,
          headerTitle: 'Lihat Data',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="LaporanHarian"
        component={LaporanHarian}
        options={{
          headerShown: true,
          headerTitle: 'Proses Data Harian',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="LaporanBulanan"
        component={LaporanBulanan}
        options={{
          headerShown: true,
          headerTitle: 'Proses Data Bulanan',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />




      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,

        }}
      />
      <Stack.Screen
        name="AccountEdit"
        component={AccountEdit}
        options={{
          headerShown: true,
          headerTitle: 'Buat Tabel',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: '#000',
        }}
      />

      <Stack.Screen
        name="DetailData"
        component={DetailData}
        options={{
          headerShown: true,
          headerTitle: 'Detail Data',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFF',
        }}
      />

      <Stack.Screen
        name="EditData"
        component={EditData}
        options={{
          headerShown: true,
          headerTitle: 'Edit Data',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFF',
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Laporan"
        component={Laporan}
        options={{
          headerShown: true,
          headerTitle: 'Laporan Data',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFF',
        }}
      />

      <Stack.Screen
        name="Database"
        component={Database}
        options={{
          headerShown: true,
          headerTitle: 'Database',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFF',
        }}
      />


    </Stack.Navigator>
  );
}
