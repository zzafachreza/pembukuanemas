import { Alert, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Dimensions, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyHeader, MyInput } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { color } from 'react-native-elements/dist/helpers';
import { launchCamera } from 'react-native-image-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
export default function Home({ navigation }) {
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: MYAPP,
                    message: "Izinkan Aplikasi untuk akses kamera ?",
                    buttonNegative: "TOLAK",
                    buttonPositive: "IZINKAN"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const createPDF = async () => {
        let options = {
            html: `<table width="100%" border="2" style="margin-top:0%;border-collapse:collapse" cellpadding="4">
        <tr>
          <td>
            <center><img src="${foto[1]}" width="300" height="300" /></center>
          </td>
          <td>
          <center><img src="${foto[2]}" width="300" height="300" /></center>
                   </td>
        </tr>
         <tr>
          <td>
            <center><img src="${foto[3]}" width="300" height="300" /></center>
          </td>
          <td>
           <center><img src="${foto[4]}" width="300" height="300" /></center>
                   
                   </td>
        </tr>
         
      </table>`,
            fileName: 'TokoEmasPermata',
            directory: 'Documents',
            height: 559, width: 793,
        };

        let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        // alert(file.filePath);

        await Share.open({
            title: MYAPP,
            message: "Print DAta",
            url: 'file:///' + file.filePath,
            subject: "Report",
        })
            .then((res) => {
                console.log(res);
                setFoto({
                    1: 'https://zavalabs.com/nogambar.jpg',
                    2: 'https://zavalabs.com/nogambar.jpg',
                    3: 'https://zavalabs.com/nogambar.jpg',
                    4: 'https://zavalabs.com/nogambar.jpg'
                })
            })
            .catch((err) => {
                err && console.log(err);
            });

    }


    const [foto, setFoto] = useState({
        1: 'https://zavalabs.com/nogambar.jpg',
        2: 'https://zavalabs.com/nogambar.jpg',
        3: 'https://zavalabs.com/nogambar.jpg',
        4: 'https://zavalabs.com/nogambar.jpg'
    });
    const [user, setUser] = useState({});
    const isFocused = useIsFocused();

    const getCamera = (index) => {
        launchCamera({
            includeBase64: true,
            quality: 1,
            mediaType: "photo",
            maxWidth: 500,
            maxHeight: 500
        }, response => {
            setFoto({
                ...foto,
                [index]: `data:${response.type};base64, ${response.base64}`,
            });
        });
    }
    useEffect(() => {


        if (isFocused) {
            requestCameraPermission()
            __getTransaction();
        }

    }, [isFocused]);

    const __getTransaction = () => {
        getData('user').then(res => {
            setUser(res);
        });


    }




    return (






        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.myback,
            padding: 0,
        }}>
            <View style={{
                padding: 20,
                marginVertical: 10,
            }}>
                <MyHeader menu="Beranda" />
                <Text style={{
                    fontFamily: fonts.primary[400],
                    fontSize: windowWidth / 25,
                }}>IP Printer Address : <Text style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    paddingHorizontal: 10,

                }}>  {user.ipaddress}  </Text></Text>
            </View>
            {/* info user */}

            <View style={{
                flex: 1,

            }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>

                    <TouchableOpacity onPress={() => getCamera(1)} style={{
                    }}>
                        <Image style={{
                            width: windowWidth / 2.1,
                            height: windowWidth / 2.1,
                        }} source={{
                            uri: foto[1]
                        }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => getCamera(2)} style={{
                    }}>
                        <Image style={{
                            width: windowWidth / 2.1,
                            height: windowWidth / 2.1,
                        }} source={{
                            uri: foto[2]
                        }} />
                    </TouchableOpacity>

                </View>

                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>

                    <TouchableOpacity onPress={() => getCamera(3)} style={{
                    }}>
                        <Image style={{
                            width: windowWidth / 2.1,
                            height: windowWidth / 2.1,
                        }} source={{
                            uri: foto[3]
                        }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => getCamera(4)} style={{
                    }}>
                        <Image style={{
                            width: windowWidth / 2.1,
                            height: windowWidth / 2.1,
                        }} source={{
                            uri: foto[4]
                        }} />
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{
                margin: 20,
            }}>
                <MyButton onPress={createPDF} Icons="print" warna={colors.danger} title="Print Dokumen" />
            </View>
        </SafeAreaView>




    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        width: windowHeight,
        height: windowWidth / 2,
    },
    imageContainer: {
        flex: 1,
        marginBottom: 1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
});