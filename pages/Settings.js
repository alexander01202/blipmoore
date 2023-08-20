import React, { useRef, useState } from 'react';
import { Text, View,StyleSheet, TextInput ,Dimensions,TouchableOpacity, ScrollView, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../colors/colors';
import { Feather,AntDesign,Octicons } from '@expo/vector-icons';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReferModal from './referModal/ReferModal';
import FastImage from 'react-native-fast-image'
import { AllKeys } from '../keys/AllKeys';
import { CometChat } from '@cometchat-pro/react-native-chat'

const {width,height} = Dimensions.get('window')
export default function Settings({ navigation }) {
    const [textChange, setTextChange] = useState(false)
    const { id,displayName,email,number,lastName } = useSelector(state => state.login)
    const [empty,setEmpty] = useState({ fname:false,lname:false,email:false })
    const [fname,setFname] = useState(displayName)
    const first_name = useRef(null)
    const [lname,setLname] = useState(lastName)
    const last_name = useRef(null)
    const [userEmail,setEmail] = useState(email)
    const user_email = useRef(null)
    const [showReferModal,setShowReferModal] = useState(false)
    const dispatch = useDispatch()

   const logOut = async() => {
    await AsyncStorage.removeItem('userData')
    CometChat.logout().then(
        () => {
          console.log("Logout completed successfully");
        },error=>{
          console.log("Logout failed with exception:",{error});
        }
    );
    dispatch({ type: 'AUTH_IS_READY', isLogin:false})
   }      
   const doneEditing = async(field,val) => {
       if (!fname) {
           return
       }if (!lname) {
           return
       }if (!userEmail) {
           return
       }
       fetch(`${AllKeys.ipAddress}/updateUserInfo?email=${userEmail}&firstname=${fname}&lastname=${lname}&id=${id}`)
       dispatch({ type:'UPDATE_USER', payload: { email:userEmail,displayName:fname,lastname:lname } })
       setTextChange(false)
   }
   const changeShowReferModal = () => {
    setShowReferModal(!showReferModal)
   }
   const changeFirstName = (val) => {
        if (!val) {
            first_name.current.shake(500)
            setEmpty(preEvents => {
                return{...preEvents, fname:true}
            })
        }else if (empty.fname) {
            setEmpty(preEvents => {
                return{...preEvents, fname:false}
            })
        }
        if (val !== displayName && val) {
            setTextChange(true)
        }else{
            setTextChange(false)
        }
        setFname(val)
   }
   const changeLastName = (val) => {
        if (!val) {
            last_name.current.shake(500)
            setEmpty(preEvents => {
                return{...preEvents, lname:true}
            })
        }else if (empty.lname) {
            setEmpty(preEvents => {
                return{...preEvents, lname:false}
            })
        }
        if (val !== lastName && val !== '' && val) {
            setTextChange(true)
        }else{
            setTextChange(false)
        }
        setLname(val)
   }
   const changeEmail = (val) => {
        if (!val) {
            user_email.current.shake(500)
            setEmpty(preEvents => {
                return{...preEvents, email:true}
            })
        }else if (empty.userEmail) {
            setEmpty(preEvents => {
                return{...preEvents, email:false}
            })
        }
        if (val !== userEmail && val !== '' && val) {
            setTextChange(true)
        }else{
            setTextChange(false)
        }
        setEmail(val)
   }
  return (
      <>
      <ReferModal changeShowReferModal={changeShowReferModal} showReferModal={showReferModal} />
        <View style={styles.container}>
            <SafeAreaView>
            <ScrollView contentContainerStyle={{ alignItems:'center' }}>
            <TouchableOpacity style={{ width:'100%',alignItems:'flex-end' }} onPress={logOut}>
                <View>
                    <Text style={{ color:colors.black }}>Logout</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.avatar}>
                {/* <Text style={styles.avatarText}>{displayName.slice(0,1)}{lastName.slice(0,1)}</Text> */}
                <FastImage fallback={true} style={{ width:'100%',height:'100%' }} resizeMode={FastImage.resizeMode.contain} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/web+images/logo/logo.png',priority: FastImage.priority.normal}} />
            </View>
            <Text style={{ color:colors.black,fontSize:24,fontFamily:'viga',letterSpacing:1 }}>{displayName}{' '}{lastName}</Text>
            <View style={{ width:'100%',marginVertical:10 }}>
                <View style={{ marginVertical:10,alignSelf:'center' }}>
                    <Text style={{ fontSize:20 }}>Edit Your Details</Text>
                </View>
                <View style={{ width:'100%',marginVertical:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
                    <View>
                        <Text style={{ textDecorationLine:'underline',color:colors.purple }}>Change Password?</Text>
                    </View>
                    <View>
                        <Text style={{ textDecorationLine:'underline',color:colors.purple }}>Update Address?</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>First Name</Text>
                    <Animatable.View ref={first_name} style={empty.fname ? {...styles.field, borderColor:'red',backgroundColor:'pink'} : styles.field}>
                        <Ionicons style={styles.icon} name="person-outline" size={24} color="black" />
                        <TextInput style={styles.input} defaultValue={displayName} value={fname} onChangeText={(val) => changeFirstName(val)} />
                    </Animatable.View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>Last Name</Text>
                    <Animatable.View ref={last_name} style={empty.lname ? {...styles.field, borderColor:'red',backgroundColor:'pink'} :styles.field}>
                        <Ionicons style={styles.icon} name="person-outline" size={24} color="black" />
                        <TextInput style={styles.input} defaultValue={lastName} value={lname} onChangeText={(val) => changeLastName(val)} />
                    </Animatable.View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>Email</Text>
                    <Animatable.View ref={user_email} style={empty.email ? {...styles.field, borderColor:'red',backgroundColor:'pink'} :styles.field}>
                        <Octicons style={styles.icon} name="mail" size={24} color="black" />
                        <TextInput style={styles.input} defaultValue={email} value={userEmail} onChangeText={(val) => changeEmail(val)} />
                    </Animatable.View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>Mobile Number</Text>
                    <View style={styles.field}>
                        <Feather style={styles.icon} name="phone" size={24} color="black" />
                        <TextInput editable={false} style={styles.input} value={number} />
                    </View>
                </View>
            </View>
            {
                textChange ?
                <TouchableOpacity style={styles.button} onPress={doneEditing}>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <Feather name="refresh-ccw" size={20} color="white" />
                        <Text style={{ color:colors.white,fontFamily:'viga',fontSize:20,marginHorizontal:10 }}>Update</Text>
                    </View>
                </TouchableOpacity>
                :
                <View style={{...styles.button, opacity:0.6}}>
                    <Feather name="refresh-ccw" size={20} color="white" />
                    <Text style={{ color:colors.white,fontFamily:'viga',fontSize:20,marginHorizontal:10 }}>Update</Text>
                </View>
            }
            </ScrollView>
            </SafeAreaView>
        </View>
    </>  
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
        paddingBottom:25
    },
    avatar:{
        borderRadius:100,
        padding:10,
        width:120,
        height:120,
        backgroundColor:'#c8c8c8',
        marginVertical:10,
        alignItems:'center',
        justifyContent:'center'
    },
    avatarText:{
        fontFamily:'Funzi',
        fontSize:42,
        color:colors.darkPurple
    },
    field:{
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        backgroundColor:colors.lightPurple,
        borderColor:colors.purple,
        borderWidth:1,
        padding:5,
        paddingHorizontal:10,
        marginTop:5,
    },
    icon:{
        borderRightColor:colors.black,
        borderRightWidth:1,
        paddingRight:10
    },
    input:{
        width:'90%',
        padding:width > 375 ? 10 : 5,
        paddingHorizontal:10,
        fontSize:width > 375 ? 16 : null
    },
    title:{
        fontFamily:'viga',
        fontSize:16,
        color:colors.black
    },
    button:{
        backgroundColor:colors.black,
        borderRadius:10,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        width:'100%',
        padding:10
    },
    inputContainer:{
        marginVertical:10
    }
})