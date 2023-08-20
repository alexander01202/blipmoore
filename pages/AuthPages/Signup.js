import React,{useEffect,useState,useRef} from 'react';
import { StyleSheet, View,Text,BackHandler,Dimensions, TouchableOpacity,SafeAreaView,TextInput,ImageBackground,Vibration, TouchableNativeFeedback, Platform } from 'react-native';
import { colors } from '../../colors/colors';
import { Entypo,Ionicons,MaterialIcons,FontAwesome,AntDesign } from '@expo/vector-icons';
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from 'react-native-animatable';
import AnimatedLottieView from "lottie-react-native";
import Onboarding from 'react-native-onboarding-swiper';
import PhoneInput from 'react-native-phone-input';
import Otp from '../../components/Signupsteps/Otp';
import { SignupUser } from '../../redux/actions/actions';
import { useDispatch } from 'react-redux';
import MyModal from '../../components/modal';
import ProgressBar from 'react-native-progress/Bar';
import { BarIndicator } from 'react-native-indicators';
import { AllKeys } from '../../keys/AllKeys';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native';

const {width,height} = Dimensions.get('window')
export default function Signup({ navigation }) {
    const dispatch = useDispatch()
    const [progress, setProgress] = useState(0.2)
    const [pageNum, setPageNum] = useState(0)
    const onboardingRef = useRef(null)
    const mobileRef = useRef(null)
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const referralRef = useRef(null)
    const [otpSendTime, setOtpSendTime] = useState(null)
    const [otpDisplayTime, setOtpDisplayTime] = useState(null)
    const passwordRef = useRef(null)
    const rPasswordRef = useRef(null)
    const emailRef = useRef(null)
    const lastFormRef = useRef(null)
    const openSurveyRef = useRef(null)
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const [isPending,setIsPending] = useState(false)
    const [otpIsPending,setOtpIsPending] = useState(false)
    const [showSurvey,setShowSurvey] = useState(false)
    const [error,setError] = useState({ rpassword:false,numberField:false,otp:false,firstname:false,lastname:false,email:false,password:false,text:'',referral:false })
    // Phone number states
    const [number,setNumber] = useState('')
    const input = useRef(null);
    const [optionSurvey,setOptionSurvey] = useState({ married:false,single:false,student:false,graduate:false,working:false,retired:false })
    const [customization,setCustomization] = useState(null)
    const otpId = useRef(null)
    // user field states
    const [otpCode, setOtpCode] = useState(null)
    const [firstname,setFirstname] = useState('')
    const [lastname,setLastname] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [rPassword,setRPassword] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [showPassword,setShowPassword] = useState({
      eye: false,
      secureTextEntry: true
    })
    const [showRPassword,setShowRPassword] = useState({
      eye: false,
      secureTextEntry: true
    })
    const ONE_SECOND_IN_MS = 50;
    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS
    ];

    useEffect(() => {
      optionSurvey.graduate ? 
        setCustomization('graduate') 
      : optionSurvey.married ? 
        setCustomization('married') 
      : optionSurvey.single ? 
        setCustomization('single') 
      : optionSurvey.retired ? 
        setCustomization('retired') 
      : optionSurvey.working ? 
        setCustomization('working') 
      : optionSurvey.student ? 
        setCustomization('student') 
      : setCustomization(undefined)
    }, [optionSurvey.graduate,optionSurvey.married,optionSurvey.single,optionSurvey.retired,optionSurvey.working,optionSurvey.student])
    
    // useEffect(() => {
    //   const backAction = () => {
    //     if (pageNum > 1) {
    //       return true;
    //     }else{
    //       onboardingRef.current.goToPage(pageNum - 1,true)
    //       return true;
    //     }
    //   };
  
    //   const backHandler = BackHandler.addEventListener(
    //     'hardwareBackPress',
    //     backAction,
    //   );
  
    //   return () => backHandler.remove();
    // }, [pageNum]);
    const submitNumber = () => {
        if (number.length > 10) {
            sendVerification()
        }else{
          mobileRef.current.shake(500)
          Vibration.vibrate(PATTERN)
          setError(preEvents => {
              return{
                  ...preEvents,
                  numberField:true,
                  text:'Not a valid Number'
              }
          })
        }
    }
    const sendVerification = async() => {
        setError(preEvents => {
            return {
                ...preEvents,
                numberField:false,
                otp:false,
                firstname:false,
                lastname:false,
                email:false,
                password:false,
                text:''
            }
        })
        if (isPending) {
          return
        }
        setOtpIsPending(true)
        // var newNum = number.replace(/0+(\d+)/g, "$1")
        const resNumber = await fetch(`${AllKeys.ipAddress}/queryUser?number=${number}&email=${email}`)
        const resultNumber = await resNumber.json()
    
        if (resultNumber.success && resultNumber.result.length > 0) {
          setError(preEvents => {
            return{
                ...preEvents,
                numberField:true,
                text:'Number Already exist'
            }
          })
          setOtpIsPending(false)
          return
        }else if(!resultNumber.success){
            setError(preEvents => {
                return{
                    ...preEvents,
                    numberField:true,
                    text:'Please Try Again Later'
                }
            })
            setOtpIsPending(false)
          return
        }else if (Number(otpSendTime) >= moment().unix()) {
          setError(preEvents => {
            return{
                ...preEvents,
                otp:true,
                text:`Too much request. Try again ${moment(otpDisplayTime).toNow()}`
            }
          })
          showMessage({
            type:'warning',
            message:'Too much request',
            description:`Try again ${moment(otpDisplayTime).toNow(true)}`
          })
          setOtpIsPending(false)
          return
        }
        const sendOtp = await fetch(`${AllKeys.ipAddress}/sendOtp?number=${number}`)
        const { response } = await sendOtp.json()
        setOtpIsPending(false)
        if (response.status === 'sent') {
            otpId.current = response.id
            // otpDisplayTime and otpSendTime are different because it wasn't possible to use unix with the toNow() method and get the desired result 
            setOtpSendTime(moment().add(120, 'seconds').unix())
            setOtpDisplayTime(moment().add(120, 'seconds'))
            setProgress(0.4)
            onboardingRef.current.goToPage(1, true)
            showMessage({
              type:'success',
              message:'Sent Successfully',
              description:`Otp has been sent to ${number}. OTP Might take 2 - 3 minutes to arrive`,
              duration:5000
            })
        }else{
            setError(preEvents => {
                return{
                    ...preEvents,
                    numberField:true,
                    text:'Could not send otp'
                }
            })
        }
      };
    const confirmCode = async(code) => {
      if (code) {
        setOtpCode(code)
      }
      setIsPending(true)
      const verifyOtp = await fetch(`${AllKeys.ipAddress}/verifyOtp?token=${code ? code : otpCode}&id=${otpId.current}`)
      const { response,success } = await verifyOtp.json()
      if (response.status === 'verified') {
        setProgress(0.6)
        onboardingRef.current.goNext()
      }else if (!success) {
        setError(preEvents => {
            return {
              ...preEvents,
              otp:true,
              text:response.errors[0].description
            }
        })
      }
      setIsPending(false)
    }
    const proceedToEmail = () => {
        setError(prevEvents => {
          return {
              ...prevEvents,
              firstname:false,
              lastname:false,
          }
        })
        if (firstname && lastname) {
            setProgress(1)
            onboardingRef.current.goNext()
        }else{
          firstNameRef.current.shake(500)
          lastNameRef.current.shake(500)
          Vibration.vibrate(PATTERN)
          setError(prevEvents => {
            return {
                ...prevEvents,
                firstname:true,
                lastname:true,
                text:'Fields cannot be left empty'
            }
          })
        }
    }
    // FUNCTION THAT STORES DATA IN STORAGE
  const setStorageData = async(id) => {
    await AsyncStorage.setItem('userData', JSON.stringify({
      id
    })
    )
  }
    //  signup Users

    
    const verifyLastDetails = async() => {
    setError(preEvents => {
        return {
            ...preEvents,
            email:false,
            password:false,
            firstname:false,
            rpassword:false,
            text:''
        }
    })
    if (email === '' || !email || password === '' || !password || firstname === '' || !firstname || lastname === '' || !lastname) {
        setError(prevEvents => {
            return {
                ...prevEvents,
                email:true,
                password:true,
                rpassword:true,
                text:'Please fill in all the fields.'
            }
        })
        emailRef.current.shake(500)
        passwordRef.current.shake(500)
        firstNameRef.current.shake(500)
        lastNameRef.current.shake(500)
        rPasswordRef.current.shake(500)
        Vibration.vibrate(PATTERN)
      return
    }
    if (password !== rPassword) {
      setError(prevEvents => {
        return {
          ...prevEvents,
          password:true,
          rpassword:true,
          text:'Passwords do not match'
        }
      })
      passwordRef.current.shake(500)
      rPasswordRef.current.shake(500)
      Vibration.vibrate(PATTERN)
      return
    }
    lastFormRef.current.fadeOutDown(1000).then(endstate => {
      if(endstate.finished){
        setShowSurvey(true)
      }
    })
    setTimeout(() => {
      openSurveyRef.current.fadeInUp(600)
    }, 350);
    }

    const signUpUsers = async() => {
    setIsPending(true)
    const resNumber = await fetch(`${AllKeys.ipAddress}/queryUser?number=${number}&email=${email}`)
    const resultNumber = await resNumber.json()

    if (resultNumber.success && resultNumber.result.length > 0) {
        setError(prevEvents => {
            return {
                ...prevEvents,
                email:true,
                text:'Email already exist.'
            }
        })
        openSurveyRef.current.fadeOutDown(400)
        setTimeout(() => {
          setShowSurvey(false)
          setIsPending(false)
          Vibration.vibrate(PATTERN)
          lastFormRef.current.fadeInUp(200)
          emailRef.current.shake(500)
        }, 600);
      return
    }else if(!resultNumber.success){
      setIsPending(false)
      setModalVisible({ show:true,text:'Please try again Later' })
      return
    }
    

    // Add user to Mysql database
    const res = await fetch(`${AllKeys.ipAddress}/SignupUser?customization=${customization}&referral=${referralCode}&email=${email}&number=${number}&firstname=${firstname}&lastname=${lastname}&password=${password}`)
    const result = await res.json()

    if (result.success) {
      let obj = {
        id:result.userID,
        firstname,
        number,
        lastname,
        email,
        customization
      }

      setStorageData(result.userID)
      setIsPending(false)
      dispatch(SignupUser(obj)) 
    }else if (result.response === 'Invalid referral code') {
      setError(preEvents => {
        return{...preEvents, referral:true,text:`${result.response}`}
      })
      openSurveyRef.current.fadeOutDown(400)
      setTimeout(() => {
        setShowSurvey(false)
        setIsPending(false)
        Vibration.vibrate(PATTERN)
        lastFormRef.current.fadeInUp(200)
        referralRef.current.shake(500)
      }, 600);
    }
    else{
      setIsPending(false)
      showMessage({
        type:'danger',
        message:'Error',
        description:'There was an error connecting to the database',
        duration:5000
      })
    }
  }
  // END OF SIGNUP USERS
  const changeNumber = (val) => {
    if (error.numberField) {
      setError(preEvents => {
        return {...preEvents, numberField:false}
      })
    }
    setNumber(val)
  }
  const changeOtpInput = () => {
    if (error.otp) {
      setError(preEvents => {
        return {...preEvents, otp:false}
      })
    }
  }
  const changeFirstName = (val) => {
    if (!val) {
      firstNameRef.current.shake(500)
      Vibration.vibrate(PATTERN)
      setError(preEvents => {
        return{...preEvents, firstname:true,text:'Cannot be empty'}
      })
    }else if (error.firstname) {
      setError(preEvents => {
        return{...preEvents, firstname:false}
      })
    }
    setFirstname(val)
  }
  const changeLastName = (val) => {
    if (!val) {
      lastNameRef.current.shake(500)
      Vibration.vibrate(PATTERN)
      setError(preEvents => {
        return{...preEvents, lastname:true,text:'Cannot be empty'}
      })
    }else if (error.lastname) {
      setError(preEvents => {
        return{...preEvents, lastname:false}
      })
    }
    setLastname(val)
  }
  const changeModal = () => {
      setModalVisible({
        show:false,
        text:''
      })
  }
    // const updatePin = (pin) => {
    //     setOtpCode(pin)
    // }
  return (
      <>
    <MyModal changeModal={changeModal} modalVisible={modalVisible} />
      <AnimatedLoader
        visible={isPending}
        overlayColor="rgba(0,0,0,0.75)"
        source={require('../../lottie/circle2.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
    <ProgressBar progress={progress} color={colors.grey} width={null} borderWidth={1} style={{ position:'absolute',width:'100%',zIndex:2,elevation:2 }} />
    <Onboarding
      subTitleStyles={{ width:width,zIndex:2,fontFamily:'viga',fontSize:20,alignSelf:'center',color:colors.white}}
      ref={onboardingRef}
      bottomBarHeight={0}
      showPagination={false}
      flatlistProps={{ scrollEnabled:false }}
      imageContainerStyles={{ paddingBottom:0 }}
      containerStyles={{ backgroundColor:'#000000' }}
      bottomBarColor={'#000000'}
      bottomBarHighlight={false}
    pages={[
    {
      backgroundColor: `${colors.black}`,
      subTitleStyles:{},
      title: '',
      image: <ImageBackground 
        style={{width:'100%',height:'100%'}}
        resizeMode="cover"
        source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png'}}
    />,
      subtitle: 
        <View style={styles.content}>
            <View style={{  }}>
                <Text style={styles.heading}>Signup and</Text>
                <Text style={{...styles.heading, fontSize:24 }}>get rid of cleaning now</Text>
            </View>
            <Animatable.View ref={mobileRef}>
              <PhoneInput
                onChangePhoneNumber={(val) => changeNumber(val)}
                initialValue={number}
                style={error.numberField ? {...styles.textInput, borderColor:'red',borderWidth:2,backgroundColor:'pink'} : styles.textInput}
                flagStyle={{ marginHorizontal:10 }}
                allowZeroAfterCountryCode={false}
                textStyle={{ letterSpacing:1 }}
                ref={input}
                initialCountry={'ng'}
                translation="eng"
              />
            </Animatable.View>
            {
              error.numberField ?
              <Text style={styles.errorText}>{error.text}</Text>
              :
              null
            }
            {
              otpIsPending
              ?
              <View style={{...styles.button, backgroundColor:colors.lightPurple}}>
                <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
              </View>
              :
              <TouchableNativeFeedback onPress={() => submitNumber()}>
                  <View style={styles.button}>
                      <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>SEND OTP</Text>
                  </View>
              </TouchableNativeFeedback>
            }
        </View>,
    },
    {
      backgroundColor: `${colors.black}` ,
      title: '',
      image: <ImageBackground 
      style={{width:'100%',height:'100%',bottom:0}}
    resizeMode="cover"
      source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background2_purple.png'}} />,
      subtitle: <View style={styles.content}>
      <View style={{ marginBottom:30 }}>
          <Text style={styles.heading}>Verify OTP</Text>
          <Text style={{ color:colors.grey,textAlign:'center' }}>OTP has been sent to {number}</Text>
      </View>
      <Otp error={error.otp} changeOtpInput={changeOtpInput} confirmCode={confirmCode} />
      {
        error.otp ?
        <Text style={styles.errorText}>{error.text}</Text>
        :
        null
      }
      <TouchableNativeFeedback onPress={confirmCode}>
        <View style={styles.button}>
            <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Verify OTP</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={sendVerification}>
        <View style={{...styles.button, backgroundColor:'transparent',borderColor:colors.purple, borderWidth:1}}>
          <Text style={{ color:colors.whitishBlue,textAlign:'center' }}>Resend OTP</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableOpacity onPress={() => onboardingRef.current.goToPage(0, true)}>
        <View style={styles.backButton}>
            <AntDesign name="arrowleft" style={{ top:Dimensions.get('window').height < 596 ? 30 : 0,shadowColor:'black' }} size={24} color="black" />
        </View>
      </TouchableOpacity>
  </View>,
    },
    {
      backgroundColor: `${colors.black}` ,
      title: '',
      image: <ImageBackground 
      style={{width:'100%',height:'100%',bottom:0}}
    resizeMode="cover"
      source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png'}} />,
      subtitle: 
      <View style={{...styles.content, top:'5%'}}>
      <View style={{ marginBottom:30 }}>
          <Text style={{...styles.heading,fontSize:40}}>We're almost there...</Text>
      </View>
     <Animatable.View ref={firstNameRef} style={error.firstname ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
        <View>
            <FontAwesome name="user" size={24} color={colors.black} />
        </View>
        <TextInput
          style={styles.input} 
          value={firstname} 
          onChangeText={(val) => changeFirstName(val)} 
          placeholder='Please Enter Firstname' 
          placeholderTextColor={colors.black} 
        />
     </Animatable.View>
        {
            error.firstname ?
            <Text style={styles.errorText}>{error.text}</Text>
            :
            null
        }
     <Animatable.View ref={lastNameRef} style={error.lastname ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
        <View>
            <FontAwesome name="user" size={24} color={colors.black} />
        </View>
        <TextInput 
          style={styles.input} 
          value={lastname} 
          onChangeText={(val) => changeLastName(val)} 
          placeholder='Please Enter Lastname' 
          placeholderTextColor={colors.black}
        />
     </Animatable.View>
        {
            error.lastname ?
            <Text style={styles.errorText}>{error.text}</Text>
            :
            null
        }
      <TouchableNativeFeedback onPress={() => proceedToEmail()}>
        <View style={styles.button}>
            <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Next</Text>
        </View>
      </TouchableNativeFeedback>
  </View>,
    },
    {
      backgroundColor: `${colors.black}` ,
      title: '',
      image: <ImageBackground 
      style={{width:'100%',height:'100%',bottom:0}}
    resizeMode="cover"
      source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png'}} />,
      subtitle:
      <> 
        <Animatable.View ref={openSurveyRef} animation='fadeOutDown' style={{...styles.content,flex:1,top:'0%',height:height}}>
        <View style={{ marginBottom:10 }}>
            <Text style={{ ...styles.heading,fontSize:27,marginBottom:5,fontFamily:'viga' }}>Which one describes you best?</Text>
            <Text style={{ ...styles.heading,fontSize:15 }}>We use this information to personalize our services to you</Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1,paddingBottom:100 }}>
          <>
          <View style={{ flexDirection:'row',justifyContent:'space-around',marginVertical:10}}>
            <TouchableNativeFeedback onPress={() => setOptionSurvey({ single:false,married:true,student:false,graduate:false,retired:false,working:false })}>
              <View style={optionSurvey.married ?{...styles.selectSurveyBox,borderColor:colors.purple,borderWidth:3} : styles.selectSurveyBox}> 
                {/* <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/mother.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:100,height:100 }}  /> */}
                {
                  optionSurvey.married
                  ?
                  <View style={{ alignSelf:'flex-end',position:'absolute',margin:10,paddingRight:10 }}>
                      <AntDesign name="checkcircle" size={14} color={colors.purple} />
                  </View>
                  :
                  null
                }
                <AnimatedLottieView 
                  source={require('../../lottie/married-parent.json')}
                  autoPlay={true}
                  loop={true}
                  resizeMode={'contain'}
                  style={{ width:100,height:100 }}
                />
                <Text style={{ fontFamily:'Murecho',fontSize:14 }}>Married Parent</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => setOptionSurvey({ single:true,married:false,student:false,graduate:false,retired:false,working:false })}>
            <View style={optionSurvey.single ? {...styles.selectSurveyBox,borderColor:colors.purple,borderWidth:3} : styles.selectSurveyBox}> 
              {/* <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/father.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:100,height:100 }}  /> */}
              {
                optionSurvey.single
                ?
                <View style={{ alignSelf:'flex-end',position:'absolute',margin:10,paddingRight:10 }}>
                    <AntDesign name="checkcircle" size={14} color={colors.purple} />
                </View>
                :
                null
              }
              <AnimatedLottieView 
                source={require('../../lottie/single-parent.json')}
                autoPlay={true}
                loop={true}
                resizeMode={'contain'}
                style={{ width:100,height:100 }}
              />
              <Text style={{ fontFamily:'Murecho',fontSize:14 }}>Single Parent</Text>
            </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ flexDirection:'row',justifyContent:'space-around',marginVertical:10}}>
            <TouchableNativeFeedback onPress={() => setOptionSurvey({ single:false,married:false,student:true,graduate:false,retired:false,working:false })}>
            <View style={optionSurvey.student ?{...styles.selectSurveyBox,borderColor:colors.purple,borderWidth:3} : styles.selectSurveyBox}> 
              {
                optionSurvey.student
                ?
                <View style={{ alignSelf:'flex-end',position:'absolute',margin:10,paddingRight:10 }}>
                    <AntDesign name="checkcircle" size={14} color={colors.purple} />
                </View>
                :
                null
              }
              {/* <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/student.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:100,height:100 }}  /> */}
              <AnimatedLottieView 
                source={require('../../lottie/student.json')}
                autoPlay={true}
                loop={true}
                resizeMode={'contain'}
                style={{ width:100,height:100 }}
              />
              <Text style={{ fontFamily:'Murecho',fontSize:14 }}>Student</Text>
            </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => setOptionSurvey({ single:false,married:false,student:false,graduate:true,retired:false,working:false })}>
            <View style={optionSurvey.graduate ?{...styles.selectSurveyBox,borderColor:colors.purple,borderWidth:3} : styles.selectSurveyBox}> 
              {/* <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/graduate-transformed.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:100,height:100 }}  /> */}
              {
                optionSurvey.graduate
                ?
                <View style={{ alignSelf:'flex-end',position:'absolute',margin:10,paddingRight:10 }}>
                    <AntDesign name="checkcircle" size={14} color={colors.purple} />
                </View>
                :
                null
              }
              <AnimatedLottieView 
                source={require('../../lottie/graduate.json')}
                autoPlay={true}
                loop={true}
                resizeMode={'contain'}
                style={{ width:100,height:100 }}
              />
              <Text style={{ fontFamily:'Murecho',fontSize:14 }}>Graduate</Text>
            </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ flexDirection:'row',justifyContent:'space-around',marginVertical:10}}>
            <TouchableNativeFeedback onPress={() => setOptionSurvey({ single:false,married:false,student:false,graduate:false,retired:false,working:true })}>
              <View style={optionSurvey.working ?{...styles.selectSurveyBox,borderColor:colors.purple,borderWidth:3} : styles.selectSurveyBox}>
                {/* <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/graduate-transformed.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:100,height:100 }}  /> */}
                {
                  optionSurvey.working
                  ?
                  <View style={{ alignSelf:'flex-end',position:'absolute',margin:10,paddingRight:10 }}>
                      <AntDesign name="checkcircle" size={14} color={colors.purple} />
                  </View>
                  :
                  null
                }
                <AnimatedLottieView 
                  source={require('../../lottie/working-adult.json')}
                  autoPlay={true}
                  loop={true}
                  resizeMode={'contain'}
                  style={{ width:100,height:100 }}
                />
                <Text style={{ fontFamily:'Murecho',fontSize:14,textAlign:'center' }}>Working adult</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => setOptionSurvey({ single:false,married:false,student:false,graduate:false,retired:true,working:false })}>
            <View style={optionSurvey.retired ?{...styles.selectSurveyBox,borderColor:colors.purple,borderWidth:3} : styles.selectSurveyBox}>
              {/* <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/father.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:100,height:100 }}  /> */}
              {
                optionSurvey.retired
                ?
                <View style={{ alignSelf:'flex-end',position:'absolute',margin:10,paddingRight:10 }}>
                    <AntDesign name="checkcircle" size={14} color={colors.purple} />
                </View>
                :
                null
              }
              <AnimatedLottieView 
                source={require('../../lottie/retired.json')}
                autoPlay={true}
                loop={true}
                resizeMode={'contain'}
                style={{ width:100,height:100 }}
              />
              <Text style={{ fontFamily:'Murecho',fontSize:14,textAlign:'center' }}>Retired/Older generation</Text>
            </View>
            </TouchableNativeFeedback>
          </View>
          {
            !optionSurvey.graduate && !optionSurvey.retired && !optionSurvey.married && !optionSurvey.student && !optionSurvey.single && !optionSurvey.working
            ?
            <LinearGradient start={{ x: 0.4, y: 0.1 }} end={{ x:0.5,y:1 }} colors={[colors.grey, colors.white]} style={styles.button}>
              <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.black,opacity:0.6 }}>FINISH</Text>
            </LinearGradient>
            :
            <TouchableNativeFeedback onPress={() => signUpUsers()}>
              <LinearGradient start={{ x: 0.9, y: 0.1 }} end={{ x:0.5,y:1 }} colors={[colors.purple, colors.darkPurple]} style={styles.button}>
                <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.white }}>FINISH</Text>
              </LinearGradient>
            </TouchableNativeFeedback>
          }
          </>
          </ScrollView>
        </Animatable.View>
        {
        !showSurvey &&
        <Animatable.View ref={lastFormRef} style={{...styles.content, top:'5%'}}>
          <View style={{ marginBottom:30 }}>
              <Text style={styles.heading}>Hurray!!!</Text>
              <Text style={{ ...styles.heading,fontSize:24 }}>Let's finish this together</Text>
          </View>
          <Animatable.View ref={emailRef} style={error.email ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
            <View>
              <MaterialIcons name="email" size={24} color={colors.black} />
            </View>
            <TextInput 
              style={styles.input} 
              keyboardType='email-address'
              value={email}
              onChangeText={(val) => setEmail(val)}
              placeholder='Please Enter Email'
              placeholderTextColor={colors.black} 
            />
          </Animatable.View>
            {
                error.email ?
                <Text style={styles.errorText}>{error.text}</Text>
                :
                null
            }
            <Animatable.View ref={passwordRef} style={error.password ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
               <View>
                 <MaterialIcons name="lock" size={24} color={colors.black} />
               </View>
               <TextInput 
                  style={styles.input} 
                  value={password} 
                  onChangeText={(val) => setPassword(val)} 
                  placeholder='Please Enter Password' 
                  placeholderTextColor={colors.black}
                  secureTextEntry={showPassword.secureTextEntry}
               />
               <View style={{ position:'absolute',left:'100%' }}>
                  <Entypo name={!showPassword.eye ? "eye" : "eye-with-line"} size={24} color={colors.black} onPress={() => setShowPassword({
                    eye: !showPassword.eye,
                    secureTextEntry: !showPassword.secureTextEntry
                  })}/>
               </View>
            </Animatable.View>
            {
                error.password ?
                <Text style={styles.errorText}>{error.text}</Text>
                :
                null
            }
            <Animatable.View ref={rPasswordRef} style={error.rpassword ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
               <View>
                 <MaterialIcons name="lock" size={24} color={colors.black} />
               </View>
               <TextInput 
                  style={styles.input} 
                  value={rPassword} 
                  onChangeText={(val) => setRPassword(val)} 
                  placeholder='Repeat Password' 
                  placeholderTextColor={colors.black}
                  secureTextEntry={showRPassword.secureTextEntry}
               />
               <View style={{ position:'absolute',left:'100%' }}>
                  <Entypo name={!showRPassword.eye ? "eye" : "eye-with-line"} size={24} color={colors.black} onPress={() => setShowRPassword({
                    eye: !showRPassword.eye,
                    secureTextEntry: !showRPassword.secureTextEntry
                  })}/>
               </View>
            </Animatable.View>
            {
                error.rpassword ?
                <Text style={styles.errorText}>{error.text}</Text>
                :
                null
            }
            <Animatable.View ref={referralRef} style={error.referral ? {...styles.parentInput, backgroundColor:'pink' } : styles.parentInput}>
              <View>
                <Ionicons name="people-sharp" size={24} color={colors.black} />
              </View>
              <TextInput 
                style={styles.input} 
                value={referralCode} 
                onChangeText={(val) => setReferralCode(val)} 
                placeholder='Enter referral code (optional)' 
                placeholderTextColor={colors.black}
              />
            </Animatable.View>
            {
                error.referral ?
                <Text style={styles.errorText}>{error.text}</Text>
                :
                null
            }
          <TouchableNativeFeedback onPress={() => verifyLastDetails()}>
            <View style={styles.button}>
                <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Sign Up</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableOpacity onPress={() => onboardingRef.current.goToPage(2, true)}>
            <View style={styles.backButton}>
                <AntDesign name="arrowleft" style={{ top:Dimensions.get('window').height < 596 ? 30 : 0,shadowColor:'black' }} size={24} color="black" />
            </View>
          </TouchableOpacity>
        </Animatable.View>
      }
      </>
    },
  ]}
