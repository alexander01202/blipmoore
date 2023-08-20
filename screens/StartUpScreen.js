import React, { useEffect } from 'react'
import { ActivityIndicator,ImageBackground,StyleSheet,View } from 'react-native'
import { colors } from '../colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { AllKeys } from  '../keys/AllKeys'
import { CometChat } from '@cometchat-pro/react-native-chat'

export default function StartUpScreen() {
    const dispatch = useDispatch()
    useEffect(() => {
      const tryLogin = async() => {
        const userData = await AsyncStorage.getItem('userData')
        if (!userData) {
            dispatch({ type: 'AUTH_IS_READY', isLogin:false})
            return
        }
        const transformedData = JSON.parse(userData)
        const { id } = transformedData
        const res = await fetch(`${AllKeys.ipAddress}/GetId?id=${id}`)
        const { success } = await res.json()
        if (success) {
          dispatch({ type: 'AUTH_IS_READY', isLogin:true})
          return
        }else{
          CometChat.logout().then(
            () => {
              console.log("Logout completed successfully");
            },error=>{
              console.log("Logout failed with exception:",{error});
            }
          );
          AsyncStorage.removeItem('userData')
          dispatch({ type: 'AUTH_IS_READY', isLogin:false})
        }
      }

      tryLogin()
    }, []);
    

  return (
    <View style={styles.container}>
      <ImageBackground resizeMode='contain' style={{ flex:1,width:'100%',height:'100%' }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/splash.png'}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    }
});
