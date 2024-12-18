import { Alert, StyleSheet, Text, View, PermissionsAndroid, Linking } from 'react-native'
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
import 'moment/locale/id'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';


export default function Laporan({ navigation, route }) {

    const [loading, setLoading] = useState(true);
    const __conn = () => {
        return SQLite.openDatabase("zavalabs.db", "1.0", "zavalabs_emas", 200000, () => {
            // console.log("Database OPENED");
        }, () => {
            console.log("SQL Error: " + err);
        })
    }


    const isFocused = useIsFocused();
    const [kirim, setKirim] = useState({
        kadar: 'LM',
        tanggal_awal: moment().format('YYYY-MM-DD'),
        tanggal_akhir: moment().format('YYYY-MM-DD'),
    })
    const createPDF = async () => {


        // console.log('hasil beli : ', beli);
        // console.log('hasil jual : ', jual);
        // console.log('hasil tukar tambah : ', tukarTambah);
        // console.log('hasil tuakr kurang : ', tukarKurang);
        // console.log('hasil total out : ', totalout);
        // console.log('hasil total in : ', totalin);




        let arr =
            `

            <table width="100%" border="1" style="margin-top:5%;border-collapse:collapse" cellpadding="4">
                <tr>
                    <th>Stok</th>
                    <th>Tanggal</th>
                 </tr> 

                 <tr>
                    <td style="text-align:center">${kirim.kadar}</td>
                    <td style="text-align:center">${moment(kirim.tanggal_awal).format('DD MMMM YYYY')} s/d ${moment(kirim.tanggal_akhir).format('DD MMMM YYYY')}</td>
                 </tr>

            </table>
            
            <table width="100%" border="1" style="margin-top:5%;border-collapse:collapse" cellpadding="4">
               <tr>
                        <th>Berat Penjualan</th>
                        <td style="text-align:center" >${parseFloat(jual[0]).toFixed(2)}</td>
               <tr>
               <tr>
                        <th>Berat Pembelian</th>
                         <td style="text-align:center" >${parseFloat(beli[0]).toFixed(2)}</td>
               </tr>

               <tr>
                    <th>Sisa Barang</th>
                    <td style="text-align:center" >${parseFloat(beli[0] - jual[0]).toFixed(2)}</td>
                 </tr>

                 <tr>
                    <th colspan="2"></th>
                 <tr>
                  <tr>
                        <th>Uang Penjualan</th>
                        <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(jual[1]))}</td>
                 <tr>
                  <tr>
                        <th>Uang Pembelian</th>
                        <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(beli[1]))}</td>
                 <tr>
                   <tr>
                    <th>Sisa Uang</th>
                    <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(jual[1] - beli[1]))}</td>
                 </tr>
                 <tr>
                    <th colspan="2"></th>
                 <tr>
                 <tr>
                    <th>Uang Rata-rata Penjualan</th>
                     <td style="text-align:center" >${parseFloat(jual[1] / jual[0]).toFixed(2)}</td>
              </tr>
              <tr>
                <th>Rata-rata Pembelian</th>
                <td style="text-align:center" >${parseFloat(beli[1] / beli[0]).toFixed(2)}</td>
               </tr>

               
                 
                
             
                </table>
                 `;






        let options = {
            html: arr,
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

    const MyDataInfo = ({ label, value }) => {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    color: colors.black,
                    fontSize: 12
                }}>{label}</Text>
                <Text style={{
                    fontFamily: fonts.secondary[400],
                    color: colors.black,
                    fontSize: 12
                }}>{value}</Text>
            </View>
        )
    }


    const MyDataInfo2 = ({ label, value }) => {
        return (
            <View style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                paddingVertical: 5,
            }}>
                <Text style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    color: colors.black,
                    fontSize: 12
                }}>{label}</Text>
                <Text style={{
                    fontFamily: fonts.secondary[800],
                    color: colors.black,
                    fontSize: 12
                }}>{value}</Text>
            </View>
        )
    }

    const [data, setData] = useState({});

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
        let sample_data_to_export = [

            ['Stok', kirim.kadar],
            ['Tanggal', kirim.tanggal_awal, kirim.tanggal_akhir],

            ['Berat Penjualan', parseFloat(jual[0]).toFixed(2)],
            ['Berat Pembelian', parseFloat(beli[0]).toFixed(2)],

            ['Uang Penjualan', new Intl.NumberFormat().format(parseFloat(jual[1]))],
            ['Uang Pembelian', new Intl.NumberFormat().format(parseFloat(beli[1]))],

            ['Uang Rata-Rata Penjualan', parseFloat(jual[1] / jual[0]).toFixed(2)],
            ['Uang Rata-Rata Pembelian', parseFloat(beli[1] / beli[0]).toFixed(2)],
        ];

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



    useEffect(() => {

        if (isFocused) {

        }


    }, [isFocused]);



    const sendServer = async () => {



        getSQdata(0, 'beli_berat', 'berat', 'Pembelian', 'SUM', beli)
        getSQdata(1, 'beli_harga', 'harga', 'Pembelian', 'SUM', beli)
        getSQdata(2, 'beli_avg', 'harga', 'Pembelian', 'AVG', beli)

        getSQdata(0, 'jual_berat', 'berat', 'Penjualan', 'SUM', jual)
        getSQdata(1, 'jual_harga', 'harga', 'Penjualan', 'SUM', jual)
        getSQdata(2, 'jual_avg', 'harga', 'Penjualan', 'AVG', jual)

        getSQdata(0, 'tukar_tambah_berat', 'berat', 'Tukar Tambah', 'SUM', tukarTambah)
        getSQdata(1, 'tukar_tambah_harga', 'harga', 'Tukar Tambah', 'SUM', tukarTambah)
        getSQdata(2, 'tukar_tambah_avg', 'harga', 'Tukar Tambah', 'AVG', tukarTambah)

        getSQdata(0, 'tukar_kurang_berat', 'berat', 'Tukar Kurang', 'SUM', tukarKurang)
        getSQdata(1, 'tukar_kurang_harga', 'harga', 'Tukar Kurang', 'SUM', tukarKurang)
        getSQdata(2, 'tukar_kurang_avg', 'harga', 'Tukar Kurang', 'AVG', tukarKurang)


        getSQdataTotalOut(0, 'totalout_kurang_berat', 'berat', 'Tukar Kurang', 'SUM', totalout)
        getSQdataTotalOut(1, 'totalout_kurang_harga', 'harga', 'Tukar Kurang', 'SUM', totalout)
        getSQdataTotalOut(2, 'totalout_kurang_avg', 'harga', 'Tukar Kurang', 'AVG', totalout)

        getSQdataTotalIn(0, 'totalin_kurang_berat', 'berat', 'Tukar Kurang', 'SUM', totalin)
        getSQdataTotalIn(1, 'totalin_kurang_harga', 'harga', 'Tukar Kurang', 'SUM', totalin)
        getSQdataTotalIn(2, 'totalin_kurang_avg', 'harga', 'Tukar Kurang', 'AVG', totalin)


        setTimeout(() => {
            setLoading(false)
        }, 1000)





    }



    const [beli, setbeli] = useState([]);
    const [jual, setJual] = useState([]);
    const [tukarTambah, setTukarTambah] = useState([]);
    const [tukarKurang, setTukarKurang] = useState([]);

    const [totalout, setTotalOut] = useState([]);
    const [totalin, setTotalIn] = useState([]);

    const getSQdata = (idx, label, kolom, jenis_trx, rumus, arr) => {
        __conn().transaction(tx => {
            tx.executeSql(`SELECT ${rumus}(${kolom}) ${label} FROM transaksi WHERE jenis_transaksi='${jenis_trx}' AND kadar='${kirim.kadar}' AND tanggal BETWEEN '${kirim.tanggal_awal}' AND '${kirim.tanggal_akhir}'`, [], (tx, res) => {

                let tmp = arr;
                tmp[idx] = parseFloat(res.rows.item(0)[label])
                setCek(arr);
                console.log(res.rows.item(0)[label]);
            })
        })

    }

    const getSQdataTotalOut = (idx, label, kolom, jenis_trx, rumus, arr) => {
        __conn().transaction(tx => {
            tx.executeSql(`SELECT ${rumus}(${kolom}) ${label} FROM transaksi WHERE jenis_transaksi in('Penjualan','Tukar Tambah') AND kadar='${kirim.kadar}' AND tanggal BETWEEN '${kirim.tanggal_awal}' AND '${kirim.tanggal_akhir}'`, [], (tx, res) => {

                let tmp = arr;
                tmp[idx] = parseFloat(res.rows.item(0)[label])
                setCek(arr);
                console.log(res.rows.item(0)[label]);
            })
        })

    }

    const getSQdataTotalIn = (idx, label, kolom, jenis_trx, rumus, arr) => {
        __conn().transaction(tx => {
            tx.executeSql(`SELECT ${rumus}(${kolom}) ${label} FROM transaksi WHERE jenis_transaksi in('Pembelian','Tukar Kurang') AND kadar='${kirim.kadar}' AND tanggal BETWEEN '${kirim.tanggal_awal}' AND '${kirim.tanggal_akhir}'`, [], (tx, res) => {

                let tmp = arr;
                tmp[idx] = parseFloat(res.rows.item(0)[label])
                setCek(arr);
                console.log(res.rows.item(0)[label]);
            })
        })

    }






    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 5,
        }}>

            <ScrollView>
                <View style={{
                    paddingHorizontal: 10,
                }}>
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

                    <MyGap jarak={5} />
                    <MyCalendar label="Dari" value={kirim.tanggal_awal} onDateChange={x => setKirim({ ...kirim, tanggal_awal: x })} />
                    <MyGap jarak={5} />
                    <MyCalendar label="Sampai" value={kirim.tanggal_akhir} onDateChange={x => setKirim({ ...kirim, tanggal_akhir: x })} />
                    <MyGap jarak={10} />
                    <MyButton onPress={sendServer} warna={colors.danger} title="Proses Data" Icons="refresh" />
                </View>






                {!loading &&




                    <View style={{
                        marginTop: 10,
                    }}>


                        <View style={{
                            borderWidth: 1,
                            margin: 5,
                            borderRadius: 10,
                            overflow: 'hidden',
                            borderColor: colors.border
                        }}>

                            <MyGap jarak={10} />
                            <MyDataInfo2 label="Berat Penjualan" value={parseFloat(jual[0]).toFixed(2)} />
                            <MyDataInfo2 label="Berat Pembelian" value={parseFloat(beli[0]).toFixed(2)} />
                            <MyDataInfo2 label="Sisa Barang" value={parseFloat(beli[0] - jual[0]).toFixed(2)} />
                            <MyGap jarak={10} border />
                            <MyDataInfo2 label="Uang Penjualan" value={new Intl.NumberFormat().format(parseFloat(jual[1]))} />
                            <MyDataInfo2 label="Uang Pembelian" value={new Intl.NumberFormat().format(parseFloat(beli[1]))} />
                            <MyDataInfo2 label="Sisa uang" value={new Intl.NumberFormat().format(parseFloat(jual[1] - beli[1]))} />
                            <MyGap jarak={10} border />
                            <MyDataInfo2 label="Uang Rata-rata Penjualan" value={parseFloat(jual[1] / jual[0]).toFixed(2)} />
                            <MyDataInfo2 label="Uang Rata-rata Pembelian" value={parseFloat(beli[1] / beli[0]).toFixed(2)} />




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


                    </View>

                }


            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    textJudul: {
        fontFamily: fonts.secondary[600],
        fontSize: 12,
        color: colors.black,
        textAlign: 'center'
    },
    textIsi: {
        paddingVertical: 3,
        fontFamily: fonts.secondary[400],
        fontSize: 11,
        color: colors.black,
        textAlign: 'center'
    }
})