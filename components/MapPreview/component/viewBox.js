import React, { useRef } from 'react';
import { View,StyleSheet,Text,Image, TouchableWithoutFeedback, ActivityIndicator,TouchableOpacity, Modal,Dimensions,FlatList } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { colors } from '../../../colors/colors';
import { Ionicons,AntDesign,FontAwesome,Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import call from 'react-native-phone-call'
import { useEffect } from 'react';
import HireModal from './HireModal';
import ChatModal from '../../../pages/hireAgent/ChatModal';

const { width,height } = Dimensions.get('window')
const stars = []
    for (let i = 0; i < 5; i++) {
        stars.push(i)
    }
export default function ViewBox({ dispatch,orderState,orderId,changeOrderState,fadeOut,login,acceptedCleanerId,navigation,changeRefresh,changeCleanersLoc }) {
    const [cleanerInfo, setCleanerInfo] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [allReviews,setAllReviews] = useState(null)
    const [hireModalVisible,setHireModalVisible] = useState({show:false,text:''})
    const orderInterval = useRef()
    const [showProfile,setShowProfile] = useState(false)
    const [showChatModal,setShowChatModal] = useState(false)
    const { id } = login
    const star = []
    for (let i = 0; i < 5; i++) {
        star.push(i)
    }
    useEffect(async() => {
        clearInterval(orderInterval.current)
        const getCleanerThatAccepted = await fetch(`http://192.168.100.12:19002/getCleanerThatAccepted?cleanerid=${acceptedCleanerId}`)
        const { response,success } = await getCleanerThatAccepted.json()
        const getCleanersRating = await fetch(`http://192.168.100.12:19002/fetchCleaner?id=${acceptedCleanerId}`)
        const { rows } = await getCleanersRating.json()
        if (success) {
            setCleanerInfo({...response,rating:rows.rating})
            if (!orderId) {
                return    
            }
            orderInterval.current = setInterval(async() => {
                var getOrderStaus = await fetch(`http://192.168.100.12:19002/checkOrderStatus?orderId=${orderId}&state=declined`)
                const { success } = await getOrderStaus.json()
                if (success) {
                    clearInterval(orderInterval.current)
                    changeCleanersLoc()
                    changeOrderState('order')
                    return
                }
                getOrderStaus = await fetch(`http://192.168.100.12:19002/checkOrderStatus?orderId=${orderId}&state=arrived`)
                const getOrderStausRes = await getOrderStaus.json()
                if (getOrderStausRes.success) {
                    changeOrderState('arrived')
                    return
                }
                getOrderStaus = await fetch(`http://192.168.100.12:19002/checkOrderStatus?orderId=${orderId}&state=completed`)
                const completedStatus = await getOrderStaus.json()
                if (completedStatus.success) {
                    console.log('completed status')
                    clearInterval(orderInterval.current)
                    changeOrderState('completed')
                    changeCleanersLoc()
                    setHireModalVisible({show:true,text:'Do You Wish To Hire This Cleaner?'})
                }
            }, 5000);   
           
        }else{
            changeCleanersLoc()
            changeOrderState('order')
        }
        const getReviews = async() => {
            const getAllReviews = await fetch(`http://192.168.100.12:19002/getCleanerReviews?cleanerId=${acceptedCleanerId}`)
            const { success,rows } = await getAllReviews.json()
    
            if (success) {
                setAllReviews(rows)
            }
        }
            // reFetchReviews.current = getReviews
        getReviews()
        return () => {
            clearInterval(orderInterval.current)
        }
    
    }, [orderId])
    

    const getContactPermission = async() => {
        const args = {
            number: `+${cleanerInfo.number}`, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
          }
           
          call(args).catch(console.error)
    }
    
    const deleteOrder = async() => {
        setIsPending(true)
        const res = await fetch(`http://192.168.100.12:19002/DeleteOrder?orderId=${orderId}`)
        const { success } = await res.json()
        if (success) {
            dispatch({ type:'CHANGE_HIRESTATE',payload:{ askHire:false } })
            setIsPending(false)
            changeCleanersLoc()
            changeOrderState('order')
        }
    }
    const updateOrder = async() => {
        setIsPending(true)
        const update = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=completed&id=${orderId}&cleanerId=${acceptedCleanerId}`)
        const response = await update.json()
        if (response.success) {
            dispatch({ type:'CHANGE_HIRESTATE',payload:{ askHire:false } })
            setIsPending(false)
            changeCleanersLoc()
            changeOrderState('order')
        }
    }
    const changeHireModal = (val) => {
        setHireModalVisible({show:false,text:''})
    }
    const changeChatModal = () => {
        setShowChatModal(!showChatModal)
    }
  return (
      <>
      <ChatModal customerId={id} CleanerChat={true} agentId={acceptedCleanerId} changeChatModal={changeChatModal} companyName={cleanerInfo && cleanerInfo.firstname} showChatModal={showChatModal} />
      <Modal
        animationType='slide'
        visible={showProfile}
        onRequestClose={() => setShowProfile(false)}
      >

        <View style={{ padding:10 }}>
        <TouchableWithoutFeedback onPress={() => setShowProfile(false)}>
            <AntDesign name="close" size={24} color={colors.yellow} style={{ marginVertical:5 }} />
        </TouchableWithoutFeedback>
            <View style={{ height:height / 4,alignItems:"center",justifyContent:'flex-end',marginBottom:20 }}>
                <View style={{ marginVertical:5 }}>
                    {/* <Image style={{width:70,height:70,borderRadius:50,borderWidth:3,borderColor:colors.yellow}} source={require('../../../assets/icon.png')} /> */}
                </View>
                {
                    cleanerInfo &&
                    <Text style={{ fontFamily:'viga',fontSize:18 }}>{cleanerInfo.firstname} {cleanerInfo.lastname}</Text>
                }
            </View>
            <View style={{ marginVertical:20 }}>
                <Text style={{ fontFamily:'viga' }}>Reviews</Text>
                <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:1,marginVertical:10 }} />
                {
                    allReviews ?
                <FlatList 
                    keyExtractor={(item) => item.id}
                    data={allReviews}
                    renderItem={({ item }) => (
                        <View style={styles.reviews}>
                            <View style={{...styles.bio,width:'100%',minHeight:70,marginVertical:10}}>
                                <Text style={{...styles.text,color:colors.yellow}}>{item.customer_name}</Text>
                                <View>
                                    <Text>{item.review}</Text>
                                </View>
                                <View style={{ flex:1,justifyContent:"flex-end" }}>
                                    <View style={{ flexDirection:'row' }}>
                                        {
                                        stars.map((star,index) => (
                                            <Entypo name="star" size={14} style={ item.rating >= index + 1 ?  { color:'gold',letterSpacing:4 } : { color:'#c4c4c4',letterSpacing:4 }} key={index} />
                                        ))   
                                        } 
                                        <View style={{ flex:1,justifyContent:'flex-end',flexDirection:"row" }}>
                                            <Text style={{ fontFamily:'viga' }}>{new Date(Number(item.dateofreview)).toLocaleDateString()}</Text>
                                        </View>     
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
                :
                <View style={{ justifyContent:'center',alignItems:'center' }}>
                    <Text style={{ fontFamily:'viga',fontSize:20 }}>No Reviews Yet</Text>
                </View>
                }
            </View>
        </View>
      </Modal>
      {
          cleanerInfo &&
          <HireModal cleanerFirstname={cleanerInfo.firstname} cleanerRating={cleanerInfo.rating} changeOrderState={changeOrderState} acceptedCleanerId={acceptedCleanerId} navigation={navigation} hireModalVisible={hireModalVisible} changeHireModal={changeHireModal}/>
      }
        <View style={styles.view}>
            {cleanerInfo === null ? <ActivityIndicator size={'large'} color={colors.yellow} /> : 
            <>
            
                <TapGestureHandler onBegan={() => changeRefresh()} >
                    <View style={{ backgroundColor:colors.whitishBlue,position:'absolute',left:10,top:-50,borderRadius:20,padding:5,elevation:3, flexDirection:'row',shadowOffset: { width: 2, height: 2},shadowOpacity: 0.2,shadowColor:'black' }}>
                        <Ionicons name="refresh-outline" size={10} style={{ marginHorizontal:5 }} color="black" />
                        <Text style={{...styles.text,fontSize:8,color:'blue'}}>Refresh Cleaner Location</Text>
                    </View>
                </TapGestureHandler>
            
          <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'center' }}>
            <View style={{ width:'40%' }}>
                {/* <Image style={{width:50,height:50,borderRadius:50,left:-20,borderWidth:3,borderColor:colors.yellow}} source={require('../../../assets/icon.png')} /> */}
            </View>
            <View style={{ alignItems:'center',justifyContent:'center' }}>
                <Text numberOfLines={1} style={{...styles.text,fontSize:18 }}>{cleanerInfo.firstname} {cleanerInfo.lastname}</Text>
                <View style={{ flexDirection:'row',marginVertical:5 }}>
                    {
                    cleanerInfo &&
                     star.map((item,index) => (
                        <Entypo name="star" size={12} style={ cleanerInfo.rating >= 1 && index + 1 === 1 ? { color:'gold',letterSpacing:4 } : cleanerInfo.rating >= 20 && index + 1 === 2 ? { color:'gold',letterSpacing:4 } : cleanerInfo.rating >= 40 && index + 1 === 3 ? { color:'gold',letterSpacing:4 } : cleanerInfo.rating >= 60 && index + 1 === 4 ? { color:'gold',letterSpacing:4 } : cleanerInfo.rating >= 80 && index + 1 === 5 ? { color:'gold',letterSpacing:4 } :{ color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                     ))   
                    }      
                </View>
                <TouchableWithoutFeedback onPress={() => setShowProfile(true)}>
                    <View style={{ backgroundColor:'lightblue',borderRadius:20,paddingHorizontal:10,marginTop:5 }}>
                        <Text style={{ fontSize:10,color:colors.yellow,fontFamily:'viga' }}>View Reviews</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={{ flexDirection:'row',paddingTop:10,justifyContent:'center',marginVertical:20 }}>
          <TouchableWithoutFeedback onPress={() => setShowChatModal(true)}>
                <View style={{ flex:1,flexDirection:'row',alignItems:'center', justifyContent:'flex-start',width:'50%' }}>
                    <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                    <Text style={{...styles.text,left:5}}>Chat With {cleanerInfo.firstname}</Text>
                </View>
          </TouchableWithoutFeedback>
          {/* PhoneNumber comp */}
          <TouchableWithoutFeedback onPress={getContactPermission}>
            <View style={{ flex:1,marginLeft:30 ,justifyContent:'center',width:'50%',alignItems:'center'}}>
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <View style={{ backgroundColor:colors.white,borderRadius:50,width:20,height:20,justifyContent:'center',alignItems:'center' }}>
                        <FontAwesome style={{ color:colors.green }} name="phone" size={15} />
                    </View>
                    <Text style={{...styles.text,left:10}}>Call {cleanerInfo.firstname}</Text>
                </View>
            </View> 
            </TouchableWithoutFeedback>
            </View>

            {/* Equipments you must have  */}
          <View style={{ width:'100%',marginVertical:10 }}>
            <Text style={{...styles.text,fontSize:14, color:colors.yellow}}>Quick Notice from {cleanerInfo.firstname}.</Text>
            <View style={{flexDirection:'row',paddingTop:10}}>
               <Text style={{ color:colors.white,fontSize:12 }}>Please ensure to have the necessary equipments available.</Text>  
            </View>
          </View>

            {orderState === 'accepted' &&
                <View>
                <TouchableWithoutFeedback onPress={() => deleteOrder()}>
                    <View style={{...styles.button}}>
                      {isPending ? <ActivityIndicator color={colors.yellow} size={'large'}/> : <Text style={{...styles.text,color:colors.black}}>Cancel Order</Text>} 
                    </View>
                </TouchableWithoutFeedback>
                </View>
            }
            {orderState === 'arrived' &&
             <View>
                <TouchableWithoutFeedback>
                    <View style={{...styles.button}}>
                        <Text style={{...styles.text,color:colors.black}}>Your Cleaner Has Arrived</Text>
                    </View>
                </TouchableWithoutFeedback>
                {/* <TouchableWithoutFeedback onPress={() => updateOrder()}>
                <View style={{...styles.button,backgroundColor:colors.green}}>
                  {isPending ? <ActivityIndicator color={colors.yellow} size={'large'}/> : <Text style={{...styles.text,color:colors.white}}>Cleaner Finished Work?</Text>} 
                </View>
            </TouchableWithoutFeedback> */}
            </View>
            }
          </>
          }
      </View>
      </>
  );
}
const styles = StyleSheet.create({
    view: {
        height:'100%',
        padding:30,
        zIndex:1
    },
    text:{
        fontFamily:'viga',
        color:colors.white,
        overflow:'hidden'
    },
    equipments:{
        width:70,
        height:25,
        justifyContent:'center',
        borderRadius:20,
        backgroundColor:'lightblue', 
        borderWidth:2,
        borderColor:colors.yellow
    },
    button: {
        backgroundColor: '#fff',
        height: 50,
        bottom:-15,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3,
        marginVertical:5
      },
    reviews:{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flex:1,
        alignItems:'center',
        backgroundColor:colors.whitishBlue,
        marginVertical:10,
        elevation:3,
        padding:10
    }  
});
