import { useState, useEffect, useCallback } from 'react'
import * as Animatable from 'react-native-animatable';
import { View,StyleSheet,Text,ActivityIndicator,Dimensions,Easing,Platform,InteractionManager,TouchableWithoutFeedback,TouchableOpacity, Image, TouchableNativeFeedback, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../colors/colors'
import { useIsFocused } from '@react-navigation/native';
import { Entypo,Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import { SliderBox } from "react-native-image-slider-box";
import Options from '../components/MapPreview/component/Options';

import Animated from 'react-native-reanimated';
import * as Location from 'expo-location';
import { Linking } from 'react-native'
import MapView,{ Marker, PROVIDER_GOOGLE  } from 'react-native-maps'
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';

import MyModal from '../components/modal';
import { useDispatch } from 'react-redux';
import { ADDRESS, LOCATION } from '../redux/actions/actions';
import { useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';

import ViewBox from '../components/MapPreview/component/viewBox';

import { GOOGLE_MAPS_APIKEY } from '../apikey';
import MapViewDirections from 'react-native-maps-directions';
import AddressModal from './component/AddressModal';
import { AllKeys } from '../keys/AllKeys';

import notifee from '@notifee/react-native';
import FastImage from 'react-native-fast-image'
import OneSignal from 'react-native-onesignal';
import Constants from "expo-constants";
import PostPoneModal from '../components/PostPoneModal';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import ContentLoader from 'react-native-easy-content-loader';
import TawkTo from './webView/TawkTo';
OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);

const { width,height } = Dimensions.get('window')
export default function HomePage({ navigation,activeOrder,isActive,mixpanel,route,updateApp }) {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [showPostponeModal, setShowPostponeModal] = useState(false)
    const [error,setError] = useState(null)
    const [orderIsPending, setOrderIsPending] = useState(true)
    const [isPending,setIsPending] = useState(false)
    const [runLocation,setRunLocation] = useState(true)
    const [subActiveOrder, setSubActiveOrder] = useState(null)
    const [orderIsActive,setOrderIsActive] = useState(false)
    const [orderState,setOrderState] = useState('order')
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [locationInterval,setLocationInterval] = useState()
    const [acceptedCleanerId,setAcceptedCleanerId] = useState(null)
    const [cleanersLocation,setCleanersLocation] = useState(null)
    const [showTawkModal, setShowTawkModal] = useState({ show:false, url:null })
    const [orderId,setOrderId] = useState(null)
    const [refreshCleaner,setRefreshCleaner] = useState(false)
    const [initialOptions,setInitialOptions] = useState({ liveOrder:false,subscribe:true,hireAgent:false })
    const selectCarousel = useRef(null)

    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const selector = useSelector(state => state.location)
    const { id,displayName,role,banned,address,email } = useSelector(state => state.login)
    const orderInfo = useSelector(state => state.Order)

    const { Value,Extrapolate } = Animated
    const buttonOpacity = useRef(new Value(1)).current

    const mapRef = useRef(null)
    mixpanel.identify(id + "");
    mixpanel.getPeople().set("email", `${email}`);
    mixpanel.getPeople().set("name", `${displayName}`);
    const data = [
      {id: 1, type: 'select'},
      {id: 2, type: 'order'}
    ];

    useEffect(() => {
      // setSubActiveOrder(activeOrder)
      // setOrderIsActive(isActive)
      let externalUserId = id + ''; // You will supply the external user id to the OneSignal SDK

        // Setting External User Id with Callback Available in SDK Version 3.9.3+
        OneSignal.setExternalUserId(externalUserId);
    }, [])
    useEffect(() => {
      getActiveOrder()
    }, [isFocused])
    const getActiveOrder = async() => {
      setOrderIsPending(true)
      var date = moment().startOf('day').valueOf()
      const req = await fetch(`${AllKeys.ipAddress}/userSubActiveOrder?id=${id}&date=${date}`)
      const { success,rows } = await req.json()
      if (success) {
        var arr = []
        setOrderIsActive(moment(rows.next_cleaning_order).isSame(new Date(), 'hour'))
        const request = await fetch(`${AllKeys.ipAddress}/fetchPlanInfo?sub_id=${rows.id}`)
        const { success,row } = await request.json()
        if (success) {
          var obj = { planName:row[0].plan_name,planDesc:row[0].plan_desc }
          arr.push({...rows,...obj}) 
        }
        setSubActiveOrder(arr[0]) 
      }else{
        setSubActiveOrder(null)
      }
      setOrderIsPending(false)
    }
      
      // Checking if the user has been banned and getting location and notification permission
      useEffect(() => {
        const checkIfAddressExist = async() => {
          const req = await fetch(`${AllKeys.ipAddress}/fetchUserAddress?id=${id}`)
          const { success, rows } = await req.json()

          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted' && !updateApp) {
            // Linking.openSettings()
            // setModalVisible({
            //   show: true,
            //   text: 'Please Enable Location to use this app'
            // })
            return;
          }
          if (!address && !success && !updateApp) {
            setShowAddressModal(true)
          }else{
            setShowAddressModal(false)
            dispatch(ADDRESS(rows))
          }
        }
        checkIfAddressExist()
        if (banned === 'ban') {
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
      }, [runLocation]);
      // useEffect(async() => {
      //   let Newlocation;
      //   // const googleLoc = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_APIKEY}`)
      //   // const googleLocRes = await googleLoc.text()
      //   // console.log(googleLocRes)
        
      //   // if (currentLocation !== null && !login.banned) {
      //   //   if (orderState !== 'accepted') {
      //   //     let interval = setInterval(() => {
      //   //       a()
      //   //       if (orderState === 'accepted') {
      //   //         clearInterval(interval)
      //   //       }
      //   //     }, 15000);
      //   //     setTimeout(() => {
      //   //       setLocationInterval(interval)
      //   //     }, 20000);
      //   //   }
  
      //     const a = async() => {
      //       Newlocation = await Location.getCurrentPositionAsync({ accuracy:Location.Accuracy.High })
      //       if(Newlocation.coords.latitude < (selector.latitude + 0.00001) && Newlocation.coords.longitude < (selector.longitude + 0.00001)){
             
      //       }else{
      //         console.log('distance changed')
      //         const res = await fetch(`http://192.168.100.12:19002/updateLocation?latitude=${Newlocation.coords.latitude}&longitude=${Newlocation.coords.longitude}&id=${login.id}`)
      //         dispatch(LOCATION(Newlocation.coords.latitude,Newlocation.coords.longitude))
      //         if (login.role === 'worker') {
      //           fetch(`http://192.168.100.12:19002/updateCleanerLocation?latitude=${Newlocation.coords.latitude}&longitude=${Newlocation.coords.longitude}&id=${login.id}`)
      //         }
      //       }
      //     }
      //   }
      //   if (orderState === 'accepted') {
      //     clearInterval(locationInterval)
      //   }
      //   return () => {
      //     clearInterval(locationInterval)
      //   };
      // }, [currentLocation,orderState]);
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
      // useEffect( async() => {
      //   if (orderInfo && orderInfo.askHire) {
      //     setIsPending(true)
      //     const getOrder = await fetch(`${AllKeys.ipAddress}/getOrder?orderId=${orderInfo.orderId}`)
      //     const getOrderRes = await getOrder.json()
      //     if (!getOrderRes.success) {
      //       dispatch({ type:'ORDER_INFO',payload:{ orderId:null,askHire:false } })
      //       return
      //     }
      //     const getCleanerInfo = await fetch(`${AllKeys.ipAddress}/GetId?id=${getOrderRes.rows.cleaner_id}`)
      //     const cleanerInfoRes = await getCleanerInfo.json()
      //     if (getOrderRes.rows.state === 'accepted') {
      //       setCleanersLocation({
      //         latitude:Number(cleanerInfoRes.rows.latitude),
      //         longitude:Number(cleanerInfoRes.rows.longitude)
      //       })
      //     }
      //     setIsPending(false)
      //     if (getOrderRes.rows.state !== 'pending' && getOrderRes.rows.state !== 'order') {
      //       setAcceptedCleanerId(getOrderRes.rows.cleaner_id)
      //       setOrderId(orderInfo.orderId)
      //       setOrderState(getOrderRes.rows.state)
      //     }
      //   }else{
      //     setOrderState('order')
      //   }
      //   // Could cause an error BEWARE!!!!!
      // }, [orderInfo,refreshCleaner])
      
  
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
      const directUser = async() => {
     
          // Request permissions (required for iOS)
          await notifee.requestPermission()
      
          // Create a channel (required for Android)
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });
      
          // Display a notification
          await notifee.displayNotification({
            title: 'Notification Title',
            body: 'Main body content of the notification',
            android: {
              channelId,
           // optional, defaults to 'ic_launcher'.
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'default',
              },
            },
          });
          
        
        if (initialOptions.liveOrder) {
          selectCarousel.current.snapToNext()
        }else if (initialOptions.subscribe) {
          navigation.navigate('Subscription')
        }else if (initialOptions.hireAgent) {
          
        }else{

        }
      }
      function renderItem({ item,index }){
        return(
          <>
            <View style={{ flexDirection:'row',justifyContent:'flex-start' }}>
              <TouchableWithoutFeedback onPress={() => selectCarousel.current.snapToPrev()}>
                <View style={{ padding:5,elevation:3 }}>
                  <Text style={{...styles.text,fontSize:12,color:'blue',marginHorizontal:10, textDecorationLine:'underline'}}>Go Back</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Options getOrderId={getOrderId} dispatch={dispatch} changeModal={changeModal} changeOrderState={changeOrderState} login={login} />
        </>
        )
      }
  const changeAddressModal = () => {
    setShowAddressModal(false)
  }
  const acceptPostone = async() => {
    await fetch(`${AllKeys.ipAddress}/postponeCleaning?id=${subActiveOrder.id}&date=${moment(subActiveOrder.next_cleaning_order).add(7,'days').valueOf()}`)
    setShowPostponeModal(false)
    getActiveOrder()
  }
  const changePostponeModal = () => {
    setShowPostponeModal(!showPostponeModal)
  }
  const closeTawkModal = () => {
    setShowTawkModal({ show:false,url:null })
}
const openTawkModal = (url) => {
    setShowTawkModal({ show:true,url })
}
  return (
      <>
      <StatusBar translucent={true} animated={true} />
      <SafeAreaView>
      <MyModal changeModal={changeModal} modalVisible={modalVisible} />
      <TawkTo closeTawkModal={closeTawkModal} showTawkModal={showTawkModal} />
      {
        subActiveOrder &&
        <PostPoneModal title={'Are you sure you want to postone?'} negative={"No, I don't"} positive={"Yes, I'm sure"} date={subActiveOrder.next_cleaning_order} showPostponeModal={showPostponeModal} changePostponeModal={changePostponeModal} acceptPostone={acceptPostone} />
      }
      {
        showAddressModal &&
        <AddressModal updateApp={updateApp} changeAddressModal={changeAddressModal} showAddressModal={showAddressModal} />
      } 
       <View>
          <View style={{ flexDirection:'row',marginTop:10,padding:10,position:'relative',alignItems:'center',justifyContent:'space-between' }}>
            <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                 <View style={styles.hamburger}>
                   <FontAwesome name="navicon" size={24} color={colors.black} />
                 </View>
             </TouchableWithoutFeedback>
             <TouchableNativeFeedback onPress={() => openTawkModal('https://tawk.to/chat/636a8ef9b0d6371309cdfe8d/1ghc3t0hi')}>
                <View style={{ borderColor:colors.purple,borderRadius:10,padding:10,width:'40%',borderWidth:1 }}>
                  <Text style={{ color:colors.black }}>Ask Tricia for help</Text>
                </View>
             </TouchableNativeFeedback>
          </View>
            <View style={{ height:'100%',padding:10  }}>
              {
                orderIsPending ?
                  <View style={{ marginTop:20 }}>
                    <ContentLoader active tHeight={40} paragraph={false} avatar={false} />
                    <ContentLoader active pWidth={'65%'} pRows={1} title={false} avatar={false} />
                    <ContentLoader 
                      active 
                      pRows={2} 
                      avatar={false} 
                      pWidth={'100%'} 
                      tWidth={'100%'} 
                      tHeight={130} 
                      pHeight={30} 
                      titleStyles={{ borderRadius:10,marginVertical:10 }} 
                    />
                  </View>
                :
                subActiveOrder ?
                <>
                  <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
                    <View style={{ marginVertical:10 }}>
                      <Text style={{ fontFamily:'viga',fontSize:32 }}>Hi {displayName}</Text>
                      <Text>Lucky you, you have an order</Text>
                    </View>
                    <TouchableOpacity>
                      <View>
                          <Text style={{ textDecorationLine:'underline' }}>Upcoming orders</Text>
                        </View>
                    </TouchableOpacity>
                  </View>
                  <ScrollView contentContainerStyle={{ alignItems:'center',marginVertical:10 }}>
                    <TouchableNativeFeedback onPress={() => navigation.navigate('ListOfSpaces', {subActiveOrder})}>
                    <View style={{ backgroundColor:'#c4c4c4',width:'100%',borderRadius:10 }}>
                      <View style={{ padding:10,marginVertical:10 }}>
                        <View style={{ flexDirection:'row',alignItems:'center',marginBottom:15 }}>
                          {/* <View style={{ borderRadius:50,overflow:'hidden',width:30,height:30 }}>
                            <Image resizeMode='contain' style={{ width:'100%',height:'100%' }} source={{ uri:'https://f004.backblazeb2.com/file/blipmooretest/avatar/Alex31/f905fb9c-ae7a-43f4-9d81-8ec5b671f2e4.png' }} />
                          </View> */}
                          <View>
                            <Text style={{ color:colors.black }} numberOfLines={1}>
                              {subActiveOrder.cleaner_name ? subActiveOrder.cleaner_name : 'No cleaner yet'}
                            </Text>
                            <Text style={{ fontWeight:'bold',fontSize:10,letterSpacing:1,color:'#171617' }}>{orderIsActive ? "Active now" : 'Active' + ' ' + moment(subActiveOrder.next_cleaning_order).fromNow()}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
                          <Text style={{ fontWeight:'bold',letterSpacing:1,textTransform:'uppercase' }}>{subActiveOrder.planName}</Text>
                          <View></View>
                          <MaterialCommunityIcons name="arrow-right-drop-circle" size={24} color={colors.purple} />
                        </View>
                        <Text style={{ fontSize:12 }}>NGN {Number(subActiveOrder.amount).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')}<Text style={{ color:'#696969' }}>/month</Text></Text>
                      </View>
                      <View style={{ borderRadius:5,backgroundColor:'#dcdcdc',padding:5,alignItems:'center',flexDirection:'row',justifyContent:'space-evenly' }}>
                        <FontAwesome name="calendar" size={14} color={colors.black} />
                        <Text style={{ fontFamily:'viga',color:colors.black }}>
                          {moment(subActiveOrder.next_cleaning_order).format('dddd')} - {''}
                          {moment(subActiveOrder.next_cleaning_order).format('DD')} {''} 
                          {moment(subActiveOrder.next_cleaning_order).format('MMM')} {''}
                          {moment(subActiveOrder.next_cleaning_order).format('YYYY')} - {''}
                          {moment(subActiveOrder.next_cleaning_order).format('h:mm a')}
                        </Text>
                      </View>
                    </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => navigation.navigate('ListOfSpaces', {subActiveOrder})}>
                      <View style={{...styles.postpone, backgroundColor:colors.purple}}>
                        <Text style={{ textAlign:'center',color:colors.white,fontWeight:'bold' }}>View cleaners task</Text>
                      </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => setShowPostponeModal(true)}>
                      <View style={styles.postpone}>
                        <Text style={{ textAlign:'center',color:colors.black }}>Postpone</Text>
                      </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => navigation.navigate('Pricing', {mixpanel})}> 
                      <View style={{ backgroundColor:colors.purple,borderRadius:10,padding:15,marginVertical:150, }}>
                        <Text style={{ color:colors.white,textAlign:'center' }}>Add to my Subscription</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </ScrollView>
                </>
                :
                <View style={{ height:'75%',width:'100%',alignItems:'center',justifyContent:'center' }}>
                  <FastImage fallback={true} resizeMode={FastImage.resizeMode.contain} source={{ priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/cleaner.png' }} style={{ height:'60%',width:'80%',opacity:0.5 }} />
                  <View style={{ marginVertical:10 }}>
                    <Text style={{ fontSize:30,textAlign:'center',fontFamily:'viga' }}>No orders Yet</Text>
                    <Text style={{ fontSize:15,textAlign:'center',marginVertical:5 }}>Rid yourself of cleaning</Text>
                    <Text style={{ fontSize:15,textAlign:'center',fontWeight:'bold' }}>Focus on what matters</Text>
                  </View>
                  <TouchableNativeFeedback onPress={() => navigation.navigate('Pricing')}>
                    <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                      <View style={{ backgroundColor:colors.purple,borderRadius:10,padding:15,marginVertical:10 }}>
                        <Text style={{ color:colors.white,textAlign:'center' }}>Get rid of cleaning now</Text>
                      </View>
                    </Animatable.View>
                  </TouchableNativeFeedback>
                </View>
              }



                {/* {
                    orderState === 'order'?
                    <SliderBox
                      images={images.images}
                      dotColor={colors.yellow}
                      sliderBoxHeight={'100%'}
                      disableOnPress
                      paginationBoxVerticalPadding={50}
                      autoplay={true}
                      circleLoop={true}
                    />
                  
                :
                    currentLocation === null ? 
                    isPending ? <ActivityIndicator size={'large'} color={colors.green} /> :  <Text style={{fontFamily:'viga',letterSpacing:1.5}}>Please Enable Your location</Text>
                    : isPending ? <ActivityIndicator size={'large'} color={colors.green} /> : 
                    <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={{ width:'100%',height:'100%' }} initialRegion={selector}>
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
                    </MapView>
                } */}
            </View>
            {/* <View style={styles.orderBox}>
                  {
                    orderState === 'order' && initialOptions.hireAgent
                    ?
                    <View style={{ flexDirection:'row',justifyContent:'flex-start' }}>
                      <TouchableWithoutFeedback onPress={() => setUseLiveOrder(false)}>
                        <View style={{ backgroundColor:colors.whitishBlue,borderRadius:20,padding:5,elevation:3,shadowOffset: { width: 2, height: 2},shadowOpacity: 0.2,shadowColor:'black' }}>
                          <Text style={{...styles.text,fontSize:12,color:'blue',marginHorizontal:10}}>Go Back</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    :
                    null
                  }
                { 
                    orderState === 'order' ? 
                    <Carousel
                    scrollEnabled={false}
                      ref={selectCarousel}
                      data={data}
                      renderItem={renderItem}
                      sliderWidth={width}
                      itemWidth={width}
                    />
                    : orderState === 'pending' ? <SkeletonLoader changeCleanerLoc={changeCleanerLoc} orderId={orderId} changeOrderState={changeOrderState} setCleanerId={setCleanerId} /> : orderState === 'accepted' || orderState === 'arrived' || orderState === 'completed' ? <ViewBox changeCleanersLoc={changeCleanersLoc} changeRefresh={changeRefresh} dispatch={dispatch} navigation={navigation} orderId={orderId} orderState={orderState} acceptedCleanerId={acceptedCleanerId} login={login} changeOrderState={changeOrderState} fadeOut={fadeOut} /> : <Options getOrderId={getOrderId} dispatch={dispatch} login={login} changeModal={changeModal} changeOrderState={changeOrderState}/>
                }
            </View> */}
       </View>
       </SafeAreaView>
    </>   
  )
}

const styles = StyleSheet.create({
  options:{
    backgroundColor:colors.whitishBlue,
    padding:10,
    marginVertical:10,
    flexDirection:'row',
  },
    hamburger:{
        // elevation:5,
        marginLeft:10,
        zIndex:1
    },
    orderBox:{
        backgroundColor:colors.black,
        height:'100%',
        borderRadius:30,
        top:-40,
        padding:10,
        zIndex:2
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
    },
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    button: {
        backgroundColor:colors.yellow,
        padding:20,
        borderRadius:50,
        marginVertical:20,
        elevation:3
    },
    text:{
        fontFamily:'viga',
        fontSize:20,
        textAlign:'center',
    },
    postpone:{
      borderColor:colors.purple,
      borderWidth:1,
      borderRadius:5,
      marginVertical:5,
      width:'100%',
      padding:8,
      alignSelf:'center'
    }
})