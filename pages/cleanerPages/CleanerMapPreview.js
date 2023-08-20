import React, { useState, useEffect,useRef } from 'react'
import { View,StyleSheet,Text,ActivityIndicator,Dimensions,TouchableOpacity,Easing,Alert } from 'react-native'
import Animated, { color } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { colors } from '../../colors/colors';
import MapView,{ Marker,PROVIDER_GOOGLE } from 'react-native-maps'
import { TapGestureHandler } from 'react-native-gesture-handler';

import MyModal from '../../components/modal';

import { useDispatch } from 'react-redux';

import { LOCATION } from '../../redux/actions/actions';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { GOOGLE_MAPS_APIKEY } from '../../apikey';
import MapViewDirections from 'react-native-maps-directions';
import CleanerViewBox from './components/cleanerViewBox';


const {width,height} = Dimensions.get('window')

export default function CleanerMapPreview({ route,navigation }) {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [error,setError] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [runLocation,setRunLocation] = useState(true)
    const locationInterval = useRef()
    const orderStatusInterval = useRef()
    const [customerLocation,setCustomerLocation] = useState({ latitude:null,longitude:null })
    const [customerOrderState,setCustomerOrderState] = useState('accepted')

    const dispatch = useDispatch()
    const selector = useSelector(state => state.location)
    const login = useSelector(state => state.login)
    
    
    // useEffect(() => {

    //   let listner = async() => {
    //     const res = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=declined&id=${route.params.orderId}&cleanerId=${login.id}`)
    //     const response = await res.json()
    //     clearInterval(locationInterval.current)
    //     clearInterval(orderStatusInterval.current)
    //   }
    //   navigation.addListener('blur', listner)
    // // Prompt the user before leaving the screen
    //     // Alert.alert(
    //     //   'Decline Order?',
    //     //   'Are you sure you want to decline the order?',
    //     //   [
    //     //     { text: "Don't leave", style: 'cancel', onPress: () => null },
    //     //     {
    //     //       text: 'Decline',
    //     //       style: 'destructive',
    //     //       // If the user confirmed, then we dispatch the action we blocked earlier
    //     //       // This will continue the action that had triggered the removal of the screen
    //     //       onPress: async() => {
                
    //     //         if (response.success) {
                  
    //     //           navigation.dispatch(e.data.action) 
    //     //         }
    //     //       },
    //     //     },
    //     //   ],
    //     //   { cancelable: true }
    //     // );
    //   return () => {
    //     navigation.removeEventListener('beforeRemove',listner)
    //   }
    // }, [navigation])
    // const { Value,Extrapolate } = Animated
    // const buttonOpacity = useRef(new Value(1)).current

    const mapRef = useRef(null)
    useEffect(() => {
        const getUserLocations = async() => {
          const getCustomerLocation = await fetch(`http://192.168.100.12:19002/GetId?id=${route.params.customerId}`)
          const getCustomerLocationRes = await getCustomerLocation.json()
          if (!getCustomerLocationRes.success) {
            setModalVisible({
              show: true,
              text: 'Could not fetch Customer, Please try again later'
            })
            setTimeout(() => {
              navigation.pop()
            }, 3000);
            return;
          }
          setCustomerLocation({ latitude:Number(getCustomerLocationRes.rows.latitude),longitude:Number(getCustomerLocationRes.rows.longitude)  })
    
          const { id } = login

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

    // second useEffect
    useEffect(() => {
      let Newlocation;
      
      if (currentLocation !== null) {
        locationInterval.current = setInterval(() => {
          a()
        }, 15000);
        const a = async() => {
          Newlocation = await Location.getCurrentPositionAsync({  })

          // Check if cleaner has arrived
          if (Newlocation.coords.latitude < (Number(customerLocation.latitude) + 0.001) && Newlocation.coords.longitude < (Number(customerLocation.longitude) + 0.001)) {
            const res = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=arrived&id=${route.params.orderId}&cleanerId=${login.id}`)
            const resultSuc = await res.json()
            if (resultSuc.success) {
              clearInterval(orderStatusInterval.current)
              clearInterval(locationInterval.current)
              setCustomerOrderState('arrived')
            }
          }
          if(Newlocation.coords.latitude < (selector.latitude + 0.00001) && Newlocation.coords.longitude < (selector.longitude + 0.00001)){
           
          }else{
            console.log('Cleaner distance changed')
            const res = await fetch(`http://192.168.100.12:19002/updateLocation?latitude=${Newlocation.coords.latitude}&longitude=${Newlocation.coords.longitude}&id=${login.id}`)
            dispatch(LOCATION(Newlocation.coords.latitude,Newlocation.coords.longitude))
          }
        }
      }
    
      return () => {
        clearInterval(locationInterval.current)
      };
    }, [currentLocation,runLocation]);

    useEffect(() => {

      orderStatusInterval.current = setInterval(async() => {
        const getOrderStaus = await fetch(`http://192.168.100.12:19002/checkOrderExist?orderId=${route.params.orderId}`)
        const { rows,success } = await getOrderStaus.json()
        if (!success) {
          clearInterval(locationInterval.current)
          clearInterval(orderStatusInterval.current)
          setModalVisible({
            show:true,
            text: 'This request has been cancelled by the customer.'
          })
          setTimeout(() => {
            navigation.navigate('UserDashboard')
          }, 3000);
          return
        }
        // Remember to proscheck
        if (success) {
          if (rows.cleaner_id !== login.id) {
            clearInterval(locationInterval.current)
            clearInterval(orderStatusInterval.current)
            setModalVisible({
              show:true,
              text: 'Sorry, Another Cleaner has already accepted this job'
            })
            setTimeout(() => {
              navigation.navigate('UserDashboard')
            }, 3000);
            return
          }
        }
      }, 3000);
      
      return () => {
        clearInterval(orderStatusInterval.current)
      }
    }, [])
    
    
    const destination = {latitude: 7.876567, longitude: 2.987656};
    // Third UseEffect
    useEffect(() => {
      if (!destination || !selector ||!mapRef.current ) return;
      
      setTimeout(() => {
        mapRef.current.fitToSuppliedMarkers(['origin','destination'], {
          edgePadding: {top: 50, right:50, left:50,bottom:50 },
        }) 
      }, 5000);
    }, [mapRef])
    
    
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
  return (
      <>
        {currentLocation === null ? 
          isPending ? <ActivityIndicator size={'large'} color={colors.green} /> : <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}><Text style={{ fontFamily:'viga',fontSize:18 }}>Please Enable Your Location</Text></View>
        : isPending ? <ActivityIndicator size={'large'} color={colors.green} /> : <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={{ width:'100%',height:'100%' }} region={selector}>
            <MapViewDirections 
              origin={selector}
              destination={customerLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
            />
            <Marker identifier='origin' coordinate={{latitude:selector.latitude,longitude:selector.longitude}}>
              <View style={styles.circle}/>  
              <View style={styles.stroke}/>  
              <View style={styles.core}/>  
            </Marker>
            {
              customerLocation &&
              <Marker identifier='destination' coordinate={{latitude:customerLocation.latitude,longitude:customerLocation.longitude}}>
                <View style={styles.circle}/>  
                <View style={styles.stroke}/>  
                <View style={{...styles.core,backgroundColor:colors.black}}/>  
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
            <Animated.View style={{ ...styles.view,backgroundColor:colors.black,width:'100%',height:height /3,top:null }}>
              <CleanerViewBox customerOrderState={customerOrderState} navigation={navigation} route={route} login={login}/>
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
        width:'100%',
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
        backgroundColor:colors.yellow,
        zIndex:2,
        borderRadius:50
      }
});

