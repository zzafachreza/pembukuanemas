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
import 'moment/locale/id'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
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
        kadar: 'LM Antam',
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
                    <th>Kadar</th>
                    <th>Tanggal</th>
                 </tr> 

                 <tr>
                    <td style="text-align:center">${kirim.kadar}</td>
                    <td style="text-align:center">${moment(kirim.tanggal_awal).format('DD MMMM YYYY')} s/d ${moment(kirim.tanggal_akhir).format('DD MMMM YYYY')}</td>
                 </tr>

            </table>
            
            <table width="100%" border="1" style="margin-top:5%;border-collapse:collapse" cellpadding="4">
                <tr>
                    <th colspan="2">Data Penjualan / Pembelian</th>
                 </tr> 
                 <tr>
                    <th>Sisa Barang</th>
                    <th>Sisa Uang</th>
                 </tr>
                 <tr>
                    <td style="text-align:center" >${parseFloat(beli[0] - jual[0]).toFixed(2)}</td>
                    <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(jual[1] - beli[1]))}</td>
                 </tr>
             <tr>
                 <th>Berat Penjualan</th>
                 <th>Berat Pembelian</th>
              </tr>
              <tr>
                 <td style="text-align:center" >${parseFloat(jual[0]).toFixed(2)}</td>
                 <td style="text-align:center" >${parseFloat(beli[0]).toFixed(2)}</td>
              </tr>

              <tr>
              <th>Uang Penjualan</th>
              <th>Uang Pembelian</th>
           </tr>
           <tr>
              <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(jual[1]))}</td>
              <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(beli[1]))}</td>
           </tr>
           <tr>
              <th>Rata-rata Penjualan</th>
              <th>Rata-rata Pembelian</th>
           </tr>
           <tr>
              <td style="text-align:center" >${parseFloat(jual[1] / jual[0]).toFixed(2)}</td>
              <td style="text-align:center" >${parseFloat(beli[1] / beli[0]).toFixed(2)}</td>
           </tr>
        </table>

           <table width="100%" border="1" style="margin-top:5%;border-collapse:collapse" cellpadding="4">
                <tr>
                    <th colspan="2">Data Tukar Tambah / Tukar Kurang</th>
                </tr> 
                <tr>
                    <th>Sisa Barang</th>
                    <th>Sisa Uang</th>
                </tr>
                <tr>
                    <td style="text-align:center" >${parseFloat(tukarKurang[0] - tukarTambah[0]).toFixed(2)}</td>
                    <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(tukarTambah[1] - tukarKurang[1]))}</td>
                </tr>
                <tr>
                <th>Berat Tukar Tambah</th>
                <th>Berat Tukar Kurang</th>
                </tr>
                <tr>
                <td style="text-align:center" >${parseFloat(tukarTambah[0]).toFixed(2)}</td>
                <td style="text-align:center" >${parseFloat(tukarKurang[0]).toFixed(2)}</td>
                </tr>

                <tr>
                <th>Uang Tukar Tambah</th>
                <th>Uang Tukar Kurang</th>
                </tr>
                <tr>
                <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(tukarTambah[1]))}</td>
                <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(tukarKurang[1]))}</td>
                </tr>
                <tr>
                <th>Rata-rata Tukar Tambah</th>
                <th>Rata-rata Tukar Kurang</th>
                </tr>
                <tr>
                <td style="text-align:center" >${parseFloat(tukarTambah[1] / tukarTambah[0]).toFixed(2)}</td>
                <td style="text-align:center" >${parseFloat(tukarKurang[1] / tukarKurang[0]).toFixed(2)}</td>
                </tr>

                </table>

                <table width="100%" border="1" style="margin-top:5%;border-collapse:collapse" cellpadding="4">
                <tr>
                    <th colspan="2">Data Total</th>
                </tr> 
                <tr>
                    <th>Sisa Barang Total</th>
                    <th>Sisa Uang Total</th>
                </tr>
                <tr>
                    <td style="text-align:center" >${parseFloat(totalin[0] - totalout[0]).toFixed(2)}</td>
                    <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(totalout[1] - totalin[1]))}</td>
                </tr>
                <tr>
                <th>Berat TK + Penjualan</th>
                <th>Berat TK + Pembelian</th>
                </tr>
                <tr>
                <td style="text-align:center" >${parseFloat(totalout[0]).toFixed(2)}</td>
                <td style="text-align:center" >${parseFloat(totalin[0]).toFixed(2)}</td>
                </tr>

                <tr>
                <th>Uang TK + Penjualan</th>
                <th>Uang TK + Pembelian</th>
                </tr>
                <tr>
                <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(totalout[1]))}</td>
                <td style="text-align:center" >${new Intl.NumberFormat().format(parseFloat(totalin[1]))}</td>
                </tr>
                <tr>
                <th>Rata-rata TK + Penjualan</th>
                <th>Rata-rata TK + Pembelian</th>
                </tr>
                <tr>
                <td style="text-align:center" >${parseFloat(totalout[1] / totalout[0]).toFixed(2)}</td>
                <td style="text-align:center" >${parseFloat(totalin[1] / totalin[0]).toFixed(2)}</td>
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

    const [data, setData] = useState({});



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

            <View style={{
                flexDirection: 'row',
                marginTop: 10,
            }}>
                <View style={{
                    flex: 1,
                    paddingRight: 5,
                }}>
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
                </View>
                <View style={{
                    flex: 1,
                    paddingRight: 5,
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                        <Icon type="ionicon" name="calendar-outline" color={colors.black} size={16} />
                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.black,
                                left: 10,
                                fontSize: 12,
                            }}>
                            Dari
                        </Text>
                    </View>
                    <DatePicker
                        style={{ width: '100%' }}
                        date={kirim.tanggal_awal}
                        mode="date"
                        showIcon={false}
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

                                borderRadius: 10,
                                borderWidth: 0,
                                height: 45,
                                backgroundColor: colors.zavalabs
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {
                            setKirim({
                                ...kirim,
                                tanggal_awal: date
                            });

                        }}
                    />
                </View>

                <View style={{
                    flex: 1,
                    paddingLeft: 5,
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                        <Icon type="ionicon" name="calendar-outline" color={colors.black} size={16} />
                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.black,
                                left: 10,
                                fontSize: 12,
                            }}>
                            Sampai
                        </Text>
                    </View>
                    <DatePicker
                        style={{ width: '100%' }}
                        date={kirim.tanggal_akhir}
                        mode="date"
                        showIcon={false}
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

                                borderRadius: 10,
                                borderWidth: 0,
                                height: 45,
                                backgroundColor: colors.zavalabs
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {
                            setKirim({
                                ...kirim,
                                tanggal_akhir: date
                            });

                        }}
                    />
                </View>

            </View>


            <View style={{
                marginTop: 10,
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 12,
                        textAlign: 'center',
                        marginVertical: 10,
                        borderBottomWidth: 1,
                        paddingBottom: 5,
                        borderBottomColor: colors.zavalabs
                    }}>( <Text style={{
                        color: colors.danger
                    }}>{kirim.kadar}</Text> ) {moment(kirim.tanggal_awal).format('DD MMMM YYYY')} s/d {moment(kirim.tanggal_akhir).format('DD MMMM YYYY')}</Text>


                </View>
                <TouchableOpacity onPress={sendServer} style={{
                    padding: 10,
                    backgroundColor: colors.danger,
                    borderRadius: 10,
                    flexDirection: 'row'
                }}>
                    <Icon type='ionicon' name='refresh' size={12} color={colors.white} />
                    <Text style={{
                        left: 2,
                        fontFamily: fonts.secondary[600],
                        fontSize: 12,
                        color: colors.white
                    }}>Proses Data</Text>
                </TouchableOpacity>
            </View>

            {/* table */}



            {!loading &&
                <ScrollView>



                    <View style={{
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 10,
                        overflow: 'hidden',
                        borderColor: colors.border
                    }}>
                        <Text style={{
                            backgroundColor: colors.danger,

                            padding: 5,
                            textAlign: 'center',
                            color: colors.white
                        }}>Data Penjualan / Pembelian</Text>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Sisa Barang" value={parseFloat(beli[0] - jual[0]).toFixed(2)} />
                            <MyDataInfo label="Sisa uang" value={new Intl.NumberFormat().format(parseFloat(jual[1] - beli[1]))} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Berat Penjualan" value={parseFloat(jual[0]).toFixed(2)} />
                            <MyDataInfo label="Berat Pembelian" value={parseFloat(beli[0]).toFixed(2)} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Uang Penjualan" value={new Intl.NumberFormat().format(parseFloat(jual[1]))} />
                            <MyDataInfo label="Uang Pembelian" value={new Intl.NumberFormat().format(parseFloat(beli[1]))} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Rata-rata Penjualan" value={parseFloat(jual[1] / jual[0]).toFixed(2)} />
                            <MyDataInfo label="Rata-rata Pembelian" value={parseFloat(beli[1] / beli[0]).toFixed(2)} />
                        </View>

                    </View>

                    <View style={{
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 10,
                        overflow: 'hidden',
                        borderColor: colors.border
                    }}>
                        <Text style={{
                            backgroundColor: colors.black,

                            padding: 5,
                            textAlign: 'center',
                            color: colors.white
                        }}>Data Tukar Tambah / Tukar Kurang</Text>

                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Sisa Barang" value={parseFloat(tukarKurang[0] - tukarTambah[0]).toFixed(2)} />
                            <MyDataInfo label="Sisa uang" value={new Intl.NumberFormat().format(parseFloat(tukarTambah[1] - tukarKurang[1]))} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Berat Tukar Tambah" value={parseFloat(tukarTambah[0]).toFixed(2)} />
                            <MyDataInfo label="Berat Tukar Kurang" value={parseFloat(tukarKurang[0]).toFixed(2)} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Uang Tukar Tambah" value={new Intl.NumberFormat().format(parseFloat(tukarTambah[1]))} />
                            <MyDataInfo label="Uang Tukar Kurang" value={new Intl.NumberFormat().format(parseFloat(tukarKurang[1]))} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Rata-rata Tukar Tambah" value={parseFloat(tukarTambah[1] / tukarTambah[0]).toFixed(2)} />
                            <MyDataInfo label="Rata-rata Tukar Kurang" value={parseFloat(tukarKurang[1] / tukarKurang[0]).toFixed(2)} />
                        </View>

                    </View>

                    <View style={{
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 10,
                        overflow: 'hidden',
                        borderColor: colors.border
                    }}>
                        <Text style={{
                            backgroundColor: colors.warning,

                            padding: 5,
                            textAlign: 'center',
                            color: colors.white
                        }}>Total</Text>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Sisa Barang Total" value={parseFloat(totalin[0] - totalout[0]).toFixed(2)} />
                            <MyDataInfo label="Sisa uang Total" value={new Intl.NumberFormat().format(parseFloat(totalout[1] - totalin[1]))} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Berat TK + Penjualan" value={parseFloat(totalout[0]).toFixed(2)} />
                            <MyDataInfo label="Berat TK + Pembelian" value={parseFloat(totalin[0]).toFixed(2)} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Uang TT + Penjualan" value={new Intl.NumberFormat().format(parseFloat(totalout[1]))} />
                            <MyDataInfo label="Uang TK + Pembelian" value={new Intl.NumberFormat().format(parseFloat(totalin[1]))} />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <MyDataInfo label="Rata-rata TK + Penjualan" value={parseFloat(totalout[1] / totalout[0]).toFixed(2)} />
                            <MyDataInfo label="Rata-rata TK + Pembelian" value={parseFloat(totalin[1] / totalin[0]).toFixed(2)} />
                        </View>

                    </View>

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            flex: 1,
                            padding: 10,
                        }}>
                            <MyButton onPress={() => createPDF()} Icons="print" title="Print" warna={colors.danger} />
                        </View>
                        <View style={{
                            flex: 1,
                            padding: 10,
                        }}>
                            <MyButton onPress={() => navigation.goBack()} Icons="home" title="Halaman Depan" warna={colors.primary} />
                        </View>
                    </View>

                </ScrollView>}




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