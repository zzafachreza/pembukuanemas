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
        marginBottom: 8,
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
          left: 12,
          top: 13,
        }}>
          <Icon type='ionicon' name={iconname} color={Color.blueGray[300]} size={24} />
        </View>
        <Picker style={{ width: '90%', height: 50, left: 30, top: -3, transform: [{ scale: 1 }] }}
          selectedValue={value} onValueChange={onValueChange}>
          <Picker.Item textStyle={{ fontSize: 12, ...fonts.body2, color: colors.primary, }} value="" label="" />
          {data.map(item => {
            return <Picker.Item textStyle={{ fontSize: 12, ...fonts.body2, color: colors.primary, }} value={item.value} label={item.label} />;
          })}
        </Picker>
        <View style={{
          position: 'absolute',
          right: 12,
          top: 13,
          backgroundColor: Color.white[900]
        }}>
          <View style={{ marginTop: -5 }}>
            <Icon type='ionicon' name='caret-down-outline' color={Color.blueGray[300]} size={24} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});