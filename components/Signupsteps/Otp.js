import { useRef, useState,useEffect } from "react";
import {View,StyleSheet,Text,TextInput,Keyboard,TouchableOpacity,Dimensions, TouchableWithoutFeedback,ActivityIndicator } from "react-native";
import { colors } from "../../colors/colors";
import { AntDesign } from '@expo/vector-icons';

export default function Otp({ confirmCode,error,changeOtpInput }) {
    const [pins,setPins] = useState({
        pin1: "",
        pin2: "",
        pin3: "",
        pin4: "",
        pin5: "",
        pin6: ""
    })
    const ref_input1 = useRef();
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();
    const ref_input5 = useRef();
    const ref_input6 = useRef();

  return (
        <>
          <View style={styles.otp}>
          <TextInput 
            keyboardType="numeric"
            maxLength={1}
            value={pins.pin1}
            onChangeText={(pin1) => 
               {
                changeOtpInput()
                if (pin1 != '') {
                    ref_input2.current.focus()
                }
                return setPins({ pin1: pin1 })
            }}
            ref={ref_input1}
            style={error ? {...styles.otpInput, ...styles.otpInputError} :styles.otpInput}
          />
          <TextInput 
            keyboardType="numeric"
            maxLength={1}
            value={pins.pin2}
            onChangeText={(pin2) => { 
                changeOtpInput()
                setPins(prevEvent => {
                    return {...prevEvent, pin2:pin2}
                })
                if (pin2 != '') {
                    ref_input3.current.focus()
                }else if(pin2 == ''){
                    ref_input1.current.focus()
                }
            }}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  ref_input1.current.focus()
                }
            }}
            ref={ref_input2}
            style={error ? {...styles.otpInput, ...styles.otpInputError} :styles.otpInput}
          />
          <TextInput 
            keyboardType="numeric"
            maxLength={1}
            value={pins.pin3}
            onChangeText={(pin3) => { 
                changeOtpInput()
                setPins(prevEvent => {
                    return {...prevEvent, pin3:pin3}
                })
                if (pin3 != '') {
                    ref_input4.current.focus()
                }else{
                    ref_input2.current.focus()
                }
            }}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  ref_input2.current.focus()
                }
            }}
            ref={ref_input3}
            style={error ? {...styles.otpInput, ...styles.otpInputError} :styles.otpInput}
          />
          <TextInput 
            keyboardType="numeric"
            maxLength={1}
            value={pins.pin4}
            onChangeText={(pin4) => { 
                changeOtpInput()
                setPins(prevEvent => {
                    return {...prevEvent, pin4:pin4}
                })
                if (pin4 != '') {
                    ref_input5.current.focus()
                }else{
                    ref_input3.current.focus()
                }
            }}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  ref_input3.current.focus()
                }
            }}
            ref={ref_input4}
            style={error ? {...styles.otpInput, ...styles.otpInputError} :styles.otpInput}
          />
          <TextInput 
            keyboardType="numeric"
            maxLength={1}
            value={pins.pin5}
            onChangeText={(pin5) => { 
                changeOtpInput()
                setPins(prevEvent => {
                    return {...prevEvent, pin5:pin5}
                })
                if (pin5 != '') {
                    ref_input6.current.focus()
                }else{
                    ref_input4.current.focus()
                }
            }}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  ref_input4.current.focus()
                }
            }}
            ref={ref_input5}
            style={error ? {...styles.otpInput, ...styles.otpInputError} :styles.otpInput}
          />
          <TextInput 
            keyboardType="numeric"
            maxLength={1}
            value={pins.pin6}
            onChangeText={(pin6) => { 
                changeOtpInput()
                setPins(prevEvent => {
                    return {...prevEvent, pin6:pin6}
                })
                if (pin6 != '') {
                    Keyboard.dismiss()
                    confirmCode('' + pins.pin1 + pins.pin2 + pins.pin3 + pins.pin4 + pins.pin5 + pin6)
                }else{
                    ref_input5.current.focus()
                }
            }}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  ref_input5.current.focus()
                }
            }}
            ref={ref_input6}
            style={error ? {...styles.otpInput, ...styles.otpInputError} :styles.otpInput}
          />
          </View>
        </>
  );
}

const styles = StyleSheet.create({
    otp: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: Dimensions.get('window').height < 596 ? 0 : 15
    },
    otpInput:{
        margin:10,
        height:40,
        width:'10%',
        backgroundColor:colors.whitishBlue,
        textAlign:'center',
        color:colors.black,
        borderRadius:5
    },
    otpInputError:{
        borderColor:'red',
        borderWidth:1,
        backgroundColor:'pink'
    },
    error: {
        width: '70%',
        position: 'absolute',
        top: -100,
        right:0,
        alignSelf: 'center',
        backgroundColor: 'pink',
        padding: 8,
        fontSize: 15,
        color: 'red',
        margin: 10,
        borderRadius: 4
    },
    textInput: {
        height: 60,
        borderRadius: 10,
        alignItems:'center',
        borderWidth: 0.5,
        marginHorizontal: 30,
        paddingLeft: 20,
        borderColor: 'rgba(0,0,0,0.2)'
      },
      button: {
        backgroundColor: '#fff',
        height: 50,
        margin: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
})
