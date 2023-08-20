import {useEffect,useState,useRef} from 'react';
import { StyleSheet, Text, View,SafeAreaView,TextInput,ImageBackground,Dimensions,TouchableOpacity,Vibration, TouchableNativeFeedback } from 'react-native'
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from 'react-native-animatable';
import { Entypo,FontAwesome5,MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../colors/colors';
import { AllKeys } from '../../keys/AllKeys';
import MyModal from '../../components/modal';

const {width,height} = Dimensions.get('window')
export default function ForgottenPwd({ navigation }) {
    const [email,setEmail] = useState('')
    const [empty, setEmpty] = useState({ email:false })
    const emailRef = useRef(null)
    const [isPending,setIsPending] = useState(false)
    const [error,setError] = useState({ field1:false })
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const ONE_SECOND_IN_MS = 50;
    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS
    ];
    const sendPwdLink = async() => {
        setIsPending(true)
        var req = await fetch(`${AllKeys.ipAddress}/resetPwd?email=${email}`)
        const { success } = await req.json()

        setIsPending(false)
        if (success) {
            setEmail('')
            setModalVisible({ show:true,text:'Success. Please check your email!!' })
        }else{
            setModalVisible({ show:true,text:'Please try again later.' })
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
    const changeModal = () => {
        setModalVisible({
          show:false,
          text:''
        })
    }
  return (
    <>
    <MyModal changeModal={changeModal} modalVisible={modalVisible} />
    <ImageBackground style={{ flex:1 }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png'}}>
        <AnimatedLoader
        visible={isPending}
        overlayColor="rgba(0,0,0,0.7)"
        source={require('../../lottie/circle2.json')}
        animationStyle={styles.lottie}
        speed={1}
        />
        <SafeAreaView>
            <View style={styles.content}>
            <View style={{ marginBottom:50 }}>
                <Text style={{ fontFamily:'Funzi',fontSize:54,color:colors.whitishBlue }}>Reset Password</Text>
                {/* <Text style={{ fontFamily:'viga',fontSize:20,color:colors.white,letterSpacing:1 }}>Reset Password</Text> */}
            </View>
            <Animatable.View ref={emailRef} style={error.field1 || empty.email ? {...styles.parentInput, borderColor:'red' } : styles.parentInput}>
                <MaterialIcons name="email" size={24} color={colors.purple} />
                <TextInput 
                autoFocus style={styles.input} value={email} 
                onChangeText={(val) => updateEmail(val)} 
                placeholder='Please Enter Email' 
                placeholderTextColor={colors.black} 
                />
            </Animatable.View>
                {
                error.field1 ?
                <Text style={styles.errorText}>Your Email is incorrect</Text>
                :
                null
                }
            <TouchableNativeFeedback onPress={() => sendPwdLink()}>
                <View style={styles.button}>
                    <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Reset Password</Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableOpacity onPress={() => navigation.pop()}>
                <View>
                    <Text style={{ fontFamily:'viga',color:'#004aad',textDecorationLine:'underline' }}>Go back</Text>
                </View>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    </ImageBackground>
    </>
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