import { StyleSheet, View,Text,Alert,TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import React,{useEffect,useState} from 'react';
import { colors } from '../colors/colors';
import MapPreview from '../components/MapPreview/MapPreview';

export default function OrderCleaner({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <MapPreview navigation={navigation}>
          <Text style={{fontFamily:'viga',letterSpacing:1.5}}>Please Enable Your location</Text>
      </MapPreview> */}
      <Text>Hey</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
});
