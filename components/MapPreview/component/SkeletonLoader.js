import React, { useEffect, useRef,useState } from 'react';
import { View,StyleSheet,Text,Image, TouchableWithoutFeedback,Animated,Dimensions } from 'react-native';
import { colors } from '../../../colors/colors';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MyModal from '../../modal';

export default function SkeletonLoader({ changeCleanerLoc,getOrderId,changeOrderState,setCleanerId,orderId }) {
    const nameX = useRef(new Animated.Value(-300)).current
    const avatarX = useRef(new Animated.Value(-100)).current
    const featuresX = useRef(new Animated.Value(-100)).current
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const timeout = useRef(null)

    const { width,height } = Dimensions.get('window')
    useEffect(() => {
      if (width < 760) {
        Animated.loop(
          Animated.timing(featuresX, {
            toValue:600,
            useNativeDriver:true,
            duration:3000
          })
        ).start()
        Animated.loop(
            Animated.timing(nameX, {
            toValue:500,
            useNativeDriver:true,
            duration:3000
            }),
        ).start()
      }
        let interval = setInterval(async() => {
          const checkIfUserHasOrder = await fetch(`http://192.168.100.12:19002/checkOrderStatus?orderId=${orderId}&state=accepted`)
          const { success,rows } = await checkIfUserHasOrder.json()
          if (success) {
            const res = await fetch(`http://192.168.100.12:19002/GetId?id=${rows.cleaner_id}`)
            const cleanerInfo = await res.json()
            if (cleanerInfo.success) {
              changeCleanerLoc(Number(cleanerInfo.rows.latitude),Number(cleanerInfo.rows.longitude)) 
            }
            clearTimeout(timeout.current)
            setCleanerId(rows.cleaner_id)
            changeOrderState('accepted')
          }
        }, 3000);

       timeout.current = setTimeout(async() => {
          setModalVisible({
            show:true,
            text:'No cleaner is available at this time, Please try again later'
          })
          clearInterval(interval)
          const deleteOrder = await fetch(`http://192.168.100.12:19002/DeleteOrder?orderId=${orderId}`)
          setTimeout(() => {
            changeOrderState('order')
          }, 5000);
        }, 100000);

        return () => {
          clearInterval(interval)
          clearTimeout(timeout.current)
        }
    }, [])

    const changeModal = () => {
      setModalVisible({
        show:false,
        text:''
      })
    }
    
    return (
        <>
        <MyModal modalVisible={modalVisible} changeModal={changeModal} />
        <View style={styles.view}>
          <Text style={{ color:colors.whitishBlue,textAlign:'center',fontSize:12,top:-15,fontFamily:'viga' }}>DO NOT LEAVE THE APP</Text>
        <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'center' }}>
            <View style={{ backgroundColor:'#c4c4c4',width:50,height:50,borderRadius:50,left:-20,zIndex:-1 }} />
          <View style={{ alignItems:'center',justifyContent:'center' }}>
          <View style={{ backgroundColor:'#c4c4c4',width:150,height:30,borderRadius:20,left:20 }} >
              <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:nameX }],position:'absolute',zIndex:1 }} >
                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:50,left:30,position:'absolute' }} />
              </Animated.View>
          </View>
              <View style={{ flexDirection:'row',left:10 }}>
                <Entypo name="star" size={14} color="black" style={{ color:'#c4c4c4',letterSpacing:4 }} />
                <Entypo name="star" size={14} color="black" style={{ color:'#c4c4c4',letterSpacing:4 }} />
                <Entypo name="star" size={14} color="black" style={{ color:'#c4c4c4',letterSpacing:4 }} />
                <Entypo name="star" size={14} color="black" style={{ color:'#c4c4c4',letterSpacing:4 }} />
              </View>
          </View>
        </View>
        <View style={{ flexDirection:'row',paddingTop:30,justifyContent:'center',alignItems:'center' }}>
              <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute', zIndex:1 }} >
                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:50,position:'absolute' }} />
              </Animated.View>
              <View style={{ flex:1,flexDirection:'row',alignItems:'center', justifyContent:'center',width:'50%',height:'50%' }}>
                <View style={{ backgroundColor:'#c4c4c4',borderRadius:50,width:20,height:20,justifyContent:'center',alignItems:'center' }} />
                  <View style={{ backgroundColor:'#c4c4c4',width:'100%',height:20,borderRadius:20,left:5 }} />
              </View>
       
          {/* PhoneNumber comp */}
            <View style={{ marginLeft:30 ,justifyContent:'center',width:'50%',height:'30%'}}>
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <View style={{ backgroundColor:'#c4c4c4',borderRadius:50,width:20,height:20,justifyContent:'center',alignItems:'center' }} />
                    <View style={{ backgroundColor:'#c4c4c4',width:'100%',height:20,borderRadius:20,left:5 }} />
                </View>
            </View> 
          </View>

          {/* Equipments you must have  */}
        <View style={{ flex:1, justifyContent:'center',width:'50%' }}>
          <View style={{ backgroundColor:'#c4c4c4',width:'80%',height:10,borderRadius:20,left:5 }} />
          <View style={{flexDirection:'row',paddingTop:10}}>
                <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute', zIndex:1 }} >
                  <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:50,position:'absolute' }} />
                </Animated.View>
                <View style={styles.equipments}>
                      <Text style={{...styles.text,color:colors.black,fontSize:13,textAlign:'center'}}></Text>
                </View>   
                <View style={styles.equipments}>
                      <Text style={{...styles.text,color:colors.black,fontSize:13,textAlign:'center'}}></Text>
                </View>   
                <View style={styles.equipments}>
                      <Text style={{...styles.text,color:colors.black,fontSize:13,textAlign:'center'}}></Text>
                </View>   
                <View style={styles.equipments}>
                      <Text style={{...styles.text,color:colors.black,fontSize:13,textAlign:'center'}}></Text>
                </View>   
          </View>
        </View>

            <View style={styles.button}>
              <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute', zIndex:1 }} >
                  <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:50,position:'absolute' }} />
                </Animated.View>
                  
            </View>
   
    </View>
    </>
    );
  }

  const styles = StyleSheet.create({
    view: {
        padding:30,
        zIndex:-1
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
        backgroundColor:'#c4c4c4', 
        borderWidth:2,
    },
    button: {
        backgroundColor: '#c4c4c4',
        height: 50,
        bottom:-15,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
  })