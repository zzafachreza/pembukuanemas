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
                    <th>No</th>
                    <th>Berat</th>
                    <th>Kadar</th>
                    <th>Jenis</th>
                    <th>Harga</th>
                    <th>Jenis Transaksi</th>
                 </tr> `,

        ];

        data.map((item, index) => {

            arr.push(`<tr>
                        <td>${index + 1}</td>
                      
                        <td>${parseFloat(item.berat).toFixed(2)}</td>
                        <td>${item.kadar}</td>
                        <td>${item.jenis}</td>
                        <td>${new Intl.NumberFormat().format(item.harga)}</td>
                        <td>${item.jenis_transaksi}</td>
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
                        onDateChange={(date) => {
                            setKirim({
                                ...kirim,
                                tanggal: date
                            });
                            __getTransaction(date)
                        }}
                    />
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
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: colors.primary
                }}>
                    <View style={{ flex: 0.2, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>No.</Text>
                    </View>

                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Berat</Text>
                    </View>
                    <View style={{ flex: 0.4, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Kadar</Text>
                    </View>
                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Jenis</Text>
                    </View>
                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Harga</Text>
                    </View>
                    <View style={{ flex: 0.3, backgroundColor: colors.white, margin: 0.5, }}>
                        <Text style={styles.textJudul}>Jenis Trx</Text>
                    </View>
                </View>
                {/* data */}

                <ScrollView showsVerticalScrollIndicator={false}>
                    {data.map((item, index) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('DetailData', item)} style={{
                                flexDirection: 'row',
                                backgroundColor: colors.primary
                            }}>
                                <View style={{ flex: 0.2, backgroundColor: colors.white, marginBottom: 0.5, }}>
                                    <Text style={styles.textIsi}>{index + 1}</Text>
                                </View>

                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{parseFloat(item.berat).toFixed(2)}</Text>
                                </View>
                                <View style={{ flex: 0.4, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.kadar}</Text>
                                </View>
                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.jenis}</Text>
                                </View>
                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5, }}>
                                    <Text style={styles.textIsi}>{new Intl.NumberFormat().format(item.harga)}</Text>
                                </View>
                                <View style={{ flex: 0.3, backgroundColor: colors.white, marginBottom: 0.5 }}>
                                    <Text style={styles.textIsi}>{item.jenis_transaksi}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
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