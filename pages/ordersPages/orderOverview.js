import { ImageBackground, StyleSheet, Text, View,Dimensions, Image, TouchableNativeFeedback, ScrollView, Modal, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../colors/colors'
import { currency } from '../../currency/currency'
import { FontAwesome5,Entypo,AntDesign } from '@expo/vector-icons';
import { useEffect, useRef, useMemo, useState } from 'react';
import { AllKeys } from '../../keys/AllKeys';
import AnimatedLoader from 'react-native-animated-loader';
import { showMessage, hideMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get('window')
export default function OrderOverview({ navigation,route }) {
    const { displayName,lastName,id } = useSelector(state => state.login)
    const [cancelOptions, setCancelOptions] = useState({ one:false,two:false,three:false,four:false,five:false,six:false })
    const [cancelReason, setCancelReason] = useState(null)
    const [showCancelSubModal, setCancelShowModal] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const { item } = route.params
    const { cleaning_interval,cleaning_interval_frequency,amount,time_period,day_period,places,cleaner_name,customer_name,type,planName,planDesc } = item

    useEffect(() => {
        const fetchPlanInfo = async() => {
            const req = await fetch(`${AllKeys.ipAddress}/fetchPlanInfo?sub_id=${item.id}`)
            const { success,row } = await req.json()
            if (success) {
                
            }else if(row === 'empty') {
                navigation.navigate('AfterPayment', { planId:item.id,frequency:cleaning_interval_frequency,plan:'paid',amount })
            }else{
                showMessage({
                    type:'danger',
                    message:'Error',
                    description:"Couldn't fetch Plan"
                })
            }
            setIsPending(false)
        }
        fetchPlanInfo()
    }, [])
    

    const cancelSubscription = async() => {
        // Remember that you need to get the subcode when you launch live. Your webhook should add this after a successful payment
        setIsCancelling(true)
        const req = await fetch(`${AllKeys.ipAddress}/cancelSub?userid=${id}&reason=${cancelReason}&subscription_id=${item.id}`)
        const { success }  = await req.json()

        setIsCancelling(false)
        if (success) {
           navigation.navigate('CancelSuccess', {cleaner_name,orderId:item.id})
        }else{
            showMessage({
                message: "Error",
                description: "Could not cancel order. Please try again later/contact tricia",
                type: "danger"
            });
        }
    }
  return (
    <>
    {
    isPending ?
        <AnimatedLoader 
          visible={isPending}
          overlayColor="rgba(0,0,0,0.75)"
          source={require('../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
    :
    <SafeAreaView style={styles.container}>
        <AnimatedLoader 
          visible={isCancelling}
          overlayColor="rgba(0,0,0,0.75)"
          source={require('../../lottie/sad-face-emoji.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <Modal
            visible={showCancelSubModal}
            transparent={false}
            onRequestClose={() => {
                setCancelShowModal(false)
            }}
            animationType='slide'
            statusBarTranslucent={true}
        >
            <SafeAreaView style={{ marginTop:50,padding:10 }}>
                <Text style={{ fontFamily:'viga',letterSpacing:1,marginVertical:10,fontSize:20 }}>Reason for cancellation?</Text>
                <TouchableNativeFeedback onPress={() => {
                    setCancelOptions({ one:true,two:false,three:false,four:false,five:false,six:false  })
                    setCancelReason('Too expensive')
                }}>
                    <View style={cancelOptions.one ? {...styles.reason,...styles.chosenReason} : styles.reason}>
                        {
                            cancelOptions.one ?
                            <FontAwesome5 name="dot-circle" size={20} color={colors.purple} />
                            :
                            <Entypo name="circle" size={20} color="black" />
                        }
                        <Text style={{ marginLeft:5 }}>Too expensive</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    setCancelOptions({ one:false,two:true,three:false,four:false,five:false,six:false  })
                    setCancelReason('Poor quality of cleaning')
                }}>
                    <View style={cancelOptions.two ? {...styles.reason,...styles.chosenReason} : styles.reason}>
                        {
                            cancelOptions.two ?
                            <FontAwesome5 name="dot-circle" size={20} color={colors.purple} />
                            :
                            <Entypo name="circle" size={20} color="black" />
                        }
                        <Text style={{ marginLeft:5 }}>Poor quality of cleaning</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    setCancelOptions({ one:false,two:false,three:true,four:false,five:false,six:false  })
                    setCancelReason('Cleaners attitude')
                }}>
                    <View style={cancelOptions.three ? {...styles.reason,...styles.chosenReason} : styles.reason}>
                        {
                            cancelOptions.three ?
                            <FontAwesome5 name="dot-circle" size={20} color={colors.purple} />
                            :
                            <Entypo name="circle" size={20} color="black" />
                        }
                        <Text style={{ marginLeft:5 }}>Cleaner's attitude</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    setCancelOptions({ one:false,two:false,three:false,four:true,five:false,six:false  })
                    setCancelReason('Just wanted to test it')
                }}>
                    <View style={cancelOptions.four ? {...styles.reason,...styles.chosenReason} : styles.reason}>
                        {
                            cancelOptions.four ?
                            <FontAwesome5 name="dot-circle" size={20} color={colors.purple} />
                            :
                            <Entypo name="circle" size={20} color="black" />
                        }
                        <Text style={{ marginLeft:5 }}>Just wanted to test it</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    setCancelOptions({ one:false,two:false,three:false,four:false,five:true,six:false  })
                    setCancelReason('Cleaner late arrival')
                }}>
                    <View style={cancelOptions.five ? {...styles.reason,...styles.chosenReason} : styles.reason}>
                        {
                            cancelOptions.five ?
                            <FontAwesome5 name="dot-circle" size={20} color={colors.purple} />
                            :
                            <Entypo name="circle" size={20} color="black" />
                        }
                        <Text style={{ marginLeft:5 }}>Cleaner late arrival</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    setCancelOptions({ one:false,two:false,three:false,four:false,five:false,six:true  })
                    setCancelReason('Cant afford it for now')
                }}>
                    <View style={cancelOptions.six ? {...styles.reason,...styles.chosenReason} : styles.reason}>
                        {
                            cancelOptions.six ?
                            <FontAwesome5 name="dot-circle" size={20} color={colors.purple} />
                            :
                            <Entypo name="circle" size={20} color="black" />
                        }
                        <Text style={{ marginLeft:5 }}>Can't afford it for now</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableOpacity onPress={() => setCancelShowModal(false)}>
                    <View style={{...styles.button, marginVertical:30}}>
                        <Text style={{ color:colors.white,fontFamily:'viga' }}>No, Don't Cancel</Text>
                    </View>
                </TouchableOpacity>
                {
                    cancelReason ?
                    <TouchableOpacity onPress={cancelSubscription}>
                        <Text style={{ color:"red",textAlign:'center' }}>Finish cancellation</Text>
                    </TouchableOpacity>
                    :
                    <Text style={{ color:"pink",textAlign:'center' }}>Finish cancellation</Text>
                }
            </SafeAreaView>
        </Modal>
        <View style={{ flexDirection:'row',marginVertical:10,alignItems:'center',justifyContent:'space-between' }}>
            <View style={{ flexDirection:'row',alignItems:'center' }}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ marginLeft:10 }}>
                    <Text style={{ fontFamily:'viga',fontSize:24 }}>#{item.id}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => setCancelShowModal(true)}>
                <View style={{ marginVertical:10 }}>
                    <Text style={{ color:'red',textAlign:'center' }}>Cancel Subscription</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={styles.plan}>
            <View style={styles.planName}>
                <Text style={{ fontFamily:'viga',fontSize:20,letterSpacing:1,textTransform:'capitalize' }}>{planName}</Text>
            </View>
            <View style={styles.planDesc}>
                <Text>{planDesc}</Text>
            </View>
        </View>
        <View style={styles.line} />
        <ScrollView nestedScrollEnabled={true}>
        <View>
            <View style={{ marginVertical:10 }}>
                <View>
                    <Text style={styles.title}>Selected spaces</Text>
                </View>
                <ScrollView horizontal={true} contentContainerStyle={{ marginVertical:10 }}>
                    {
                        places.split(',').map(place => {
                            var letters = place.replace(/[^a-z]/g, '')
                            var number = place.replace(/[^0-9]/g, '')
                            return (
                                <View key={place} style={{...styles.option}}>
                                    <Text>{number}{" "}{letters}</Text>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
            <View style={{ marginVertical:10 }}>
                <View>
                    <Text style={styles.title}>Cleaning interval</Text>
                </View>
                <View style={{ ...styles.option,alignSelf:'flex-start',marginVertical:5 }}>
                    <Text>{cleaning_interval_frequency}x {cleaning_interval}</Text>
                </View>
            </View>
            <View style={{ marginVertical:10 }}>
                <View>
                    <Text style={styles.title}>Cleaning Days</Text>
                </View>
                <ScrollView horizontal={true} contentContainerStyle={{ marginVertical:10 }}>
                    {
                        day_period.split(',').map(day => (
                            <View key={day} style={{ ...styles.option,alignSelf:'flex-start' }}>
                                <Text>{day}</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            <View style={{ marginVertical:10 }}>
                <View>
                    <Text style={styles.title}>Cleaning Time</Text>
                </View>
                <ScrollView horizontal={true} contentContainerStyle={{ marginVertical:10 }}>
                    {
                        time_period.split(',').map(time => (
                            <View key={time} style={{ ...styles.option,alignSelf:'flex-start' }}>
                                <Text>{time}</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                <View style={styles.button}>
                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Make a complaint</Text>
                </View>
            </TouchableOpacity>
        </View>
        </ScrollView>
    </SafeAreaView>
    }
    </>
  )
}

const styles = StyleSheet.create({
    plan:{
        backgroundColor:'#dcdcdc',
        borderRadius:10,
        padding:10,
        marginVertical:10,
        elevation:3,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    planName:{
        marginVertical:10,
    },
    line:{
        backgroundColor:colors.lightPurple,
        height:2,
        width:'100%',
        marginVertical:10
    },
    container:{
        flex:1,
        padding:10
    },
    option:{
        borderColor:colors.purple, 
        backgroundColor:colors.lightPurple,
        borderWidth:2,
        padding:5,
        alignItems:'center',
        justifyContent:'center',
        marginRight:10,
        paddingHorizontal:20,
        opacity:0.7,
        borderRadius:5
    },
    title:{
        fontSize:18,
        fontFamily:'viga',
        letterSpacing:1
    },
    backBtn:{
        padding:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(225,225,225,1)',
        margin:10,
        width:40,
        height:40,
        borderRadius:10,
        elevation:3
    },
    overview:{
        borderRadius:20,
        elevation:3,
        flex:1,
        backgroundColor:colors.white,
    },
    avatar:{
        borderRadius:50,
        backgroundColor:colors.black,
        height:60,
        alignItems:'center',
        justifyContent:'center',
        width:60,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom:10
    },
    eachChoice:{
        margin:10
    },
    title:{
        fontFamily:'viga',
        fontSize:18,
        letterSpacing:1
    },
    sizeOption:{
        borderWidth:1,
        borderColor:colors.purple,
        paddingHorizontal:20,
        marginVertical:10,
        marginRight:10,
        paddingVertical:3
    },
    chosenOption:{
        backgroundColor:colors.lightPurple,
        borderWidth:0
    },
    chosenText:{
        color:colors.purple,
        fontWeight:'bold',
        fontSize:16
    },
    infoBox:{
        padding:20,
        alignItems:'center',
        marginRight:10,
        borderWidth:2,
        borderColor:colors.purple,
        borderRadius:10,
        justifyContent:'space-between'
    },
    infoBoxText:{
        fontWeight:'bold'
    },
    button: {
        backgroundColor: colors.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        paddingVertical:10,
    },
    reason:{
        flexDirection:'row',
        width:'100%',
        padding:10,
        marginVertical:5,
        alignItems:'center',
        borderWidth:1,
        borderColor:colors.darkPurple
    },
    chosenReason:{
        borderColor:colors.purple,
        borderWidth:2
    },
    lottie: {
        width: 100,
        height: 100
    }
})