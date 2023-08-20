import { StyleSheet,TextInput,Text,View,TouchableOpacity,Dimensions,Keyboard,TouchableWithoutFeedback} from 'react-native';
import React,{ useRef,useState,useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { TapGestureHandler,State } from 'react-native-gesture-handler';
import { Entypo,AntDesign } from '@expo/vector-icons';
import firebase from '../../firebase/config';
import { colors } from '../../colors/colors';

export default function EmailPwd({ isPending,changeEmail,changePassword,errors,submitForm,showUsernamePage,ActivityIndicator,increaseHeight }) {
    const [showPassword,setShowPassword] = useState({
        eye: false,
        secureTextEntry: true
    })
  const input = useRef(null);
  const secondInput = useRef(null)
  const gestureState = useRef(new Animated.Value(State.UNDETERMINED))
  const [expanded,setExpanded] = useState(true)
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        input.current.blur()
        secondInput.current.blur()
        setExpanded(false);
      }
    );
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (!expanded) {
          setExpanded(true); // or some other action 
        }
      }
    );
      // console.log(input.current)
    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [input.current,secondInput.current])
  return (
    <View style={ expanded ? { top:100 } : null}>
        <TouchableWithoutFeedback onPress={showUsernamePage}>
          <View style={{ ...styles.backIcon }}>
            <AntDesign name="arrowleft" style={{ top:Dimensions.get('window').height < 596 ? 10 : 0,shadowColor:'black' }} size={24} color="black" />
          </View>
         </TouchableWithoutFeedback>
         <TapGestureHandler onBegan={increaseHeight} onEnded={() => input.current.focus()}>
          <Animated.View>
          <Animated.View pointerEvents={'none'}>
        <TextInput 
          ref={input}
          placeholder='Email'
          style={styles.textInput}
          placeholderTextColor='black'
          keyboardType='email-address'
          onChangeText={(val) => changeEmail(val)}
        />
        </Animated.View>
          </Animated.View>
        </TapGestureHandler>
        <TapGestureHandler onBegan={increaseHeight} onEnded={() => secondInput.current.focus()}>
          <Animated.View>
          <Animated.View pointerEvents={'none'}>
        <TextInput 
          ref={secondInput}
          placeholder='Password'
          style={styles.textInput}
          placeholderTextColor='black'
          secureTextEntry={showPassword.secureTextEntry}
          onChangeText={(val) => changePassword(val)}
        />
        </Animated.View>
          </Animated.View>
        </TapGestureHandler>
        <View style={{ position:'absolute',right:'12%',top:'52%' }}>
           {!showPassword.eye && <Entypo name="eye" size={24} color="black" onPress={() => setShowPassword({
               eye: true,
               secureTextEntry: false
           })}/>}
            {showPassword.eye && <Entypo name="eye-with-line" size={24} color="black" onPress={() => setShowPassword({
                eye: false,
                secureTextEntry: true
            })}/>}
        </View>
        {errors && <Text style={styles.error}>{errors}</Text>}
        <TouchableOpacity onPress={() => submitForm(firebase)}>
            <Animated.View style={styles.button}>
            {isPending ? <ActivityIndicator size="large" color={colors.green} /> : <Text style={{ fontSize:20,fontWeight:'bold' }}>SUBMIT</Text>}
            </Animated.View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backIcon:{
      left:10,
      shadowOpacity:0.2,
      shadowOffset:{ width:5,height:5 },
      borderRadius:20,
      height:30,
      width:30,
      backgroundColor:colors.white,
      justifyContent:'center',
      alignItems:'center',
      top:-80,
      elevation:3
    },
    textInput: {
        height:  Dimensions.get('window').height < 596 ? 40: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: Dimensions.get('window').width < 396 ? 20: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
      },
      button: {
        backgroundColor: '#fff',
        height: 50,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
});
