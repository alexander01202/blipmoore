import { StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../colors/colors'
import { MaterialIcons,Feather,AntDesign,Ionicons } from '@expo/vector-icons';
import AnimatedLoader from 'react-native-animated-loader';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { useSelector } from 'react-redux';
import WebViewMainModal from '../webView/WebView';
import { mixpanel } from '../../components/MixPanel';
import { AllKeys } from '../../keys/AllKeys';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

export default function Summary({ navigation,route }) {
    const { id,displayName,email } = useSelector(state => state.login)
    const { state,country } = useSelector(state => state.location)
    const { cleanerPay,supervisorPay,frequency,interval,spaceOption,numberOfBalcony,numberOfBathroom,numberOfBedroom,numberOfCloset,numberOfKitchen,numberOfStore,numberOfWalkway,numOfCleaners,numOfSupervisors,bonusOptions,amount,subInterval } = route.params
    const [isPending, setIsPending] = useState(false)
    const [webViewModal, setWebViewModal] = useState({ show:false,url:null })
    const [cleanerArr, setCleanerArr] = useState([])
    const [supervisorArr, setSupervisorArr] = useState([])
    const handleViewRef = useRef(null)
    const planNameRef = useRef(null)
    const planDescRef = useRef(null)
    const amountRef = useRef(null)

    useEffect(() => {
        handleViewRef.current.animate({ 0: { opacity: 0 }, 1: { opacity: 0 } });
        planDescRef.current.animate({ 0: { opacity: 0 }, 1: { opacity: 0 } });
        amountRef.current.animate({ 0: { opacity: 0 }, 1: { opacity: 0 } });
        planNameRef.current.fadeInDown(300).then(endState => planDescRef.current.fadeInDown(500).then(endState => amountRef.current.fadeInLeft(300).then(endState => handleViewRef.current.fadeInUp(1000))))
    
    }, [])
    
    useEffect(() => {
        var sup_arr = []
        var cleaner_arr = []
        for (let i = 0; i < numOfSupervisors; i++) {
            sup_arr.push(i)
        }
        for (let i = 0; i < numOfCleaners; i++) {
            cleaner_arr.push(i)
        }
        setCleanerArr(cleaner_arr)
        setSupervisorArr(sup_arr)
    }, [])
    
    const checkOut = async() => {
        setIsPending(true)
        var places = ''
        var bonus_options = ''
        if (spaceOption.bedroom && numberOfBedroom) {
            places += `${numberOfBedroom} bedroom,`   
        }if (spaceOption.balcony && numberOfBalcony) {
            places += `${numberOfBalcony} balcony,`   
        }if (spaceOption.closet && numberOfCloset) {
            places += `${numberOfCloset} closet,`   
        }if (spaceOption.bathroom && numberOfBathroom) {
            places += `${numberOfBathroom} bathroom,`   
        }if (spaceOption.kitchen && numberOfKitchen) {
            places += `${numberOfKitchen} kitchen,`   
        }if (spaceOption.store && numberOfStore) {
            places += `${numberOfStore} store,`   
        }if (spaceOption.walkway && numberOfWalkway) {
            places += `${numberOfWalkway} walkway,`   
        }
        Object.entries(bonusOptions).map(item => {
            if (item[1]) {
                if (bonus_options.length > 0) {
                    bonus_options += ',' + item[0]   
                }else{
                    bonus_options += item[0]
                }
            }
        })
        var deadline = moment().startOf('day').add(7, 'days').valueOf()
        const createPlan = await fetch(`${AllKeys.ipAddress}/createPlan?discount=0&cleanerPay=${cleanerPay}&supervisorPay=${supervisorPay}&places=${places}&state=${state}&country=${country}&deadline=${deadline}&cleaner=${numOfCleaners}&supervisor=${numOfSupervisors}&email=${email}&cleaningInterval=${interval.weekly ? 'weekly' : 'monthly' }&cleaningIntervalFrequency=${frequency}&bonus=${bonus_options}&name=blipmoore${interval.monthly ? `monthly${amount}` : `weekly${amount}`}&amount=${amount}&subInterval=${subInterval.weekly ? 'weekly' : 'monthly' }&customer_name=${displayName}&customerId=${id}`)
        const { success,url,error } = await createPlan.json()
        if (success) {
            setWebViewModal({ show:true, url })
        }else{
            showMessage({
                type:'danger',
                message:`Error`,
                description:`${error}`
            })
        }
        setIsPending(false)
    }
    const closeWebView = (val,planId) => {
        setIsPending(true)
        setWebViewModal({ show:false, url:null })
        if (val === 'subscribed') {
            mixpanel.getPeople().set("Plan", "custom");
            mixpanel.getPeople().trackCharge(amount + '');
            setIsPending(false)
            console.log(frequency,'frequency')
            navigation.navigate('AfterPayment', { planId,frequency,plan:'paid',amount,custom:true,plan_name:displayName,plan_desc:'' })
        }else{
            console.log(val,'value')
            setIsPending(false)
        }
    }
    return (
    <>
    <WebViewMainModal amount={amount} userid={id} closeWebView={closeWebView} webViewModal={webViewModal} />
    <View style={styles.container}>
        <AnimatedLoader 
          visible={isPending}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <TouchableOpacity onPress={() => navigation.pop()}>
            <View>
              <AntDesign name="arrowleft" size={24} color={colors.black} />
            </View>
        </TouchableOpacity>
        <View style={{ marginVertical:10 }}>
            <Text style={{ fontFamily:'viga',fontSize:25 }}>Summary of your plan</Text>
        </View>
      <View style={styles.selection}>
        <View style={styles.header}>
            <Animatable.View ref={planNameRef} style={styles.planHeader}>
                <Text style={styles.planName}>{displayName} plan</Text>
            </Animatable.View>
            <Animatable.View ref={planDescRef} style={styles.planHeader}>
                <Text style={{ color:'#696969' }}>No description yet</Text>
            </Animatable.View>
        </View>
        <CollapsibleView 
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{borderBottomWidth:1,borderColor:'#696969'}}
        title={
        <View style={styles.section}>
            <Animatable.Text ref={amountRef} style={{ fontWeight:'bold',color:colors.black }}>NGN {Number(amount).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')}<Text style={{ color:'#696969',fontWeight:'normal' }}>/{subInterval.weekly ? 'week' : 'month'}</Text></Animatable.Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            {
                Number(numOfCleaners) > 0 && numOfCleaners && 
                <View style={styles.benefit}>
                    {
                        cleanerArr.map(arr => (
                            <Ionicons name="person" size={14} color="black" />
                        ))
                    }
                    <Text style={styles.benefitTxt}>Cleaner</Text>
                </View>
            }
            {
                Number(numOfSupervisors) > 0 && numOfSupervisors &&
                <View style={styles.benefit}>
                    {
                        supervisorArr.map(arr => (
                            <Ionicons name="person" size={14} color="black" />
                        ))
                    }
                    <Text style={styles.benefitTxt}>Supervisor</Text>
                </View>
            }
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>{ interval.weekly ? `${frequency} days Every Week` : interval.monthly ? frequency == 1 ? 'Once a month' : frequency == 2 ? 'Once Every 2 weeks': frequency == 3 ? 'Once a week for three weeks' : frequency == 4 ? 'Once Every week Per Month' : 'Error' : null}</Text>
            </View>
            {
                numberOfBedroom &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfBedroom} Bedroom</Text>
                </View>
            }
            {
                numberOfBalcony &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfBalcony} Balcony</Text>
                </View>
            }
            {
                numberOfBathroom &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfBathroom} Bathroom</Text>
                </View>
            }
            {
                numberOfCloset &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfCloset} Closet</Text>
                </View>
            }
            {
                numberOfKitchen &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfKitchen} Kitchen</Text>
                </View>
            }
            {
                numberOfStore &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfStore} Store</Text>
                </View>
            }
            {
                numberOfWalkway &&
                <View style={styles.benefit}>
                    <Feather name="check" size={14} color={colors.purple} />
                    <Text style={styles.benefitTxt}>{numberOfWalkway} Walkway</Text>
                </View>
            }
        </View>
        <View style={styles.line} />
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>1 Deep cleaning / month</Text>
        </View>
        {bonusOptions.lr && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Living Room</Text>
        </View>}
        {bonusOptions.balcony && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Balcony</Text>
        </View>}
        {bonusOptions.bathroom && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Bathroom</Text>
        </View>}
        {bonusOptions.bedroom && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Bedroom</Text>
        </View>}
        {bonusOptions.closet && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Closet</Text>
        </View>}
        {bonusOptions.store &&
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Store</Text>
        </View>}
        {bonusOptions.kitchen && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Kitchen</Text>
        </View>}
        {bonusOptions.walkway && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 WalkWay</Text>
        </View>}
        {bonusOptions.family && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>Family treatment</Text>
        </View>}
        {bonusOptions.special && 
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>{displayName} special treatment</Text>
        </View>}
        </CollapsibleView>
        <TouchableNativeFeedback onPress={checkOut}>
            <Animatable.View style={styles.button} ref={handleViewRef}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Checkout</Text>
            </Animatable.View>
        </TouchableNativeFeedback>
      </View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
        backgroundColor:'#dcdcdc'
    },
    selection:{
        backgroundColor:"#FAF9F6",
        padding:10,
        borderRadius:10,
        paddingHorizontal:15,
        marginVertical:10
    },
    header:{
        alignItems:'flex-start',
        justifyContent:'center',
        marginVertical:10
    },
    planName:{
        fontFamily:'viga',
        fontSize:20,
        letterSpacing:1,
        color:colors.purple
    },
    planHeader:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        alignItems:'center',
        marginBottom:10
    },
    section:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10,
        alignItems:'center',
        width:"100%",
    },
    line:{
        backgroundColor:'#c8c8c8',
        height:2,
        width:'100%'
    },
    dets:{
        // backgroundColor:colors.purple,
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        paddingHorizontal:15,
        // borderRadius:5,
        flexDirection:'row'
    },
    button:{
        marginVertical:10,
        backgroundColor:colors.purple,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:'100%',
        alignSelf:'center',
        borderRadius:5
    },
    benefits:{
        width:'100%',
        marginVertical:10
    },
    benefit:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5
    },
    benefitTxt:{
        textTransform:'capitalize',
        marginLeft:10
    },
    bonusText:{
        fontWeight:'bold'
    },
    lottie: {
        width: 100,
        height: 100
    },
})