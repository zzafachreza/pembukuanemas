import { Alert, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyCalendar, MyGap, MyHeader, MyInput, MyPicker } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import DatePicker from 'react-native-datepicker'
import { maskJs, maskCurrency } from 'mask-js';
import moment from 'moment';
import SQLite from 'react-native-sqlite-storage';

export default function EditData({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    console.log({
        harga: `${parseFloat(route.params.harga).toString()}`,
        berat: parseFloat(route.params.berat).toString(),
        ...route.params,
    })

    const [kirim, setKirim] = useState({
        harga: route.params.harga.toString(),
        berat: route.params.berat.toString(),
        ...route.params
    });



    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }


    const sendServer = () => {
        console.log(kirim);

        __conn().transaction(tx => {

            tx.executeSql(`UPDATE transaksi SET
                berat='${kirim.berat}',
                harga='${kirim.harga}',
                jenis='${kirim.jenis}',
                nota='${kirim.nota}',
                barang='${kirim.barang}',
                nama='${kirim.nama}',
                pembayaran='${kirim.pembayaran}',
                jenis_transaksi='${kirim.jenis_transaksi}',
                kadar='${kirim.kadar}',
                tanggal='${kirim.tanggal}'
                WHERE id='${kirim.id}'

            `, [], (tx, res) => {

                console.log(res)

                showMessage({
                    message: 'Data berhasil di edit !',
                    type: 'success'
                });
                navigation.goBack();
            })

        });

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

                <MyGap jarak={10} />
                {kirim.pilihan == 'Isi Sendiri' &&

                    <MyInput label="Jenis Transaksi" placeholder="Isi sendiri jenis transaksi" iconname="cart" onChangeText={x => setKirim({
                        ...kirim,
                        jenis_transaksi: ''
                    })} />
                }
                {kirim.pilihan !== 'Isi Sendiri' &&

                    <MyPicker label="Jenis Transaksi" iconname="cart" onValueChange={x => setKirim({
                        ...kirim,
                        jenis_transaksi: x,
                        pilihan: x,
                    })} value={kirim.jenis_transaksi} data={[
                        { label: 'Penjualan', value: 'Penjualan' },
                        { label: 'Pembelian', value: 'Pembelian' },
                        { label: 'Isi Sendiri', value: 'Isi Sendiri' },
                    ]} />
                }
                <MyGap jarak={10} />
                <MyCalendar label="Tanggal" value={kirim.tanggal} onDateChange={x => setKirim({ ...kirim, tanggal: x })} />
                <MyGap jarak={10} />
                <MyInput iconname="speedometer" label="No. Nota" value={kirim.nota} onChangeText={x => setKirim({
                    ...kirim,
                    nota: x
                })} />
                <MyGap jarak={10} />
                <MyGap jarak={10} />
                <MyInput iconname="speedometer" label="Berat" value={kirim.berat.toString()} onChangeText={x => setKirim({
                    ...kirim,
                    berat: x
                })} keyboardType='decimal-pad' />
                <MyGap jarak={10} />
                <MyPicker label="Stok" iconname="aperture" onValueChange={x => setKirim({
                    ...kirim,
                    kadar: x
                })} value={kirim.kadar} data={[
                    { label: 'LM', value: 'LM' },
                    { label: 'MM', value: 'MM' },
                    { label: '24K', value: '24K' },
                    { label: '23K', value: '23K' },
                    { label: '22K', value: '22K' },
                    { label: '21K', value: '21K' },
                    { label: '20K', value: '20K' },
                    { label: '19K', value: '19K' },
                    { label: '18K', value: '18K' },
                    { label: '17K', value: '17K' },
                    { label: '16K', value: '16K' },
                    { label: '15K', value: '15K' },
                    { label: '14K', value: '14K' },
                    { label: '13K', value: '13K' },
                    { label: '12K', value: '12K' },
                    { label: '11K', value: '11K' },
                    { label: '10K', value: '10K' },
                    { label: '9K', value: '9K' },
                    { label: '8K', value: '8K' },
                    { label: '7K', value: '7K' },
                    { label: '6K', value: '6K' },
                    { label: '5K', value: '5K' },
                    { label: '4K', value: '4K' },
                    { label: '3K', value: '3K' },
                    { label: '2K', value: '2K' },
                    { label: '1K', value: '1K' },
                    { label: 'ERP', value: 'ERP' },
                    { label: 'ERT', value: 'ERT' },
                    { label: 'LL1', value: 'LL1' },
                    { label: 'LL2', value: 'LL2' },
                    { label: 'LL3', value: 'LL3' },

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
                    { label: 'Gabungan', value: 'Gabungan' },
                    { label: 'Lain Lain', value: 'Lain Lain' },
                ]} />
                <MyGap jarak={10} />
                <MyInput iconname="cube" label="Barang" value={kirim.barang} onChangeText={x => setKirim({
                    ...kirim,
                    barang: x
                })} />
                <MyGap jarak={10} />

                <MyInput iconname="pricetag" label="Harga" value={kirim.harga.toString()} onChangeText={x => setKirim({
                    ...kirim,
                    harga: x
                })} keyboardType='decimal-pad' />

                <MyGap jarak={10} />
                <MyPicker label="Metode Pembayaran" iconname="list" onValueChange={x => setKirim({
                    ...kirim,
                    pembayaran: x
                })} value={kirim.pembayaran} data={[
                    { label: 'Tunai', value: 'Tunai' },
                    { label: 'BCA', value: 'BCA' },
                    { label: 'BRI', value: 'BRI' },
                    { label: 'BNI', value: 'BNI' },
                    { label: 'Mandiri', value: 'Mandiri' },
                    { label: 'Piutang', value: 'Piutang' },
                    { label: 'Utang', value: 'Utang' },
                    { label: 'BCA + Tunai', value: 'BCA + Tunai' },
                    { label: 'BRI + Tunai', value: 'BRI + Tunai' },
                    { label: 'BNI + Tunai', value: 'BNI + Tunai' },
                    { label: 'Mandiri + Tunai', value: 'Mandiri + Tunai' },
                    { label: 'BCA + Lain', value: 'BCA + Lain ' },
                    { label: 'BRI + Lain', value: 'BRI + Lain' },
                    { label: 'BNI + Lain', value: 'BNI + Lain' },
                    { label: 'Mandiri + Lain', value: 'Mandiri + Lain' },
                ]} />
                <MyGap jarak={10} />
                <MyInput iconname="person" label="Nama" value={kirim.nama} onChangeText={x => setKirim({
                    ...kirim,
                    nama: x
                })} />
                <MyGap jarak={10} />
            </ScrollView>

            <MyGap jarak={20} />
            {!loading && <MyButton onPress={sendServer} title="UPDATE" warna={colors.primary} Icons="save-outline" />}

            {loading && <ActivityIndicator size="large" color={colors.primary} />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})