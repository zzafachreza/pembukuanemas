import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MyDimensi, fonts, windowWidth, } from '../../utils/fonts';
import { Icon } from 'react-native-elements';
import { Color, colors } from '../../utils';

export default function MyButton({
  title,
  warna = colors.primary,
  onPress,
  Icons,
  radius = 10,
  colorText = colors.white,
  fontWeight = 'normal',
  iconColor = colors.white,
  borderSize = 0,
  kiri = true,
  borderColor = Color.blueGray[300],
}) {
  return (
    <TouchableOpacity
      style={styles(warna, radius,).btn}
      onPress={onPress}>

      {kiri && <Icon type="ionicon" name={Icons} color={iconColor} size={18} />}
      <Text
        style={{
          color: colorText,
          textAlign: "center",
          fontFamily: fonts.secondary[600],
          fontSize: 12,
          left: 10,
          // fontWeight: fontWeight,
        }}>
        {title}
      </Text>
      {!kiri && <Icon type="ionicon" name={Icons} color={iconColor} size={18} />}
    </TouchableOpacity>
  );
}

const styles = (warna, radius, borderSize, borderColor) =>
  StyleSheet.create({
    btn: {
      height: 45,
      borderRadius: radius,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: warna,
      borderWidth: borderSize,
      borderColor: borderColor,
      flexDirection: 'row',

    },
  });
