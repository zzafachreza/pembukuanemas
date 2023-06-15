import { SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, View, PermissionsAndroid, Alert } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'
import { colors, fonts } from '../../utils'

import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { MYAPP } from '../../utils/localStorage';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isCancel,
    isInProgress,
    types,
} from 'react-native-document-picker'
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
export default function Database({ navigation, route }) {

    const izinDownload = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Izinkan simpan data',
                    message: 'Izinkan simpan data',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const izinUpoad = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Izinkan simpan data',
                    message: 'Izinkan simpan data',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };


    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }



    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 20,
        }}>
            <TouchableNativeFeedback onPress={async () => {


                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Izinkan simpan data',
                            message: 'Izinkan simpan data',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {


                        __conn().transaction(tx => {

                            tx.executeSql(`SELECT * FROM transaksi`, [], (tx, res) => {

                                let tmp = [`INSERT OR IGNORE  INTO transaksi(id,tanggal,jenis_transaksi,kadar,jenis,harga,berat) VALUES`];
                                let len = res.rows.length;
                                for (let i = 0; i < len; i++) {
                                    // tmp.push(res.rows.item(i))
                                    if ((parseInt(i + 1)) == res.rows.length) {
                                        tmp.push(`('${res.rows.item(i).id}','${res.rows.item(i).tanggal}','${res.rows.item(i).jenis_transaksi}','${res.rows.item(i).kadar}','${res.rows.item(i).jenis}','${res.rows.item(i).harga}','${res.rows.item(i).berat}');`)
                                    } else {
                                        tmp.push(`('${res.rows.item(i).id}','${res.rows.item(i).tanggal}','${res.rows.item(i).jenis_transaksi}','${res.rows.item(i).kadar}','${res.rows.item(i).jenis}','${res.rows.item(i).harga}','${res.rows.item(i).berat}'),`)
                                    }

                                }

                                console.log(tmp.join(""));


                                var path = RNFS.ExternalStorageDirectoryPath + `/Download/zavalabs_${moment().format('YYMMDD')}.txt`;

                                RNFS.writeFile(path, tmp.join(""), 'utf8')
                                    .then((success) => {
                                        console.log('FILE WRITTEN!', path);
                                        Alert.alert('Berhasil di simpan di folder download !', `zavalabs_${moment().format('YYMMDD')}.txt`)

                                        // Share.open({
                                        //     title: MYAPP,
                                        //     message: "Print data",
                                        //     url: 'file:///' + path,
                                        //     subject: "Report",
                                        // })
                                        //     .then((res) => {
                                        //         console.log(res);

                                        //     })
                                        //     .catch((err) => {
                                        //         err && console.log(err);
                                        //     });
                                    })
                                    .catch((err) => {
                                        console.log(err.message);
                                    });

                            })

                        });










                    } else {

                    }
                } catch (err) {
                    console.warn(err);
                }



            }}>
                <View style={{
                    flex: 1,
                    borderWidth: 2,
                    backgroundColor: colors.black,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                }}>
                    <Icon type='ionicon' name='download' size={50} color={colors.white} />
                    <Text style={{
                        marginTop: 10,
                        fontFamily: fonts.secondary[600],
                        fontSize: 30,
                        color: colors.white
                    }}>Backup Data</Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={async () => {
                try {
                    const pickerResult = await DocumentPicker.pickSingle({
                        type: types.plainText
                    })
                    let textSQL = await RNFS.readFile(pickerResult.uri, "utf8");
                    console.log(textSQL);

                    __conn().transaction(tx => {

                        tx.executeSql(textSQL, [], (tx, res) => {
                            showMessage({
                                type: 'success',
                                message: 'Data berahasil di import !'
                            })

                        })
                    })


                } catch (e) {
                    handleError(e)
                }
            }}>
                <View style={{
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                    borderWidth: 2,
                    borderColor: colors.black,
                    flex: 1,
                    backgroundColor: colors.white
                }}>
                    <Icon type='ionicon' name='cloud-upload' size={50} color={colors.black} />
                    <Text style={{
                        marginTop: 10,
                        fontFamily: fonts.secondary[600],
                        fontSize: 30,
                        color: colors.black
                    }}>Restore Data</Text>
                </View>
            </TouchableNativeFeedback>
            {/* <TouchableNativeFeedback onPress={() => {
                Alert.alert(MYAPP, 'Apakah kamu yakin akan bersihkan semua data ini ?', [
                    { text: 'TIDAK' },
                    {
                        text: 'CLEAR DATA',
                        onPress: () => {

                            __conn().transaction(tx => {

                                tx.executeSql(`DELETE FROM transaksi`, [], (tx, res) => {
                                    showMessage({
                                        type: 'success',
                                        message: 'Data berahasil di clear !'
                                    })

                                })

                            });
                        }
                    }
                ])
            }}>
                <View style={{
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                    borderWidth: 2,
                    borderColor: colors.danger,
                    flex: 1,
                    backgroundColor: colors.danger
                }}>
                    <Icon type='ionicon' name='trash' size={50} color={colors.white} />
                    <Text style={{
                        marginTop: 10,
                        fontFamily: fonts.secondary[600],
                        fontSize: 30,
                        color: colors.white
                    }}>Clear Data</Text>
                </View>
            </TouchableNativeFeedback> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})