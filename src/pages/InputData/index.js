import { Alert, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyHeader, MyInput, MyPicker } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import DatePicker from 'react-native-datepicker'
import { maskJs, maskCurrency } from 'mask-js';
import moment from 'moment';
import SQLite from 'react-native-sqlite-storage';

export default function InputData({ navigation, route }) {

    const [loading, setLoading] = useState(false);

    const [kirim, setKirim] = useState({
        tanggal: moment().format('YYYY-MM-DD'),
        jenis_transaksi: 'Penjualan',
        berat: '',
        kadar: 'LM Antam',
        jenis: 'Anting',
        harga: ''
    })


    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }


    const sendServer = () => {
        console.log(kirim);

        // __conn().transaction(tx => {

        //     tx.executeSql(`INSERT INTO transaksi(tanggal,jenis_transaksi,berat,kadar,jenis,harga) VALUES('${kirim.tanggal}','${kirim.jenis_transaksi}','${kirim.berat}','${kirim.kadar}','${kirim.jenis}','${kirim.harga}')`, [], (tx, res) => {

        //         console.log(res);
        //         console.log('berhasil');
        //         showMessage({
        //             message: 'Data berhasil di simpan !',
        //             type: 'success'
        //         });
        //         setKirim({
        //             tanggal: moment().format('YYYY-MM-DD'),
        //             jenis_transaksi: 'Penjualan',
        //             berat: '',
        //             kadar: 'LM Antam',
        //             jenis: 'Anting',
        //             harga: ''
        //         })
        //     })

        // });

    }



    useEffect(() => {


    }, []);




    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 20,
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <DatePicker
                    style={{ width: '100%' }}
                    date={kirim.tanggal}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            borderRadius: 10,
                            borderWidth: 0,
                            height: 45,
                            backgroundColor: colors.zavalabs
                        }
                        // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => setKirim({
                        ...kirim,
                        tanggal: date
                    })}
                />
                <MyGap jarak={10} />
                <MyPicker label="Jenis Transaksi" iconname="cart" onValueChange={x => setKirim({
                    ...kirim,
                    jenis_transaksi: x
                })} value={kirim.jenis_transaksi} data={[
                    { label: 'Penjualan', value: 'Penjualan' },
                    { label: 'Pembelian', value: 'Pembelian' },

                    { label: 'Tukar Tambah', value: 'Tukar Tambah' },
                    { label: 'Tukar Kurang', value: 'Tukar Kurang' },
                ]} />
                <MyGap jarak={10} />
                <MyInput iconname="speedometer" label="Berat (gram)" value={kirim.berat} onChangeText={x => setKirim({
                    ...kirim,
                    berat: x
                })} keyboardType='decimal-pad' />
                <MyGap jarak={10} />
                <MyPicker label="Kadar" iconname="aperture" onValueChange={x => setKirim({
                    ...kirim,
                    kadar: x
                })} value={kirim.kadar} data={[

                    { label: 'LM Antam', value: 'LM Antam' },
                    { label: 'LM UBS', value: 'LM UBS' },
                    { label: 'LM Hartadinata', value: 'LM Hartadinata' },
                    { label: 'LM Lain Lain', value: 'LM Lain Lain' },
                    { label: '99%', value: '99%' },
                    { label: '95%', value: '95%' },
                    { label: '91,6%', value: '91,6%' },
                    { label: '90%', value: '90%' },
                    { label: '80%', value: '80%' },
                    { label: '75%', value: '75%' },
                    { label: '70%', value: '70%' },
                    { label: '42%', value: '42%' },
                    { label: '37,5%', value: '37,5%' },
                    { label: '30%', value: '30%' },
                    { label: 'Suasa', value: 'Suasa' },
                    { label: 'Lebur Perak', value: 'Lebur Perak' },
                    { label: 'Lebur Tembaga', value: 'Lebur Tembaga' },
                    { label: 'Pengembangan 1', value: 'Pengembangan 1' },
                    { label: 'Pengembangan 2', value: 'Pengembangan 2' },
                    { label: 'Pengembangan 3', value: 'Pengembangan 3' },

                ]} />
                <MyGap jarak={10} />
                <MyPicker label="Jenis" iconname="options" onValueChange={x => setKirim({
                    ...kirim,
                    jenis: x
                })} value={kirim.jenis} data={[
                    { label: 'Anting', value: 'Anting' },
                    { label: 'Cincin', value: 'Cincin' },
                    { label: 'Gelang', value: 'Gelang' },
                    { label: 'Kalung', value: 'Kalung' },
                    { label: 'Liontin', value: 'Liontin' },
                    { label: 'Batangan', value: 'Batangan' },
                    { label: 'Lain Lain', value: 'Lain Lain' },
                ]} />
                <MyGap jarak={10} />
                <MyInput iconname="pricetag" label="Harga (Rp dalam K)" value={kirim.harga} onChangeText={x => setKirim({
                    ...kirim,
                    harga: x
                })} keyboardType='decimal-pad' />
            </ScrollView>

            <MyGap jarak={20} />
            {!loading && <MyButton onPress={sendServer} title="SIMPAN" warna={colors.foourty} Icons="save-outline" />}

            {loading && <ActivityIndicator size="large" color={colors.primary} />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})