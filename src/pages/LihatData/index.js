import { Alert, StyleSheet, Text, View, PermissionsAndroid, Linking, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { Color, colors, fonts, windowHeight, windowWidth } from '../../utils';
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
import 'moment/locale/id'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
var RNFS = require('react-native-fs');
import Orientation from 'react-native-orientation-locker';
import XLSX from 'xlsx';
export default function LihatData({ navigation, route }) {




    const [loading, setLoading] = useState(false);
    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }
    const isFocused = useIsFocused();
    const [kirim, setKirim] = useState({
        tanggal: moment().format('YYYY-MM-DD')
    })
    const createPDF = async () => {






        let arr = [
            `
            <center><h3>${moment(kirim.tanggal).format('dddd, DD MMMM YYYY')}</h3></center>
            <table width="100%" border="1" style="margin-top:0%;border-collapse:collapse" cellpadding="4">
                <tr>
                    <th>Transaksi</th>
                    <th>No Nota</th>
                    <th>Berat</th>
                    <th>Stok</th>
                    <th>Jenis</th>
                    <th>Barang</th>
                    <th>Harga</th>
                    <th>Pembayaran</th>
                    <th>Nama</th>
                 </tr> `,

        ];

        data.map((item, index) => {

            let thisharga = 0;
            let thisberat = 0;

            if (item.jenis_transaksi == 'Penjualan' || item.jenis_transaksi == 'Tukar Tambah') {
                thisharga = item.harga;
                thisberat = item.berat * -1;
            } else if (item.jenis_transaksi == 'Pembelian') {
                thisharga = item.harga * -1;
                thisberat = item.berat;
            } else {
                thisharga = item.harga;
                thisberat = item.berat;
            }

            arr.push(`<tr>
                      
                       <td>${item.jenis_transaksi}</td>
                       <td>${item.nota}</td>
                        <td>${parseFloat(thisberat).toFixed(2)}</td>
                        <td>${item.kadar}</td>
                        <td>${item.jenis}</td>
                        <td>${item.barang}</td>
                        <td>${new Intl.NumberFormat().format(thisharga)}</td>
                        <td>${item.pembayaran}</td>
                        <td>${item.nama}</td>
                        </tr>`)
        })

        arr.push('</table>')





        let options = {
            html: arr.join(""),
            fileName: 'TokoEmasPermata',
            directory: 'Documents',
            height: 1122.52, width: 793.7,
        };

        let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        // alert(file.filePath);

        await Share.open({
            title: MYAPP,
            message: "Print data",
            url: 'file:///' + file.filePath,
            subject: "Report",
        })
            .then((res) => {
                console.log(res);

            })
            .catch((err) => {
                err && console.log(err);
            });

    }

    const [data, setData] = useState([]);



    useEffect(() => {

        if (isFocused) {
            Orientation.lockToLandscape();
            __getTransaction();
        }


    }, [isFocused]);

    const __getTransaction = (tgl = kirim.tanggal) => {
        __conn().transaction(tx => {
            tx.executeSql(`SELECT * FROM transaksi WHERE tanggal='${tgl}'`, [], (tx, res) => {

                let tmp = [];
                let len = res.rows.length;
                for (let i = 0; i < len; i++) {
                    tmp.push(res.rows.item(i))
                }
                setData(tmp)

            })
        })
    }

    const previewFile = (filePath) => {
        FileViewer.open(filePath)
            .then(() => {
                console.log('Success');
            })
            .catch(_err => {
                console.log(_err);
            });
    }


    // function to handle exporting
    const exportDataToExcel = async () => {

        // Created Sample data
        let sample_data_to_export = [];

        data.map((item, index) => {

            let thisharga = 0;
            let thisberat = 0;

            if (item.jenis_transaksi == 'Penjualan' || item.jenis_transaksi == 'Tukar Tambah') {
                thisharga = item.harga;
                thisberat = item.berat * -1;
            } else if (item.jenis_transaksi == 'Pembelian') {
                thisharga = item.harga * -1;
                thisberat = item.berat;
            } else {
                thisharga = item.harga;
                thisberat = item.berat;
            }

            sample_data_to_export.push({
                jenis_transaksi: item.jenis_transaksi,
                no_nota: item.nota,
                berat: parseFloat(thisberat).toFixed(2),
                stok: item.kadar,
                jenis: item.jenis,
                barang: item.barang,
                harga: new Intl.NumberFormat().format(thisharga),
                metode_pembayaran: item.pembayaran,
                nama: item.nama

            })



        });



        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(sample_data_to_export)
        XLSX.utils.book_append_sheet(wb, ws, "Users")
        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

        // Write generated excel to Storage
        var URLlocal = RNFS.DownloadDirectoryPath + `/download_${moment().format('Ymdhis')}.xlsx`;
        RNFS.writeFile(URLlocal, wbout, 'ascii').then((r) => {

            previewFile(URLlocal);
        }).catch((e) => {
            console.log('Error', e);
        });

    }

    const handleClick = async () => {
        // exportDataToExcel();
        try {
            // Check for Permission (check if permission is already given or not)
            let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            console.log(isPermitedExternalStorage)
            if (!isPermitedExternalStorage) {

                // Ask for permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "Storage permission needed",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );


                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission Granted (calling our exportDataToExcel function)
                    exportDataToExcel();
                    console.log("Permission granted");
                } else {
                    // Permission denied
                    console.log("Permission denied");
                }
            } else {
                // Already have Permission (calling our exportDataToExcel function)
                exportDataToExcel();
            }
        } catch (e) {
            console.log('Error while checking permission');
            console.log(e);
            return
        }

    };




    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 5,
        }}>

            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <MyCalendar nolabel={false} label="Tanggal" value={kirim.tanggal} onDateChange={(date) => {
                        setKirim({
                            ...kirim,
                            tanggal: date
                        });
                        __getTransaction(date)
                    }} />
                </View>

            </View>
            <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: 20,
                textAlign: 'center',
                marginVertical: 10,
            }}>{moment(kirim.tanggal).format('dddd, DD MMM YYYY')}</Text>

            {/* table */}

            <View style={{
                flex: 1,
            }}>

                {/* data */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: colors.primary
                }}>

                    <View style={{ flex: 0.25, backgroundColor: colors.white, margin: 0.3, }}>
                        <Text style={styles.textJudul}>Transaksi</Text>
                    </View>
                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.3, }}>
                        <Text style={styles.textJudul}>No. Nota</Text>
                    </View>
                    <View style={{ flex: 0.25, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Berat</Text>
                    </View>
                    <View style={{ flex: 0.25, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Stok</Text>
                    </View>
                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Jenis</Text>
                    </View>
                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Barang</Text>
                    </View>
                    <View style={{ flex: 0.35, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Harga</Text>
                    </View>
                    <View style={{ flex: 0.35, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Pembayaran</Text>
                    </View>
                    <View style={{ flex: 0.4, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Nama</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>



                    {data.map((item, index) => {

                        let thisharga = 0;
                        let thisberat = 0;

                        if (item.jenis_transaksi == 'Penjualan' || item.jenis_transaksi == 'Tukar Tambah') {
                            thisharga = item.harga;
                            thisberat = item.berat * -1;
                        } else if (item.jenis_transaksi == 'Pembelian') {
                            thisharga = item.harga * -1;
                            thisberat = item.berat;
                        } else {
                            thisharga = item.harga;
                            thisberat = item.berat;
                        }

                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('DetailData', item)} style={{
                                flexDirection: 'row',
                                backgroundColor: colors.primary
                            }}>
                                <View style={{ flex: 0.25, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.jenis_transaksi}</Text>
                                </View>
                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5, }}>
                                    <Text style={styles.textIsi}>{item.nota}</Text>
                                </View>

                                <View style={{ flex: 0.25, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{parseFloat(thisberat).toFixed(2)}</Text>
                                </View>
                                <View style={{ flex: 0.25, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.kadar}</Text>
                                </View>
                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.jenis}</Text>
                                </View>
                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.barang}</Text>
                                </View>
                                <View style={{ flex: 0.35, backgroundColor: colors.white, marginBottom: 0.5, }}>
                                    <Text style={styles.textIsi}>{new Intl.NumberFormat().format(thisharga)}</Text>
                                </View>
                                <View style={{ flex: 0.35, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.pembayaran}</Text>
                                </View>
                                <View style={{ flex: 0.4, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.nama}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            <View style={{
                marginTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    width: '32%'

                }}>
                    <MyButton onPress={createPDF} Icons="print" warna={colors.danger} title="Print" />
                </View>
                <View style={{
                    width: '32%'

                }}>
                    <MyButton onPress={handleClick} Icons="download" warna={colors.success} title="Excel" />
                </View>
                <View style={{
                    width: '32%'

                }}>
                    <MyButton onPress={() => navigation.goBack()} Icons="home" warna={colors.primary} title="Home" />
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    textJudul: {
        fontFamily: fonts.secondary[600],
        fontSize: 10,
        color: colors.black,
        textAlign: 'center'
    },
    textIsi: {
        paddingVertical: 3,
        fontFamily: fonts.secondary[400],
        fontSize: 10,
        color: colors.black,
        textAlign: 'center'
    }
})