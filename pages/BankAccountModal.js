import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import { View,StyleSheet,Text, Button, TouchableWithoutFeedback,Modal,ActivityIndicator,Dimensions,SafeAreaView, TextInput} from 'react-native'
import { colors } from '../colors/colors';

export default function BankAccountModal({bankModalVisible,bankName,bankNumber,accountName,changeAccountName,changeBankName,changeBankNumber,changeBankModal,error}) {
  const { width,height } = Dimensions.get('window')
  return (
    <SafeAreaView style={styles.centeredView}>
      
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    input: {
        borderColor:colors.black,
        borderWidth:2,
        backgroundColor:'#c4c4c4',
        paddingLeft:10,
        letterSpacing:1.4,
        height:40
    },
    parentView:{
        width:'80%',
        marginVertical:15
    },
    text:{
        fontSize:16,
        fontFamily:'viga'
    },
    button: {
      backgroundColor:colors.yellow,
      padding:10
    },
    error:{
      fontSize:12,
      color:'red'
    }
})