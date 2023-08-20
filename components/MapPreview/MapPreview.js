import React, { useState, useEffect, useCallback } from 'react'
import { View,StyleSheet,Text,ActivityIndicator,Dimensions,TouchableOpacity,Easing, Button } from 'react-native'
import Animated from 'react-native-reanimated';
import * as Location from 'expo-location';
import { colors } from '../../colors/colors';
import MapView,{ Marker, PROVIDER_GOOGLE  } from 'react-native-maps'
import { TapGestureHandler } from 'react-native-gesture-handler';
import MyModal from '../modal';
import { useDispatch } from 'react-redux';
import { LOCATION } from '../../redux/actions/actions';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';

import ViewBox from './component/viewBox';
import SkeletonLoader from './component/SkeletonLoader';
import Options from './component/Options';


import { GOOGLE_MAPS_APIKEY } from '../../apikey';
import MapViewDirections from 'react-native-maps-directions';


const {width,height} = Dimensions.get('window')

export default function MapPreview({ children,navigation }) {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [error,setError] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [runLocation,setRunLocation] = useState(true)
    const [orderState,setOrderState] = useState('order')
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [locationInterval,setLocationInterval] = useState()
    const [acceptedCleanerId,setAcceptedCleanerId] = useState(null)
    const [cleanersLocation,setCleanersLocation] = useState(null)
    const [orderId,setOrderId] = useState(null)
    const [refreshCleaner,setRefreshCleaner] = useState(false)

    const dispatch = useDispatch()
    const selector = useSelector(state => state.location)
    const login = useSelector(state => state.login)
    const orderInfo = useSelector(state => state.Order)

    const { Value,Extrapolate } = Animated
    const buttonOpacity = useRef(new Value(1)).current

    const mapRef = useRef(null)

    const requestCleaner = async() => {
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in
      }).start();

      // if (orderState !== 'accepted') {
      //   const updateReqeustStatus = await fetch(`http://192.168.100.12:19002/updateReqeustStatus?id=${login.id}&request=pending`)
      //   const { success } =  await updateReqeustStatus.json()
      //   if (success) {

      //   } 
      // }
    };
    const fadeOut = () => {
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.in
      }).start();
    };

    const buttonY = buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    })
    const textInputZindex = buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1,-1],
      extrapolate: Extrapolate.CLAMP
    })
    const textInputOpacity = buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1,0],
      extrapolate: Extrapolate.CLAMP
    })
    const textInputY = buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0,100],
      extrapolate: Extrapolate.CLAMP
    })
    useEffect(() => {
      if (login.banned === 'ban') {
        setModalVisible({
          show:true,
          text:'YOU HAVE BEEN BANNED FROM THIS PLATFORM',
          banned:true
        })
      }else{
        setModalVisible({
          show:false,
          text:'YOU HAVE BEEN BANNED FROM THIS PLATFORM',
          banned:true
        })
      }
      const getNotificationId = async() => {
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
            allowCriticalAlerts: true,
          }
        }).then(async() => {
          if (Platform.OS === 'ios') {
            const checkNotificationStatus = await Notifications.getPermissionsAsync()
            if (!checkNotificationStatus.status || checkNotificationStatus.ios.status !== Notifications.IosAuthorizationStatus.AUTHORIZED) {
              throw new Error('Did not allow notifications')
            } 
          }
        }).then(() => {
          return Notifications.getExpoPushTokenAsync()
        }).then(response => {
          const notificationId = response.data
          fetch(`http://192.168.100.12:19002/updateNotificationId?notificationId=${notificationId}&id=${login.id}`)
        })
      }
      getNotificationId()
        const getUserLocations = async() => {
          const userData = await AsyncStorage.getItem('userData')
          if (!userData) {
              dispatch({ type: 'AUTH_IS_READY', isLogin:false})
              return
          }
          const transformedData = JSON.parse(userData)
          const { id } = transformedData

          let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setModalVisible({
                  show: true,
                  text: 'Please Enable Location to use this app'
                })
                return;
              }
              
              setIsPending(true)
              try {
                let { latitude,longitude } = (await Location.getCurrentPositionAsync({})).coords;
                const res = await fetch(`http://192.168.100.12:19002/updateLocation?latitude=${latitude}&longitude=${longitude}&id=${id}`)
                const result = await res.json();
                if (result.success) {
                  dispatch(LOCATION(latitude,longitude))
                  setCurrentLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0012,
                    longitudeDelta: 0.002
                  }); 
                  if (login.role === 'worker') {
                    fetch(`http://192.168.100.12:19002/updateCleanerLocation?latitude=${latitude}&longitude=${longitude}&id=${login.id}`) 
                  }
                }
              } catch (err) {
                  setCurrentLocation(null)
                  setModalVisible({
                    show: true,
                    text: 'Could not fetch Location'
                  })
                  console.log(err.message)
              }
              setIsPending(false)
        }
      getUserLocations()
  
    }, [runLocation]);

    useEffect(async() => {
      let Newlocation;
      // const googleLoc = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_APIKEY}`)
      // const googleLocRes = await googleLoc.text()
      // console.log(googleLocRes)
      
      if (currentLocation !== null && !login.banned) {
        if (orderState !== 'accepted') {
          let interval = setInterval(() => {
            a()
            if (orderState === 'accepted') {
              clearInterval(interval)
            }
          }, 15000);
          setTimeout(() => {
            setLocationInterval(interval)
          }, 20000);
        }

        const a = async() => {
          Newlocation = await Location.getCurrentPositionAsync({ accuracy:Location.Accuracy.High })
          if(Newlocation.coords.latitude < (selector.latitude + 0.00001) && Newlocation.coords.longitude < (selector.longitude + 0.00001)){
           
          }else{
            console.log('distance changed')
            const res = await fetch(`http://192.168.100.12:19002/updateLocation?latitude=${Newlocation.coords.latitude}&longitude=${Newlocation.coords.longitude}&id=${login.id}`)
            dispatch(LOCATION(Newlocation.coords.latitude,Newlocation.coords.longitude))
            if (login.role === 'worker') {
              fetch(`http://192.168.100.12:19002/updateCleanerLocation?latitude=${Newlocation.coords.latitude}&longitude=${Newlocation.coords.longitude}&id=${login.id}`)
            }
          }
        }
      }
      if (orderState === 'accepted') {
        clearInterval(locationInterval)
      }
    
      return () => {
        clearInterval(locationInterval)
      };
    }, [currentLocation,orderState]);
    
    // const destination = {latitude: 7.876567, longitude: 2.987656};

    useEffect(() => {
      if (!cleanersLocation || !selector ||!mapRef.current ) return;
    
      if (orderState === 'accepted') {
        setTimeout(() => {
          mapRef.current.fitToSuppliedMarkers(['origin','destination'], {
            edgePadding: {top: 150, right:150, left:150,bottom:350 },
          })
        }, 5000); 
      }
    }, [mapRef,orderState,isPending])

    // check if user has an order
    useEffect( async() => {
      // const checkIfUserHasOrder = await fetch(`http://192.168.100.12:19002/checkIfUserHasOrder?id=${login.id}&state=accepted`)
      // const { success,rows } = await checkIfUserHasOrder.json()
      // const checkIfUserHasOrderArrived = await fetch(`http://192.168.100.12:19002/checkIfUserHasOrder?id=${login.id}&state=arrived`)
      // const ArrivedRow = await checkIfUserHasOrderArrived.json()
      // const checkIfUserHasOrderCompleted = await fetch(`http://192.168.100.12:19002/checkIfUserHasOrder?id=${login.id}&state=completed`)
      // const CompletedRow = await checkIfUserHasOrderCompleted.json()
      console.log('re-running')
      if (orderInfo && orderInfo.askHire) {
        setIsPending(true)
        const getOrder = await fetch(`http://192.168.100.12:19002/getOrder?orderId=${orderInfo.orderId}`)
        const getOrderRes = await getOrder.json()
        console.log('hey')
        if (!getOrderRes.success) {
          dispatch({ type:'ORDER_INFO',payload:{ orderId:null,askHire:false } })
          console.log('heyy')
          return
        }
        const getCleanerInfo = await fetch(`http://192.168.100.12:19002/GetId?id=${getOrderRes.rows.cleaner_id}`)
        const cleanerInfoRes = await getCleanerInfo.json()
        if (getOrderRes.rows.state === 'accepted') {
          setCleanersLocation({
            latitude:Number(cleanerInfoRes.rows.latitude),
            longitude:Number(cleanerInfoRes.rows.longitude)
          })
        }
        setIsPending(false)
        if (getOrderRes.rows.state !== 'pending' && getOrderRes.rows.state !== 'order') {
          setAcceptedCleanerId(getOrderRes.rows.cleaner_id)
          setOrderState(getOrderRes.rows.state)
          setOrderId(orderInfo.orderId) 
          setTimeout(() => {
            requestCleaner()
          }, 3000);
        }
      }else{
        console.log('stupid')
        setOrderState('order')
      }
      // Could cause an error BEWARE!!!!!
    }, [orderInfo,refreshCleaner])

    const changeCleanerLoc = (lat,lng) => {
      setCleanersLocation({
        latitude:lat,
        longitude:lng
      })
    }
    
    const changeRefresh = () => {
      setRefreshCleaner(!refreshCleaner)
    }
    
    let markerLocation;
    if(currentLocation !==  null){
      markerLocation = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
      }
    }
    const changeModal = (show,text) => {
      setModalVisible({
        show:show,
        text: text
      })
    }

    const changeOrderState = (state) => {
      setOrderState(state)
    }
    const setCleanerId = (id) => {
      setAcceptedCleanerId(id)
    }
    const getOrderId = (id) => {
      setOrderId(id)
    }
    const changeCleanersLoc = () => {
      setCleanersLocation(null)
    }
  return (
      <>
      {
        login.banned === 'ban' ? <MyModal changeModal={changeModal} modalVisible={modalVisible} /> : null
      }
      
        {currentLocation === null ? 
          isPending ? <ActivityIndicator size={'large'} color={colors.green} /> :  children
        : isPending ? <ActivityIndicator size={'large'} color={colors.green} /> : <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={{ width:'100%',height:'100%' }} initialRegion={selector}>
          {orderState === 'accepted' &&  
            <MapViewDirections 
              origin={selector}
              destination={cleanersLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
            />
          }
            <Marker identifier='origin' coordinate={{latitude:selector.latitude,longitude:selector.longitude}}>
              <View style={styles.circle}/>  
              <View style={styles.stroke}/>  
              <View style={styles.core}/>  
            </Marker>        
            {
              cleanersLocation !== null  && orderState !== 'order' && orderState !== 'completed' && 
              <Marker identifier='destination' coordinate={{latitude:cleanersLocation.latitude,longitude:cleanersLocation.longitude}}>
                <View style={styles.circle}/>  
                <View style={styles.stroke}/>  
                <View style={{...styles.core, backgroundColor:colors.yellow}}/>  
              </Marker>
            }
          </MapView>}
          {currentLocation === null ? 
          <View style={styles.view}>
            <MyModal changeModal={changeModal} modalVisible={modalVisible} />
            <TouchableOpacity style={styles.btn} onPress={() => setRunLocation(!runLocation) }>
              <View> 
                <Text style={styles.text}>Enable Location</Text>
              </View>
            </TouchableOpacity>  
            </View>
            : 
            <>
            <MyModal changeModal={changeModal} modalVisible={modalVisible} />
            <TouchableOpacity onLongPress={requestCleaner} style={{...styles.view }}>
            <Animated.View style={{...styles.btn,opacity:buttonOpacity, transform:[{translateY: buttonY}]}}>
              <View> 
                <Text style={styles.text}>Press & Hold To Order Cleaner</Text>
                {/* <Button title='Navigate' onPress={() => navigation.navigate('HireCleanerPage')}/> */}
              </View>  
            </Animated.View>
            </TouchableOpacity>
            <Animated.View style={{ ...styles.view,backgroundColor:colors.black,width:'100%',height:height /3,zIndex:textInputZindex,top:null,opacity:textInputOpacity,transform:[{ translateY:textInputY }] }}>
              { 
                orderState === 'order' ? <Options getOrderId={getOrderId} dispatch={dispatch} changeModal={changeModal} changeOrderState={changeOrderState} login={login} /> : orderState === 'pending' ? <SkeletonLoader changeCleanerLoc={changeCleanerLoc} orderId={orderId} changeOrderState={changeOrderState} setCleanerId={setCleanerId} /> : orderState === 'accepted' || orderState === 'arrived' || orderState === 'completed' ? <ViewBox changeCleanersLoc={changeCleanersLoc} changeRefresh={changeRefresh} dispatch={dispatch} navigation={navigation} orderId={orderId} orderState={orderState} acceptedCleanerId={acceptedCleanerId} login={login} changeOrderState={changeOrderState} fadeOut={fadeOut} /> : <Options getOrderId={getOrderId} dispatch={dispatch} login={login} changeModal={changeModal} changeOrderState={changeOrderState}/>
              }
            </Animated.View>
            </>
            }
      </>
  );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor:colors.yellow,
        padding:20,
        width:width > 520 ? width / 3 : '100%',
        height:'100%',
        alignSelf:'center',
        borderRadius:250,
        justifyContent:'center',
        alignItems:'center',
        elevation: 20,
        position:'absolute'
      },
      view: {
        flex: 1,
        justifyContent:'flex-end',
        bottom:0,
        position:'absolute',
        zIndex:0,
        width: '50%',
        height:'30%',
        alignSelf:'center',
      },
      text: {
        fontFamily:'viga',
        fontSize: 18,
        textAlign:'center',
        color:colors.black
      },
      circle: {
        width:26,
        height:26,
        borderRadius:50
      },
      stroke: {
        width:26,
        height:26,
        borderRadius:50,
        backgroundColor:'#fff',
        zIndex:1,
        position:'absolute'
      },
      core: {
        width:24,
        height:24,
        position:'absolute',
        top:1,
        left:1,
        right:1,
        bottom:1,
        backgroundColor:colors.black,
        zIndex:2,
        borderRadius:50
      }
});

