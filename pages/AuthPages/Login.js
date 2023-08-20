import React,{useEffect,useState,useRef} from 'react';
import { StyleSheet, View,Text,Image,Dimensions,SafeAreaView,TextInput,ImageBackground,TouchableOpacity,Vibration, TouchableNativeFeedback, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../colors/colors';
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from 'react-native-animatable';
import { BarIndicator } from 'react-native-indicators';
import { Entypo,FontAwesome5,MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { LoginUser } from '../../redux/actions/actions';
import { AllKeys } from '../../keys/AllKeys';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COMET_AUTH_KEY } from "@env"
import { showMessage } from 'react-native-flash-message';

const {width,height} = Dimensions.get('window')

export default function Login({ navigation }) {
    const [empty, setEmpty] = useState({ email:false,password:false })
    const [email,setEmail] = useState('')
    const emailRef = useRef(null)
    const [password,setPassword] = useState('')
    const passwordRef = useRef(null)
    const [isPending,setIsPending] = useState(false)
    const [error,setError] = useState({ field1:false,field2:false })
    const dispatch = useDispatch()
    const [showPassword,setShowPassword] = useState({
      eye: false,
      secureTextEntry: true
    })
    const ONE_SECOND_IN_MS = 50;
    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS
    ];

    // FUNCTION THAT STORES DATA IN STORAGE
    const setStorageData = async(id) => {
      await AsyncStorage.setItem('userData', JSON.stringify({
        id
      })
      )
      const checkStorage = await AsyncStorage.getItem('userData')
    }
    const LoginInUsers = async() => {
      setError(preEvents => {
        return {
          ...preEvents,
          field1:false,
          field2:false
        }
      }) 
        if (email === '' || !email) {
          emailRef.current.shake(500)
          Vibration.vibrate(PATTERN)
          setError(preEvents => {
            return {
              ...preEvents,
              field1:true
            }
          }) 
          return
        }else{
          if (password === '' || !password) {
            passwordRef.current.shake(500)
            Vibration.vibrate(PATTERN)
            setError(preEvents => {
              return {
                ...preEvents,
                field2:true
              }
            }) 
            return
          }
        }
        if (isPending) {
          return
        }
        setIsPending(true)
        const fetchUser = await fetch(`${AllKeys.ipAddress}/FetchUserInfo?email=${email}&password=${password}`)
        const fetchUserRes = await fetchUser.json();

        if (fetchUserRes.success) {
          setStorageData(fetchUserRes.rows.id)
          setIsPending(false)
          var authKey = AllKeys.COMET_AUTH_KEY;
          CometChat.getLoggedinUser().then(
            user => {
              if(!user){
                CometChat.login(fetchUserRes.rows.id, authKey).then(
                  user => {
                    console.log("Login Successful:", { user });
                  }, error => {
                    console.log("Login failed with exception:", { error });
                  }
                );
              }
            }, error => {
              console.log("Something went wrong", error);
            }
          );
          showMessage({
            type:'success',
            message:'Login Success',
            description:`Welcome back ${fetchUserRes.rows.firstname}, you are hardworking and deserve that luxurious lifestyle.`,
            duration:4000
          })
          dispatch(LoginUser(fetchUserRes.rows)) 
        }else{
          if (fetchUserRes.error === 'noEmail') {
            emailRef.current.shake(1000)
            Vibration.vibrate(PATTERN)
            setError(preEvents => {
              return {
                ...preEvents,
                field1:true
              }
            }) 
          }else if (fetchUserRes.error === 'wrongPassword') {
            passwordRef.current.shake(1000)
            Vibration.vibrate(PATTERN)
            setError(preEvents => {
              return {
                ...preEvents,
                field2:true
              }
            }) 
          }
          setIsPending(false)
        }
    }
    const updateEmail = (val) => {
      if (!val) {
        emailRef.current.shake(500)
        Vibration.vibrate(PATTERN)
        setEmpty(preEvents => {
          return {...preEvents, email:true}
        })
      }else if (empty.email) {
        setEmpty(preEvents => {
          return {...preEvents, email:false}
        })
      }
      setEmail(val)
    }
    const updatePassword = (val) => {
      if (!val) {
        passwordRef.current.shake(500)
        Vibration.vibrate(PATTERN)
        setEmpty(preEvents => {
          return {...preEvents, password:true}
        })
      }else if (empty.password) {
        setEmpty(preEvents => {
          return {...preEvents, password:false}
        })
      }
      setPassword(val)
    }
  return (
    <ImageBackground style={{ flex:1 }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png'}}>
        {/* <AnimatedLoader
          visible={isPending}
          overlayColor="rgba(0,0,0,0.7)"
          source={require('../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        /> */}
        <SafeAreaView>
            <View style={styles.content}>
              <View style={{ marginBottom:50 }}>
                <Text style={{ fontFamily:'Funzi',fontSize:54,color:colors.whitishBlue }}>Welcome Back</Text>
                <Text style={{ fontFamily:'viga',fontSize:20,color:colors.white,letterSpacing:1 }}>You've been missed</Text>
              </View>
              <Animatable.View ref={emailRef} style={error.field1 || empty.email ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
                <MaterialIcons name="email" size={24} color={colors.purple} />
                <TextInput 
                  autoFocus style={styles.input} value={email} 
                  onChangeText={(val) => updateEmail(val)} 
                  placeholder='Please Enter Email' 
                  placeholderTextColor={colors.black}
                  keyboardType='email-address'
                />
              </Animatable.View>
                {
                  error.field1 ?
                  <Text style={styles.errorText}>Your Email is incorrect</Text>
                  :
                  null
                }
              <Animatable.View ref={passwordRef} style={error.field2 || empty.password ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
                  <MaterialIcons name="lock" size={24} color={colors.purple} />
                  <TextInput 
                    style={styles.input} 
                    value={password} 
                    onChangeText={(val) => updatePassword(val)} 
                    placeholder='Please Enter Password' 
                    placeholderTextColor={colors.black}
                    secureTextEntry={showPassword.secureTextEntry}
                  />
                  <View style={{ position:'absolute',right:'5%' }}>
                     {!showPassword.eye && <Entypo name="eye" size={24} color={colors.purple} onPress={() => setShowPassword({
                         eye: true,
                         secureTextEntry: false
                     })}/>}
                      {showPassword.eye && <Entypo name="eye-with-line" size={24} color={colors.purple} onPress={() => setShowPassword({
                          eye: false,
                          secureTextEntry: true
                      })}/>}
                  </View>
              </Animatable.View>
                {
                  error.field2 ?
                  <Text style={styles.errorText}>Your Password is incorrect</Text>
                  :
                  null
                }
                {
                  isPending
                  ?
                    <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                       <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
                    </View>
                  :
                  <TouchableNativeFeedback onPress={() => LoginInUsers()}>
                      <View style={styles.button}>
                          <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>LOGIN</Text>
                      </View>
                  </TouchableNativeFeedback>
                }
              <TouchableOpacity onPress={() => navigation.navigate('ForgottenPwd')}>
                <View>
                    <Text style={{ fontFamily:'viga',color:'#004aad',textDecorationLine:'underline' }}>Forgotten Password?</Text>
                </View>
              </TouchableOpacity>
            </View>
        </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  errorText:{
    fontSize:12,
    color:'red'
  },
  content:{
      padding:20,
      marginTop:40
  },
  lottie: {
      width: 100,
      height: 100
  },
  parentInput:{
    backgroundColor:colors.grey,
    flexDirection:'row',
    alignItems:'center',
    marginVertical:10,
    paddingHorizontal:10,
    borderRadius:10
  },
  input:{
    padding: width > 375 ? 15 : 10,
    fontFamily:'viga',
    color:colors.black,
    width:'100%'
  },
  button: {
      backgroundColor:colors.purple,
      padding: 10,
      marginVertical:10,
      borderRadius:10
  }
})