/>
</>
  )
}

const styles = StyleSheet.create({
    heading:{
        fontFamily:'Funzi',
        fontSize:54,
        color:colors.whitishBlue
    },
    errorText:{
        fontSize:12,
        color:'red'
    },
    content:{
        padding:20,
        marginTop:40,
        position:'absolute',
        width:'100%',
        top:'10%'
    },
    lottie: {
        width: 100,
        height: 100
    },
    parentInput:{
      marginVertical:10,
      backgroundColor:colors.grey,
      justifyContent:'space-between',
      alignItems:'center',
      borderRadius:10,
      flexDirection:'row',
      paddingHorizontal:20
    },
    input:{
        padding: width > 375 ? 15 : 10,
        fontFamily:'viga',
        paddingHorizontal:20,
        width:'100%',
        color:colors.black,

    },
    textInput: {
        height: 60,
        marginTop:30,
        borderRadius: 10,
        alignItems:'center',
        alignSelf:'center',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor:colors.white
      },
    button: {
        backgroundColor:colors.yellow,
        padding:10,
        marginVertical:10,
        borderRadius:10
    },
    backButton: {
      shadowOpacity:0.2,
      shadowOffset:{ width:5,height:5 },
      borderRadius:20,
      height:30,
      width:30,
      backgroundColor:colors.white,
      justifyContent:'center',
      alignItems:'center',
      elevation:3,
      marginTop:20
    },
    selectSurveyBox:{
      alignItems:'center',
      backgroundColor:colors.grey,
      borderRadius:10,
      padding:20,
      marginHorizontal:10,
      width:'45%',
    }
})
