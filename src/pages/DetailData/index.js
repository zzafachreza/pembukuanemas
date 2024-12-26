import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native'
import { Color, colors, fonts } from '../../utils'
import moment from 'moment'
import { MyButton } from '../../components'
import { MYAPP } from '../../utils/localStorage'
import SQLite from 'react-native-sqlite-storage';
import { showMessage } from 'react-native-flash-message'
import Orientation from 'react-native-orientation-locker';
import { useIsFocused } from '@react-navigation/native'
export default function DetailData({ navigation, route }) {
    const item = route.params;

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            Orientation.lockToPortrait();
        }
    }, [isFocused])


    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }


    const __hapusData = (id, jenis_transaksi, tanggal, nota) => {
        let TAHUN = moment(tanggal).format('YYYY');
        let BULAN = moment(tanggal).format('MM');



        console.log(id);



        __conn().transaction(tx => {
            let SQLDELETE = `DELETE FROM transaksi WHERE nota='${nota}'`;
            tx.executeSql(SQLDELETE, [], (tx, res) => { })

            tx.executeSql(`SELECT * FROM transaksi WHERE jenis_transaksi='${jenis_transaksi}' AND STRFTIME('${TAHUN}-${BULAN}', tanggal)`, [], (tx, res) => {

                let tmp = [];
                let len = res.rows.length;
                for (let i = 0; i < len; i++) {
                    let notaDELETE = parseInt(nota.toString().substr(-4));
                    let thenota = parseInt(res.rows.item(i).nota.toString().substr(-4))

                    if (thenota > notaDELETE) {
                        let ID = res.rows.item(i).id;
                        let NUMBER = thenota - 1;
                        let NEW_NUMBER = '';

                        if (NUMBER.toString().length == 1) {
                            NEW_NUMBER = '000' + NUMBER
                        } else if (NUMBER.toString().length == 2) {
                            NEW_NUMBER = '00' + NUMBER
                        } else if (NUMBER.toString().length == 3) {
                            NEW_NUMBER = '0' + NUMBER
                        } else if (NUMBER.toString().length == 4) {
                            NEW_NUMBER = NUMBER
                        }
                        let NEW_NOTA = (jenis_transaksi == 'Penjualan' ? 'S' : 'B') + TAHUN + BULAN + NEW_NUMBER;
                        let SQLupdate = `UPDATE transaksi SET nota='${NEW_NOTA}' WHERE id='${ID}'`;


                        tx.executeSql(SQLupdate, [], (tx, res) => { })
                    }
                }


            })

            showMessage({
                type: 'success',
                message: 'Transaksi berhasil di hapus !'
            });
            navigation.goBack();

        })

    }

    const MylistData = ({ label, value }) => {
        return (
            <View style={{
                borderBottomWidth: 1,
                paddingBottom: 5,
                borderBottomColor: Color.blueGray[200],
            }}>
                <Text style={{
                    fontSize: 14,
                    fontFamily: fonts.secondary[700],
                    color: colors.black
                }}>{label}</Text>
                <Text style={{
                    ...fonts.caption,
                    fontSize: 14,
                }}>{value}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 20,
        }}>
            <View style={{
                flex: 1,
            }}>
                <MylistData label="Tanggal" value={moment(item.tanggal).format('dddd, DD MMMM YYYY')} />
                <MylistData label="Kode Transaksi" value={item.jenis_transaksi} />

                <MylistData label="No. Nota" value={item.nota} />
                <MylistData label="Berat" value={parseFloat(item.berat).toFixed(2)} />
                <MylistData label="Stok" value={item.kadar} />
                <MylistData label="Jenis" value={item.jenis} />
                <MylistData label="Barang" value={item.barang} />
                <MylistData label="Harga" value={new Intl.NumberFormat().format(item.harga)} />
                <MylistData label="Pembayaran" value={item.pembayaran} />
                <MylistData label="Nama" value={item.nama} />
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1,
                    paddingRight: 5,
                }}>
                    <MyButton onPress={() => {
                        Alert.alert(MYAPP, 'Apakah kamu yakin akan hapus transaksi ini ?', [
                            { text: 'tidak' },
                            {
                                text: 'Hapus',
                                onPress: () => {
                                    __hapusData(item.id, item.jenis_transaksi, item.tanggal, item.nota)
                                }
                            }
                        ])
                    }} title="Hapus" Icons="trash-outline" warna={colors.danger} />
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 5,
                }}>
                    <MyButton onPress={() => navigation.replace('EditData', item)} title="Edit" Icons="create-outline" warna={colors.primary} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})