import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { colors, fonts } from '../../utils'
import moment from 'moment'
import { MyButton } from '../../components'
import { MYAPP } from '../../utils/localStorage'
import SQLite from 'react-native-sqlite-storage';
import { showMessage } from 'react-native-flash-message'
export default function DetailData({ navigation, route }) {
    const item = route.params;


    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }


    const __hapusData = (id) => {


        __conn().transaction(tx => {

            tx.executeSql(`DELETE FROM transaksi WHERE id='${id}'`, [], (tx, res) => {

                console.log(res);

                showMessage({
                    message: 'Data berhasil di hapus !',
                    type: 'success'
                });
                navigation.goBack();
            })

        });

    }

    const MylistData = ({ label, value }) => {
        return (
            <View style={{
                borderBottomWidth: 1,
                paddingBottom: 5,
                borderBottomColor: colors.zavalabs
            }}>
                <Text style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: 15,
                }}>{label}</Text>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 15,
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
                <MylistData label="Berat" value={parseFloat(item.berat).toFixed(2)} />
                <MylistData label="Kadar" value={item.kadar} />
                <MylistData label="Jenis" value={item.jenis} />
                <MylistData label="Harga" value={new Intl.NumberFormat().format(item.harga)} />
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
                                    __hapusData(item.id)
                                }
                            }
                        ])
                    }} title="Hapus transaksi" Icons="trash-outline" warna={colors.danger} />
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 5,
                }}>
                    <MyButton onPress={() => navigation.replace('EditData', item)} title="Edit transaksi" Icons="create-outline" warna={colors.primary} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})