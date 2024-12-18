import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { Color, colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

export default function MyPicker({
  label,
  iconname = 'options',
  onValueChange,
  onChangeText,
  textColor = colors.primary,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  label2,
  styleLabel,
  colorIcon = colors.primary,
  data = [],
}) {
  return (
    <>
      <Text style={{
        ...fonts.subheadline3,
        color: textColor,
        marginBottom: 2,
      }}>{label}</Text>

      <View style={{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Color.blueGray[300],
        height: 45,
      }}>
        <View style={{
          position: 'absolute',
          left: 10,
          top: 9,
        }}>
          <Icon type='ionicon' name={iconname} color={Color.blueGray[300]} size={20} />
        </View>
        <Picker style={{ width: '90%', height: 50, left: 5, top: -3, backgroundColor: colors.white, transform: [{ scale: 0.8, }] }}
          selectedValue={value} onValueChange={onValueChange}>
          <Picker.Item textStyle={{ fontSize: 12, ...fonts.body2, color: colors.primary, }} value="" label="" />
          {data.map(item => {
            return <Picker.Item textStyle={{ fontSize: 12, ...fonts.body2, color: colors.primary, }} value={item.value} label={item.label} />;
          })}
        </Picker>
        <View style={{
          position: 'absolute',
          right: 12,
          top: 15,
          backgroundColor: Color.white[900]
        }}>
          <View style={{ marginTop: -5 }}>
            <Icon type='ionicon' name='caret-down-outline' color={Color.blueGray[300]} size={20} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});