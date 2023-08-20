import { TapGestureHandler,State } from 'react-native-gesture-handler';
import { StyleSheet, View,Text,Image,Dimensions,Easing,Keyboard,ActivityIndicator, Button, TouchableWithoutFeedback } from 'react-native';
import Animated from 'react-native-reanimated';
import React,{useEffect,useState,useRef} from 'react';
import EmailPwd from './Signupsteps/EmailPwd';
import UserPhone from './Signupsteps/UserPhone';
import Username from './Signupsteps/Username';
import Otp from './Signupsteps/Otp';
import Login from './LoginComp/Login';
import { colors } from '../colors/colors';
import MyModal from './modal';

import { LoginUser, SignupUser,MOBILE_AUTH } from '../redux/actions/actions';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { projectFirestore } from '../firebase/config';

const {width,height} = Dimensions.get('window')
const { Value,Extrapolate,concat,cond,eq,call } = Animated


export default function LoginComp({navigation}) {
  let buttonOpacity = new Value(1)
  const [checkMount,setCheckMount] = useState(true)
  const [showLogin,setShowLogin] = useState(false)
  let bodyHeight = new Value(height / 3)
  let mainHeight = new Value(height)
  const shrinkView = new Value(500)
  const expandHeight = useRef(false)
  
  // useEffect(() => {
    
  //   return () => {
  //     setCheckMount(null);
  //     // onStateChange(null)
  //     // onCloseState(null)
  //   };
  // }, [checkMount]);
  
  // const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
  // await delay(1200);

    const increaseHeight = () => {
      // console.log(bodyHeight)
      // console.log(mainHeight)
      if (!expandHeight.current) {
        Animated.timing(bodyHeight, {
          toValue: height,
          duration: 500,
          easing: Easing.in
        }).start()
        Animated.timing(shrinkView, {
          toValue: 700,
          duration: 300,
          easing: Easing.in
        }).start()
        expandHeight.current = true
      }
    }
    const decreaseHeight = () => {
      console.log('ggg')
      if (expandHeight.current) {
        console.log('hhh')
        Keyboard.dismiss()
        Animated.timing(bodyHeight, {
          toValue: height / 3,
          duration: 500,
          easing: Easing.in
        }).start() 
        expandHeight.current = false
      }
    }
    // const decreaseHeight = () => {
    //   if (bodyHeight == mainHeight || bodyHeight == height) {
    //     console.log('yes')
        
    //   }
    // }

    const onStateChange = async({ nativeEvent }) =>  {
      // console.log(nativeEvent.state)
      if (nativeEvent.state === State.END) {
            Animated.timing(buttonOpacity, {
              toValue: 0,
              duration: 500,
              easing: Easing.in
            }).start();
            setShowLogin(false)
      }
    }
    const onStateChangeLogin = async({ nativeEvent }) =>  {
      // console.log(nativeEvent.state)
      // console.log('Login')
      if (nativeEvent.state === State.END) {
            Animated.timing(buttonOpacity, {
              toValue: 0,
              duration: 500,
              easing: Easing.in
            }).start();
            setShowLogin(true)
      }
    }
    const onCloseState = ({ nativeEvent }) =>  {
      Keyboard.dismiss()
      if (nativeEvent.state === State.END) {
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.in
        }).start();
      }
    }
  const buttonY = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP
  })
  // const onFullScreen = bodyHeight.interpolate({
  //   inputRange: [1, 1],
  //   outputRange: [100,0],
  //   extrapolate: Extrapolate.CLAMP
  // })
  const bgY = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [-height / 3, 0],
    extrapolate: Extrapolate.CLAMP
  })
  const imageY = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 100],
    extrapolate: Extrapolate.CLAMP
  })
  const textInputZindex = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1,-1],
    extrapolate: Extrapolate.CLAMP
  })

  const textInputY = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0,100],
    extrapolate: Extrapolate.CLAMP
  })

  const textInputOpacity = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1,0],
    extrapolate: Extrapolate.CLAMP
  })
  const rotateCross = buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP
  })
  return (
    <View style={styles.logoContainer}>
      <Animated.View style={{ 
        flex:1,
        width:'100%',
        height:'100%',
        justifyContent:'center', 
        backgroundColor: colors.black,
        transform:[{ translateY:bgY }] 
      }}>
        <Image style={{...styles.logo,height:300,opacity:0.7 }} source={require('../assets/signup-page.png')}/>
        <Text style={{ fontSize:25,alignSelf:'center',color:'#fff',fontFamily:'viga' }}>STAY CLEAN, STAY HEALTHY</Text>
        <Animated.View style={{transform:[{ translateY:imageY }] }}>
          <Image style={styles.logo } source={require('../assets/Logo2.png')}/>
        </Animated.View>
      </Animated.View>
        {/* <View style={{ height:height/2.2,position:'absolute',width:'100%' }}>
          <TapGestureHandler onHandlerStateChange={onStateChange}>
            <Animated.View style={{...styles.button, opacity: buttonOpacity, transform: [{ translateY: buttonY }]}}>
                <Text style={{ fontSize:25,fontWeight:'bold' }} >SIGN UP</Text>
            </Animated.View>
          </TapGestureHandler>
        </View> */}
        <TouchableWithoutFeedback>
        <View style={{ height:height/2.2,position:'absolute',width:'100%' }}>
          <View style={styles.button}>
            <Text style={{ fontSize:25,fontWeight:'bold' }} >SIGN UP</Text>
          </View>
        </View>
        </TouchableWithoutFeedback>
        {/* <View style={{ height:height/3,position:'absolute',width:'100%' }}>
          <TapGestureHandler onHandlerStateChange={onStateChangeLogin}>
            <Animated.View style={{...styles.button, opacity: buttonOpacity, transform: [{ translateY: buttonY }]}}>
                <Text style={{ fontSize:25,fontWeight:'bold' }} >LOGIN</Text>
            </Animated.View>
          </TapGestureHandler>
        </View> */}
        <TouchableWithoutFeedback>
          <View style={{ height:height/3,position:'absolute',width:'100%' }}>
            <View style={styles.button}>
              <Text style={{ fontSize:25,fontWeight:'bold' }} >LOGIN</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={{ 
          height:bodyHeight, 
          zIndex:textInputZindex,
          opacity:textInputOpacity, 
          top:null,
          justifyContent:'center',
          transform: [{ translateY: textInputY }],
          position:'absolute',width:'100%',
          backgroundColor:'white'
        }}>
            <TapGestureHandler onHandlerStateChange={onCloseState}>
              <Animated.View style={{...styles.closeButton }}>
                <Animated.Text style={{fontSize: 15, transform: [{rotate: concat(rotateCross, 'deg') }]}}>
                  x
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            <TapGestureHandler onBegan={() => decreaseHeight()}>
              <Animated.View style={{...styles.closeButton,backgroundColor:colors.yellow, transform: [{translateY:shrinkView }]}}>
                <Animated.Text style={{fontSize: 15 }}>
                  x
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            {/* <View style={{ justifyContent:'center' }}>
              <View style={{ width:'30%',margin:10,minHeight:20,alignSelf:'flex-end' }}>
                <TouchableWithoutFeedback onPress={decreaseHeight}>
                  <View style={{ backgroundColor:colors.white }}>
                    <Text style={{ textAlign:'center',fontFamily:'viga' }}>Click to Shrink</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View> */}
          <Component increaseHeight={increaseHeight} showLogin={showLogin}/>
        </Animated.View>
    </View>
  )
}
export function Component({ showLogin,increaseHeight }) {
  const [emailPwdPage,setEmailPwdPage] = useState(false)
  const [userPhonePage,setUserPhonePage] = useState(true)
  const [usernamePage,setUsernamePage] = useState(false)
  // const [LoginPage,setLoginPage] = useState(false)
  const [showOtp,setShowOtp] = useState(false)
  const [firstname,setFirstName] = useState('')
  const [lastname,setLastName] = useState('')
  const [email,setEmail] = useState('')
  const [number,setNumber] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const [verificationId, setVerificationId] = useState(null);
  const [isPending,setIsPending] = useState(false)
  const otpId = useRef(null)
  const [modalVisible,setModalVisible] = useState({ show:false,text:'' })

  const dispatch = useDispatch();

  const getState = useSelector(state => state.login)

  // setUserDataToStorage

  if(showLogin){
    if(emailPwdPage){
      setEmailPwdPage(false)
    }if(userPhonePage){
      setUserPhonePage(false)
    }if(usernamePage){
      setUsernamePage(false)
    }if(showOtp){
      setShowOtp(false)
    }
  }else{
    if(!usernamePage && !emailPwdPage && !userPhonePage && !showOtp){
      setUserPhonePage(true)
    }
  }


  
  const sendVerification = async() => {
    if (isPending) {
      return
    }
    // var newNum = number.replace(/0+(\d+)/g, "$1")
    const resNumber = await fetch(`http://192.168.100.12:19002/queryUser?number=${number}&email=${email}`)
    const resultNumber = await resNumber.json()

    if (resultNumber.success && resultNumber.result.length > 0) {
      setModalVisible({
        show:true,
        text:'Number Already Exist.'
      })
      setIsPending(false)
      return
    }else if(!resultNumber.success){
      setIsPending(false)
      setModalVisible({
        show:true,
        text:'Please try again Later'
      })
      return
    }
    const sendOtp = await fetch(`http://192.168.100.12:19002/sendOtp?number=${number}`)
    const { response } = await sendOtp.json()

    if (response.status === 'sent') {
        otpId.current = response.id
        setShowOtp(true)
        setUserPhonePage(false)
        setIsPending(false)
    }
    setIsPending(false)
    // const phoneProvider = new fbase.auth.PhoneAuthProvider();
    // phoneProvider.verifyPhoneNumber(number, recaptchaVerifier.current)
    //   .then(val => {
    //     setVerificationId(val)
        
    //     console.log(userPhonePage)
    //   }).catch(err => {
    //     console.log(err)
    //     setError(err)
    //   })
  };
  // Function to be called when confirming the verification code that we received
  // from Firebase via SMS
  const confirmCode = async(fbase,code) => {
    const verifyOtp = await fetch(`http://192.168.100.12:19002/verifyOtp?token=${code}&id=${otpId.current}`)
    const { response,success } = await verifyOtp.json()
    if (response.status === 'verified') {
      setUsernamePage(true)
      setIsPending(false)
      setShowOtp(false)
    }else if (!success) {
      setModalVisible({
        show:true,
        text:'OTP expired Please try again'
      })
    }
    // const credential = fbase.auth.PhoneAuthProvider.credential(
    //   verificationId,
    //   code
    // );
    // fbase
    //   .auth()
    //   .signInWithCredential(credential)
    //   .then((result) => {
    //     dispatch(MOBILE_AUTH(result))
    //     // Do something with the results here
    //     // console.log(result);
    //   });
  }
  // const onSignInSubmit = (fbase) => {
  //   configureCaptcha(fbase)
  //   const phoneNumber = number;
  //   const appVerifier = window.recaptchaVerifier;
  //   fbase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
  //   .then((confirmationResult) => {
  //     // SMS sent. Prompt user to type the code from the message, then sign the
  //     // user in with confirmationResult.confirm(code).
  //     window.confirmationResult = confirmationResult;
  //     console.log("otp has been sent")
  //     setUserPhonePage(false)
  //     setShowOtp(true)
  //     // ...
  //   }).catch((error) => {
  //     console.log("otp has not sent")
  //     // Error; SMS not sent
  //     // ...
  //   });
  // }

  const changeEmail = (val) => {
    setEmail(val)
  }

  // FUNCTION THAT STORES DATA IN STORAGE
  const setStorageData = async(id) => {
    await AsyncStorage.setItem('userData', JSON.stringify({
      id
    })
    )
    const checkStorage = await AsyncStorage.getItem('userData')
    console.log(checkStorage)
  }



  //  signup Users
  const signUpUsers = async() => {
    if (email === '' || !email || password === '' || !password || firstname === '' || !firstname || lastname === '' || !lastname) {
      setModalVisible({
        show:true,
        text:'No fields can be left empty'
      })
      return
    }
    setIsPending(true)
    const resNumber = await fetch(`http://192.168.100.12:19002/queryUser?number=${number}&email=${email}`)
    const resultNumber = await resNumber.json()

    if (resultNumber.success && resultNumber.result.length > 0) {
      setModalVisible({
        show:true,
        text:'Email Already Exist. Please Login'
      })
      setIsPending(false)
      return
    }else if(!resultNumber.success){
      setIsPending(false)
      setModalVisible({
        show:true,
        text:'Please try again Later'
      })
      return
    }

    // Add user to Mysql database
    const res = await fetch(`http://192.168.100.12:19002/SignupUser?email=${email}&number=${number}&firstname=${firstname}&lastname=${lastname}&password=${password}`)
    const result = await res.json()

    if (result.success) {
      // Signup the user in firebase
      // const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCO43Oldf5A3hIxmhsALwsAYXmWzoSVDkM',{
      //   headers: {
      //     'Content-Type':'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify({
      //     email: email.trim(),
      //     password: password,
      //     returnSecureToken: true
      //   })
      // })
      
      // if(!response.ok){
      //   throw new Error('Something went wrong')
      // }
      // const resData = await response.json()
      // const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)

      // // Update user profile with display name
      // const updateProfile = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCO43Oldf5A3hIxmhsALwsAYXmWzoSVDkM',{
      //   headers: {
      //     'Content-Type':'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify({
      //     idToken: resData.idToken,
      //     displayName: firstname.trim()
      //   })
      // })
      let obj = {
        id:result.userID,
        firstname,
        number,
        lastname,
        email
      }

      // try {
      //   await projectFirestore.collection('Users').add({ email,number })
      // } catch (error) {
      //   console.log(error)
      // }
      // Function that set Storage data, Scroll to the top to see the function
      setStorageData(result.userID)
      setIsPending(false)
      dispatch(SignupUser(obj)) 
    }else{
      setIsPending(false)
      setModalVisible({ show:true,text:'There was an error connecting to the database' })
      setError('There was an error connecting to the database')
    }
  }
  // END OF SIGNUP USERS


  // LOGIN USERS
  const LoginInUsers = async() => {
    if (email === '' || !email || password === '' || !password) {
      return
    }
    if (isPending) {
      return
    }
    setIsPending(true)
      // const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCO43Oldf5A3hIxmhsALwsAYXmWzoSVDkM',{
      //   headers: {
      //     'Content-Type':'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify({
      //     email: email,
      //     password: password,
      //     returnSecureToken: true
      //   })
      // })
      
      // if(!response.ok){
      //   setIsPending(false)
      //   setModalVisible({ show:true,text:'Wrong password/email' })
      //   return
      // }
      // const resData = await response.json()
      // const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      // const verifyUser = await fetch(`http://192.168.100.12:19002/verifyUser?email=${email}&password=${password}`)
      // const { success } = await verifyUser.json()
      const fetchUser = await fetch(`http://192.168.100.12:19002/FetchUserInfo?email=${email}&password=${password}`)
      const fetchUserRes = await fetchUser.json();

      if (fetchUserRes.success) {
        setStorageData(fetchUserRes.rows.id)
        setIsPending(false)

        dispatch(LoginUser(fetchUserRes.rows)) 
      }else{
        setModalVisible({ show:true,text:'Wrong Password' })
        setIsPending(false)
      }
  }
  const changeLastName = (val) => {
    setLastName(val)
  }
  const changeFirstName = (val) => {
    setFirstName(val)
  }
  const changePassword = (val) => {
    setPassword(val)
  }
  const changeNumber = (val) => {
    setNumber(val)
  }
  const showUserPhoneComponent = () => {
    setUserPhonePage(true)
    setShowOtp(false)
    setNumber('')
  }
  const displayEmailPwdComponent = () => {
    setEmailPwdPage(true)
    setUsernamePage(false)
  }
  const displayOtpComponent = () => {
    if (Number(number) < 10 || !number || number === '') {
      setModalVisible({
        show:true,
        text:'Please Input A Valid Number'
      })
      setError('Please input a valid number')
      return
    }
    setIsPending(true)
    sendVerification()
  }
  const showUsernamePage = () => {
    setEmailPwdPage(false)
    setUsernamePage(true)
  }
  const displayUsernameComponent = (firebase,code) => {
    const { pin1, pin2, pin3, pin4,pin5,pin6} = code
    const pin = "" + pin1 + pin2 + pin3 + pin4 + pin5 + pin6
    confirmCode(firebase,pin)
    setEmailPwdPage(false)
  }
  // const submitForm = () => {
  //   navigation.navigate('Otp')
  // }
  const changeModal = () => {
    setModalVisible({
      show:false,
      text:''
    })
  }
  return (
    <>
      <MyModal modalVisible={modalVisible} changeModal={changeModal} />
      {userPhonePage && <UserPhone increaseHeight={increaseHeight} isPending={isPending} ActivityIndicator={ActivityIndicator} number={number} changeNumber={changeNumber} errors={error} displayOtpComponent={displayOtpComponent}/>}
      {showOtp && <Otp number={number} errors={error} isPending={isPending} displayUsernameComponent={displayUsernameComponent} showUserPhoneComponent={showUserPhoneComponent}/>}
      {usernamePage && <Username increaseHeight={increaseHeight} ActivityIndicator={ActivityIndicator} lastname={lastname} changeLastName={changeLastName} changeFirstName={changeFirstName} firstname={firstname} errors={error} displayEmailPwdComponent={displayEmailPwdComponent}/>}
      {emailPwdPage && <EmailPwd increaseHeight={increaseHeight} isPending={isPending} ActivityIndicator={ActivityIndicator} email={email} password={password} showUsernamePage={showUsernamePage} changeEmail={changeEmail} submitForm={signUpUsers} changePassword={changePassword} errors={error}/>}
      {showLogin && <Login increaseHeight={increaseHeight} isPending={isPending} ActivityIndicator={ActivityIndicator} email={email} password={password} changeEmail={changeEmail} submitForm={LoginInUsers} changePassword={changePassword} errors={error}/>}
    </>
  );
}


const styles = StyleSheet.create({
    logoContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    logo: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        width: 200,
        height:200
    },
    button: {
      backgroundColor: '#fff',
      height: 70,
      marginHorizontal: 20,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 2, height: 2},
      shadowOpacity: 0.2,
      elevation: 3
    },
    closeButton: {
      height: 40,
      width: 40,
      backgroundColor: 'white',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -20,
      left: width / 2 -20,
      shadowOffset: { width: 2, height: 2},
      shadowOpacity: 0.2,
      elevation: 3
    },
});

