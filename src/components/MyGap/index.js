import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Color } from '../../utils';

export default function MyGap({ jarak, border = false }) {
  return <View style={{
    height: jarak,
    borderBottomWidth: border ? 1 : 0,
    borderBottomColor: Color.blueGray[200],

  }} />;
}

const styles = StyleSheet.create({});
