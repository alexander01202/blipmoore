import { Text, StyleSheet, View, ScrollView, TouchableWithoutFeedback, TouchableOpacity,Dimensions, Image, Modal,TouchableNativeFeedback } from 'react-native'
import { WebView } from 'react-native-webview';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { colors } from '../../colors/colors'
import SelectDropdown from 'react-native-select-dropdown'
import { AntDesign,Zocial,Entypo,MaterialIcons,Feather,Fontisto,Ionicons,FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
// import DiscountModal from './DiscountModal';
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import * as bonusScrollView from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import { ipaddress } from '../../hostIPaddress';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
import WebViewMainModal from '../webView/WebView';
import { currency } from '../../currency/currency'
import AnimatedLottieView from 'lottie-react-native';

export default function Subscription({ navigation }) {
    const { displayName, email, id } = useSelector(state => state.login)
    const { state, street_number,street_name,estate,LGA,country } = useSelector(state => state.location)
    const [isPending, setIsPending] = useState(false)
    const [spaceOption, setSpaceOption] = useState({ small:true,medium:false,large:false,xlarge:false })
    const numberOfSpaces = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','16','17','18','19','20']
    const weeklyInterval = ['1','2','3','4','5','6','7']
    const monthlyInterval = ['1','2','3','4']
    const [numberOfSSA, setNumberOfSSA] = useState(null)
    const [numberOfMSA, setNumberOfMSA] = useState(null)
    const [numberOfLSA, setNumberOfLSA] = useState(null)
    const [numberOfXLSA, setNumberOfXLSA] = useState(null)
    const [interval,setInterval] = useState({ weekly:true,monthly:false })
    const [intervalFrequency,setIntervalFrequency] = useState({ weekly:null, monthly:null })
    const [timePeriod, setTimePeriod] = useState({ six:false,eight:true,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })
    const [wantsDeepCleaning,setWantsDeepCleaning] = useState(false)
    const [frequencyOfDeepCleaning, setFrequencyOfDeepCleaning] = useState(null)
    const [dayOfWeek, setDayOfWeek] = useState({ monday:false,tuesday:false,wednesday:false,thursday:false,friday:false,saturday:false,sunday:false })
    const [showDiscountModal, setShowDiscountModal] = useState(false)
    const [discountCode, setDiscountCode] = useState(null)
    const [arrayForDeepCleaningFrequency, setArrayForDeepCleaningFrequency] = useState([])
    const [totalAmount, setTotalAmount] = useState({ monthly:null, weekly:null, threeMonths:null })
    const [subscriptionInterval, setSubscriptionInterval] = useState({ weekly:true,monthly:false,threeMonths:false })
    const [bonus,setBonus] = useState({ weekly:0,monthly:0,threeMonths:0 })
    const [bonusOptions, setBonusOptions] = useState({ lr:false,kitchen:false,store:false,bedroom:false,DA:false,balcony:false,bathroom:false,closet:false,walkway:false })
    const [showBonusModal, setShowBonusModal] = useState(false)
    const selectDropdownMonthly = useRef(null)
    const selectDropdownWeekly = useRef(null)
    const bottomSheetRef = useRef(null);
    const bonusBottomSheetRef = useRef(null);
    const subscriptionBottomSheetRef = useRef(null);
    const cleaningFrequencyBottomSheetRef = useRef(null);
    const cleaningDaysBottomSheetRef = useRef(null);
    const [webViewModal, setWebViewModal] = useState({show:false, url: ''})
    // variables
    const fullSnapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const snapPointsForBonusSheets = useMemo(() => ['25%', '50%'], []);

    // callbacks
    const handleSheetChanges = useCallback(() => {
    //   console.log('handleSheetChanges');
    }, []);

useEffect(() => {
  var smallSpaces = 1500
  var mediumSpaces = 2000
  var largeSpaces = 3000
  var xLarge = 4500

  var amountOfSSA = numberOfSSA * smallSpaces
  var amountOfMSA = numberOfMSA * mediumSpaces
  var amountOfLSA = numberOfLSA * largeSpaces
  var amountOfELSA = numberOfXLSA * xLarge

    var concludeAmount = (amountOfSSA + amountOfMSA + amountOfLSA + amountOfELSA)

    if (interval.weekly) {
        var monthlyAmt = ((concludeAmount * intervalFrequency.weekly) * 4) - (((concludeAmount * intervalFrequency.weekly) * 4) * 0.1)
        setTotalAmount(prevEvents => {
            return {...prevEvents, weekly:concludeAmount * intervalFrequency.weekly, monthly:monthlyAmt }
        })
    }else if (interval.monthly) {
        setTotalAmount(prevEvents => {
            return {...prevEvents, weekly:null, monthly:(concludeAmount * intervalFrequency.monthly) }
        })
    }

  
}, [intervalFrequency.monthly,intervalFrequency.weekly,interval.weekly,interval.monthly,numberOfSSA,numberOfMSA,numberOfLSA,numberOfXLSA])

useEffect(() => {
  
    if (selectDropdownMonthly.current) {
        selectDropdownMonthly.current.reset()
    }
    if (selectDropdownWeekly.current) {
        selectDropdownWeekly.current.reset()   
    }
    setDayOfWeek({ monday:false,tuesday:false,wednesday:false,thursday:false,friday:false, saturday:false, sunday:false })
    setIntervalFrequency({ monthly:null,weekly:null })
  
}, [interval.weekly, interval.monthly])

useEffect(() => {
  
    if (totalAmount.weekly >= 3000 || totalAmount.monthly >= 3000 ) {
        var weeklyBonus = Math.floor(totalAmount.weekly / 3000)
        var monthlyBonus = Math.floor(totalAmount.monthly / 3000)
        if ((weeklyBonus < bonus.weekly) || (monthlyBonus < bonus.monthly)) {
            setBonusOptions({ DA:false,balcony:false,bathroom:false,bedroom:false,closet:false,kitchen:false,lr:false,store:false,walkway:false })
        }
        setBonus(prevEvents => {
            return {...prevEvents, weekly:weeklyBonus,monthly:monthlyBonus }
        })
    }else{
        setBonus(prevEvents => {
            return {...prevEvents, weekly:0,monthly:0 }
        })  
        setBonusOptions({ DA:false,balcony:false,bathroom:false,bedroom:false,closet:false,kitchen:false,lr:false,store:false,walkway:false })
    }
  
}, [totalAmount.monthly,totalAmount.weekly,totalAmount.threeMonths,subscriptionInterval.weekly,subscriptionInterval.monthly ])

    
useEffect(() => {
    var arr = []
    var count = 1
    if (interval.weekly) {
        while (intervalFrequency.weekly > (count - 1)) {
            arr.push(count++)
            count = count++
        }
    }else if (interval.monthly) {
        while (intervalFrequency.monthly > (count - 1)) {
            arr.push(count++)
            count = count++
        }
    }
    setArrayForDeepCleaningFrequency(arr)

}, [wantsDeepCleaning,intervalFrequency.weekly,intervalFrequency.monthly])

const updateSpace = (space) => {
    if (space === 'small') {
        if (spaceOption.small) {
            setNumberOfSSA(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, small:!spaceOption.small}
        })
    }else if (space === 'medium') {
        if (spaceOption.medium) {
            setNumberOfMSA(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, medium:!spaceOption.medium}
        })
    }else if (space === 'large') {
        if (spaceOption.large) {
            setNumberOfLSA(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, large:!spaceOption.large}
        })
    }else if (space === 'xlarge') {
        if (spaceOption.large) {
            setNumberOfXLSA(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, xlarge:!spaceOption.xlarge}
        })
    }
}
const updateNumberOfSpaces = (selectedItem, typeOfSpace) => {
    if (typeOfSpace === 'small') {
        setNumberOfSSA(Number(selectedItem))
        return
    }
    if (typeOfSpace === 'medium') {
        setNumberOfMSA(Number(selectedItem))
        return
    }
    if (typeOfSpace === 'large') {
        setNumberOfLSA(Number(selectedItem))
        return
    }
    if (typeOfSpace === 'xlarge') {
        setNumberOfXLSA(Number(selectedItem))
        return
    }
}

const updateInterval = (int) => {
    if (int === 'weekly') {
        setInterval({ weekly:true,monthly:false })
        setSubscriptionInterval({ weekly:true,monthly:false,threeMonths:false })
    }
    if (int === 'monthly') {
        setInterval({ weekly:false,monthly:true })
        setSubscriptionInterval({ weekly:false,monthly:true,threeMonths:false })
    }
}
const DisableDeepCleaning = () => {
    setWantsDeepCleaning(false)
}
const updateDaysOfWeek = (day, disable) => {
    var count = 0;
    var blockCode = false;
    if (disable) {
        Object.entries(dayOfWeek).map(item => {
            if (item[1]) {
                count++
            }if (count >= 1 && interval.monthly) {
                blockCode = true
                return   
            }if (count >= intervalFrequency.weekly && interval.weekly) {
                console.log(count, 'hello')
                blockCode = true
                return
            }
        })   
    }
    if (!blockCode && (day === 'mon')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, monday:!dayOfWeek.monday}
        })
    }else if (!blockCode && (day === 'tue')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, tuesday:!dayOfWeek.tuesday}
        })
    }else if (!blockCode && (day === 'wed')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, wednesday:!dayOfWeek.wednesday}
        })
    }else if (!blockCode && (day === 'thu')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, thursday:!dayOfWeek.thursday}
        })
    }else if (!blockCode && (day === 'fri')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, friday:!dayOfWeek.friday}
        })
    }else if (!blockCode && (day === 'sat')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, saturday:!dayOfWeek.saturday}
        })
    }else if (!blockCode && (day === 'sun')) {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, sunday:!dayOfWeek.sunday}
        })
    }
}
const changeDiscountModal = () => {
    setDiscountCode(null)
    setShowDiscountModal(!showDiscountModal)
}
const updateDiscountCode = (code) => {
    setDiscountCode(code)
}
const openSheetModal = () => {
    bottomSheetRef.current.snapToIndex(2)
}
const updateBonus = (selectedBonus,enable) => {
    var count = 0;
    var blockCode = false;
    if (enable) {
        Object.entries(bonusOptions).map(item => {
            if (item[1]) {
                count++
            }if (count >= bonus.monthly && interval.monthly) {
                blockCode = true
                return   
            }if (count >= bonus.weekly && interval.weekly) {
                blockCode = true
                return
            }
        })   
    }
    if (!blockCode) {
        if (selectedBonus === 'lr') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, lr: !bonusOptions.lr}
            })
        }
        if (selectedBonus === 'kitchen') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, kitchen: !bonusOptions.kitchen}
            })
        }
        if (selectedBonus === 'store') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, store: !bonusOptions.store}
            })
        }
        if (selectedBonus === 'bedroom') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, bedroom: !bonusOptions.bedroom}
            })
        }
        if (selectedBonus === 'DA') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, DA: !bonusOptions.DA}
            })
        }
        if (selectedBonus === 'balcony') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, balcony: !bonusOptions.balcony}
            })
        }
        if (selectedBonus === 'bathroom') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, bathroom: !bonusOptions.bathroom}
            })
        }
        if (selectedBonus === 'closet') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, closet: !bonusOptions.closet}
            })
        }
        if (selectedBonus === 'walkway') {
            setBonusOptions(prevEvents => {
                return {...prevEvents, walkway: !bonusOptions.walkway}
            })
        }
    }
}
// renders
const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
);
const renderBonusBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    []
);
const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={34} style={{ paddingHorizontal:10 }}>
        <TouchableNativeFeedback onPress={initiatePayment}>
            <View style={{ backgroundColor:colors.purple,padding:8,flexDirection:'row',justifyContent:'center',alignItems:'center' }}>
                <Text style={{ color:colors.white,textAlign:'center',fontSize:18,marginHorizontal:10,fontWeight:'bold' }}>Checkout</Text>
                <AntDesign name="arrowright" size={20} color="white" />
            </View>
        </TouchableNativeFeedback>
      </BottomSheetFooter>
    ),
    [totalAmount.monthly, totalAmount.weekly,subscriptionInterval.monthly,subscriptionInterval.weekly,subscriptionInterval.threeMonths,bonus.weekly,bonus.monthly,bonusOptions.DA,bonusOptions.balcony,bonusOptions.bathroom,bonusOptions.bedroom,bonusOptions.closet,bonusOptions.kitchen,bonusOptions.lr,bonusOptions.store,bonusOptions.walkway]
);
const initiatePayment = async() => {
    if (!interval.weekly && !interval.monthly) {
        console.log('hello')
        return
    }
    if(totalAmount.monthly < 1 && totalAmount.weekly < 1){
        return
    }
    if (((bonus.weekly) > 0 || bonus.monthly > 0) && (!bonusOptions.DA && !bonusOptions.balcony && !bonusOptions.bathroom && !bonusOptions.bedroom && !bonusOptions.closet && !bonusOptions.kitchen && !bonusOptions.lr && !bonusOptions.store && !bonusOptions.walkway) ) {
        setShowBonusModal(true)
        return       
    }
    setIsPending(true)
    var day_period = ''
    var time_period = ''
    var bonus_options = ''
    Object.entries(dayOfWeek).map(item => {
        if (item[1]) {
            if (day_period.length > 0) {
                day_period = day_period + ',' + item[0]
            }else{
                day_period = item[0]
            }
        }
    })
    Object.entries(timePeriod).map(item => {
        if (item[1]) {
            if (time_period.length > 0) {
                time_period = time_period + ',' + item[0]   
            }else{
                time_period = item[0]
            }
        }
    })
    Object.entries(bonusOptions).map(item => {
        if (item[1]) {
            if (bonus_options.length > 0) {
                bonus_options = bonus_options + ',' + item[0]   
            }else{
                bonus_options = item[0]
            }
        }
    })
    const createPlan = await fetch(`${ipaddress}/createPlan?email=${email}&deepCleaning=${wantsDeepCleaning}&time_period=${time_period}&day_period=${day_period}&cleaningInterval=${interval.weekly ? 'weekly' : 'monthly' }&cleaningIntervalFrequency=${interval.weekly ? intervalFrequency.weekly :intervalFrequency.monthly }&ssa=${numberOfSSA}&msa=${numberOfMSA}&lsa=${numberOfLSA}&elsa=${numberOfXLSA}&bonus=${bonus_options}&name=blipmoore${interval.monthly ? `monthly${totalAmount.monthly}` : `weekly${totalAmount.weekly}`}&amount=${interval.monthly ? `${totalAmount.monthly}` : subscriptionInterval.weekly ? `${totalAmount.weekly}` : subscriptionInterval.monthly ? `${totalAmount.monthly}` : null }&subInterval=${subscriptionInterval.weekly ? 'weekly' : subscriptionInterval.monthly ? 'monthly' : 'monthly' }&email=${email}&customer_name=${displayName}&customerId=${id}`)
    const { success,url } = await createPlan.json()
    
    if (success) {
        setWebViewModal({ show:true, url })
    }
    setIsPending(false)
}
const closeWebView = (val) => {
    setIsPending(true)
    setWebViewModal({ show:false, url:null })
    if (val == 'subscribed') {
        setIsPending(false)
        navigation.navigate('ThankYouPage')
    }else{
        setIsPending(false)
    }
}
const refuseBonus = async() => {
    setIsPending(true)
    const createPlan = await fetch(`${ipaddress}/createPlan?name=blipmoore${interval.monthly ? `monthly${totalAmount.monthly}` : `weekly${totalAmount.weekly}`}&amount=${interval.monthly ? `${totalAmount.monthly}` : subscriptionInterval.weekly ? `${totalAmount.weekly}` : subscriptionInterval.monthly ? `${totalAmount.monthly}` : null } &interval=${subscriptionInterval.weekly ? 'weekly' : subscriptionInterval.monthly ? 'monthly' : 'monthly' }&email=${email}&customer_name=${displayName}&customerId=${id}`)
    const { success,url } = await createPlan.json()
    if (success) {
        setWebViewModal({ show:true, url })
    }
    setIsPending(false)
}
return (
    <>
    <AnimatedLoader 
      visible={isPending}
      overlayColor="rgba(255,255,255,0.75)"
      source={require('../../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    <View style={styles.container_one}>
      <AnimatedLottieView 
          source={require('../../lottie/update3.json')}
          autoPlay={true}
          loop={true}
          resizeMode={'contain'}
          style={{ width:'100%' }}
      />
      <View style={{ marginVertical:5 }}>
          <Text style={{ fontFamily:'Magison',fontSize:30 }}>Coming soon</Text>
      </View>
    </View>
    {/* <Modal
        visible={showBonusModal}
        transparent={true}
        onRequestClose={() => {
            setShowBonusModal(false)
        }}
        animationType='fade'
    >
        <View style={{...styles.container, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)'}}>
            <View style={{ backgroundColor:'white',width:'100%',padding:20,borderRadius:10 }}>
                <Text style={{ textAlign:'center',marginVertical:20,fontFamily:'viga',fontSize:24 }}>You still have a bonus left to claim 🎁</Text>
                <TouchableNativeFeedback onPress={() => {
                    setShowBonusModal(false)
                    bottomSheetRef.current.close()
                    bonusBottomSheetRef.current.expand()
                }}>
                    <View style={styles.btn}>
                        <Text style={{ color:colors.white }}>Yes, I want to claim my bonus</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    setShowBonusModal(false)
                    refuseBonus()
                }}>
                    <View style={{...styles.btn, backgroundColor:'transparent',borderWidth:1,borderColor:colors.purple }}>
                        <Text style={{ color:colors.black }}>No, I don't want my bonus</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    </Modal>
    <WebViewMainModal amount={subscriptionInterval.weekly ? totalAmount.weekly : totalAmount.monthly } userid={id} closeWebView={closeWebView} webViewModal={webViewModal} />
    <DiscountModal updateDiscountCode={updateDiscountCode} changeDiscountModal={changeDiscountModal} showDiscountModal={showDiscountModal} />
    <View style={styles.container}>
    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
            <View>
              <AntDesign name="arrowleft" size={24} color={colors.black} />
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Enterprise')}>
            <View>
                <Text style={{ color:'blue',textDecorationLine:'underline',fontWeight:'bold' }}>Are you an enterprise?</Text>
            </View>
        </TouchableWithoutFeedback>
    </View>
    <ScrollView>
        <View style={{ marginVertical:10 }}>
        <Text style={styles.question}>Size Of the Space/Area?</Text>
            <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
                <TouchableWithoutFeedback onPress={() => updateSpace('small')}>
                <View style={spaceOption.small ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                    <Text style={spaceOption.small ? {fontWeight:'bold'} : null}>small</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('medium')}>
                <View style={spaceOption.medium ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                    <Text style={spaceOption.medium ? {fontWeight:'bold'} : null}>Medium</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('large')}>
                <View style={spaceOption.large ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                    <Text style={spaceOption.large ? {fontWeight:'bold'} : null}>Large</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('xlarge')}>
                <View style={spaceOption.xlarge ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                    <Text style={spaceOption.xlarge ? {fontWeight:'bold'} : null}>Extra large</Text>
                </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </View>
        {
            spaceOption.small
            ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many small spaces?</Text>
                <SelectDropdown defaultValue={numberOfSSA} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'small') }} />
            </View>
            :
            null
        }
        {
            spaceOption.medium
            ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many medium spaces?</Text>
                <SelectDropdown defaultValue={numberOfMSA} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'medium') }} />
            </View>
            :
            null
        }
        {
            spaceOption.large
            ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many large spaces?</Text>
                <SelectDropdown defaultValue={numberOfLSA} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'large') }} />
            </View>
            :
            null
        }
        {
            spaceOption.xlarge
            ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Extra Large spaces?</Text>
                <SelectDropdown defaultValue={numberOfXLSA} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'xlarge') }} />
            </View>
            :
            null
        }
        {
            numberOfSSA || numberOfMSA || numberOfLSA || numberOfXLSA ?
            <>
                <View style={{ marginVertical:10 }}>
                <TouchableWithoutFeedback onPress={() => cleaningFrequencyBottomSheetRef.current.snapToIndex(1)}> 
                    <View style={{ alignItems:'center',flexDirection:'row' }}>  
                        <Text style={styles.question}>What Cleaning interval is best for you?</Text>
                        <Entypo name="info-with-circle" size={14} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                    <ScrollView horizontal={true}>
                        <TouchableWithoutFeedback onPress={() => updateInterval('weekly')}>
                            <View style={interval.weekly ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={interval.weekly ? {fontWeight:'bold'} : null}>Weekly</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateInterval('monthly')}>
                            <View style={interval.monthly ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={interval.monthly ? {fontWeight:'bold'} : null}>Monthly</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
            </>   
            :
            null
        }
        {
            (numberOfSSA || numberOfMSA || numberOfLSA || numberOfXLSA) && interval.weekly ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times Per Week?</Text>
                <SelectDropdown ref={selectDropdownWeekly} defaultValue={intervalFrequency.weekly} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={weeklyInterval} onSelect={(selectedItem, index) => { setIntervalFrequency({weekly:selectedItem, monthly:null}) }} />
            </View>
            :
           ( numberOfSSA || numberOfMSA || numberOfLSA || numberOfXLSA) && interval.monthly?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times Per Month?</Text>
                <SelectDropdown ref={selectDropdownMonthly} defaultValue={intervalFrequency.monthly} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={monthlyInterval} onSelect={(selectedItem, index) => { setIntervalFrequency({monthly:selectedItem, weekly:null}) }} />
            </View>
            :
            null
        }
        {
            (numberOfSSA || numberOfMSA || numberOfLSA || numberOfXLSA) && (interval.weekly || interval.monthly) && (intervalFrequency.weekly || intervalFrequency.monthly) ?
            <>
                <View style={{ marginVertical:10 }}>
                <TouchableWithoutFeedback onPress={() => cleaningDaysBottomSheetRef.current.snapToIndex(1)}>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <Text style={{...styles.question, marginRight:5 }}>Pick { interval.weekly ?  intervalFrequency.weekly : interval.monthly ? '1' : null} days for your cleaning?</Text>
                        <Entypo name="info-with-circle" size={14} color="black" />
                    </View>
                </TouchableWithoutFeedback> 
                    <ScrollView horizontal={true}>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('mon', !dayOfWeek.monday)}>
                            <View style={dayOfWeek.monday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.monday ? {fontWeight:'bold'} : null}>Monday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('tue',!dayOfWeek.tuesday)}>
                            <View style={dayOfWeek.tuesday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.tuesday ? {fontWeight:'bold'} : null}>Tuesday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('wed', !dayOfWeek.wednesday)}>
                            <View style={dayOfWeek.wednesday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.wednesday ? {fontWeight:'bold'} : null}>Wednesday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('thu', !dayOfWeek.thursday)}>
                            <View style={dayOfWeek.thursday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.thursday ? {fontWeight:'bold'} : null}>Thursday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('fri', !dayOfWeek.friday)}>
                            <View style={dayOfWeek.friday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.friday ? {fontWeight:'bold'} : null}>Friday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('sat', !dayOfWeek.saturday)}>
                            <View style={dayOfWeek.saturday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.saturday ? {fontWeight:'bold'} : null}>Saturday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('sun', !dayOfWeek.sunday)}>
                            <View style={dayOfWeek.sunday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={dayOfWeek.sunday ? {fontWeight:'bold'} : null}>Sunday</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
            </>   
            :
            null
        }
        {
            dayOfWeek.monday || dayOfWeek.tuesday || dayOfWeek.wednesday || dayOfWeek.thursday || dayOfWeek.friday || dayOfWeek.saturday || dayOfWeek.sunday ?
            <View style={{...styles.numOfSpace, marginVertical:10}}>
                <Text style={styles.question}>What time should the cleaning take place?</Text>
                <ScrollView horizontal={true}>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod({ six:true,eight:false,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })}>
                        <View style={timePeriod.six ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.six ? {fontWeight:'bold'} : null}>6:00 am - 8:00 am</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod({ six:false,eight:true,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })}>
                        <View style={timePeriod.eight ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.eight ? {fontWeight:'bold'} : null}>8:00 am - 10:00 am</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod({ six:false,eight:false,ten:true,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })}>
                        <View style={timePeriod.ten ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.ten ? {fontWeight:'bold'} : null}>10:00 am - 12:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod({ six:false,eight:false,ten:false,twelvePM:true,twoPM:false,fourPM:false,sixPM:false })}>
                        <View style={timePeriod.twelvePM ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.twelvePM ? {fontWeight:'bold'} : null}>12:00 pm - 02:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod({ six:false,eight:false,ten:false,twelvePM:false,twoPM:true,fourPM:false,sixPM:false })}>
                        <View style={timePeriod.twoPM ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.twoPM ? {fontWeight:'bold'} : null}>02:00 pm - 04:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod({ six:false,eight:false,ten:false,twelvePM:false,twoPM:false,fourPM:true,sixPM:false })}>
                        <View style={timePeriod.fourPM ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.fourPM ? {fontWeight:'bold'} : null}>04:00 pm - 06:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
            :
            null
        }
        {
            (totalAmount.weekly || totalAmount.monthly || totalAmount.threeMonths) && interval.weekly ?
            <View style={{ marginVertical:10 }}>
                    <TouchableWithoutFeedback onPress={() => subscriptionBottomSheetRef.current.snapToIndex(1)}>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <Text style={{...styles.question, marginRight:5}}>How often would you like to be charged?</Text>
                        <Entypo name="info-with-circle" size={14} color="black" />
                    </View>
                    </TouchableWithoutFeedback>
                <ScrollView horizontal={true}>
                    <TouchableWithoutFeedback onPress={() => setSubscriptionInterval({ weekly:true,monthly:false,threeMonths:false })}>
                        <View style={subscriptionInterval.weekly ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={subscriptionInterval.weekly ? {fontWeight:'bold'} : null}>Weekly</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setSubscriptionInterval({ weekly:false,monthly:true,threeMonths:false })}>
                        <View style={subscriptionInterval.monthly ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={subscriptionInterval.monthly ? {fontWeight:'bold'} : null}>Monthly</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>  
            :
            null
        }
        {
            dayOfWeek.monday || dayOfWeek.tuesday || dayOfWeek.wednesday || dayOfWeek.thursday || dayOfWeek.friday || dayOfWeek.saturday || dayOfWeek.sunday ?
            <View style={{ marginVertical:10 }}>
            <Text style={styles.question}>Would You Like Deep Cleaning?</Text>
                <ScrollView horizontal={true}>
                    <TouchableWithoutFeedback onPress={() => setWantsDeepCleaning(true)}>
                        <View style={wantsDeepCleaning ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={wantsDeepCleaning ? {fontWeight:'bold'} : null}>Yes</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => DisableDeepCleaning()}>
                        <View style={!wantsDeepCleaning ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={!wantsDeepCleaning ? {fontWeight:'bold'} : null}>No</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View> 
            :
            null
        }
        {
            (numberOfSSA || numberOfMSA || numberOfLSA || numberOfXLSA) && interval.weekly && wantsDeepCleaning?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times do you require deep Cleaning Per Week?</Text>
                <SelectDropdown defaultValue={frequencyOfDeepCleaning} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={arrayForDeepCleaningFrequency} onSelect={(selectedItem, index) => { setFrequencyOfDeepCleaning(selectedItem) }} />
            </View>
            : (numberOfSSA || numberOfMSA || numberOfLSA || numberOfXLSA) && interval.monthly && wantsDeepCleaning ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times do you require deep Cleaning Per Month?</Text>
                <SelectDropdown defaultValue={frequencyOfDeepCleaning} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={arrayForDeepCleaningFrequency} onSelect={(selectedItem, index) => { setFrequencyOfDeepCleaning(selectedItem) }} />
            </View>
            :
            null
        }
        <View style={{ flexDirection:'row',marginVertical:20,justifyContent:'space-between',alignItems:'center' }}>
            <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black }}>Promo Code</Text>
            <TouchableWithoutFeedback onPress={() => setShowDiscountModal(true)}>
                <View style={{ flexDirection:'row' }}>
                    <AntDesign name="edit" size={18} color={colors.green} />
                    <Text style={{ color:colors.green,textDecorationLine:'underline',textTransform:'uppercase' }}>{discountCode ? discountCode :'ENTER CODE'}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
        <View style={{ flexDirection:'row',marginVertical:5,justifyContent:'space-between',alignItems:'center' }}>
            <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black }}>BONUS 🎉🎉</Text>
            <TouchableWithoutFeedback onPress={() => bonusBottomSheetRef.current.snapToIndex(1)}>
                <View style={{ flexDirection:'row' }}>
                    <Text style={{ color:colors.green,textDecorationLine:'underline' }}>Pick {interval.weekly ? bonus.weekly : bonus.monthly} spaces of any size</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
        <View style={{ flexDirection:'row',marginVertical:20,justifyContent:'space-between',alignItems:'center' }}>
            <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black }}>You Pay Now</Text>
            <View>
                <Text style={{ color:colors.green,textTransform:'uppercase',textAlign:'right' }}>
                {currency.naira}{interval.weekly && subscriptionInterval.weekly ?
                    Number(totalAmount.weekly).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
                    :
                    interval.weekly && subscriptionInterval.monthly ?
                    Number(totalAmount.monthly).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
                    :
                    Number(totalAmount.monthly).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
                }
                </Text>
                {
                    subscriptionInterval.monthly && interval.weekly &&
                    <View>
                        <Text style={{ color:'grey',fontSize:12,textAlign:'right',fontStyle:'italic' }}>10% off applied</Text>
                    </View>
                }
            </View>
        </View>
        {
           dayOfWeek.monday || dayOfWeek.tuesday || dayOfWeek.wednesday || dayOfWeek.thursday || dayOfWeek.friday || dayOfWeek.saturday || dayOfWeek.sunday
            ?
            <TouchableOpacity onPress={openSheetModal}>
                <View style={{ backgroundColor:colors.purple,padding:8,marginBottom:100 }}>
                    <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>View Summary</Text>
                </View>
            </TouchableOpacity>
            :
            <View style={{ backgroundColor:colors.lightPurple,padding:8,marginBottom:100 }}>
                <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>View Summary</Text>
            </View>
        }
        </ScrollView>
        <BottomSheet
            ref={bonusBottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            style={{...styles.bottomSheetContainer, padding:5}}
            backdropComponent={renderBonusBackdrop}
        >
            <Text style={{...styles.question, textAlign:'center',fontSize:18}}>Select {interval.weekly ? bonus.weekly : bonus.monthly} Bonus 😉</Text>
            <View style={{ width:'90%' }}>
                <View style={{ marginVertical:10 }}>
                    <bonusScrollView.ScrollView horizontal={true}>
                        <TouchableWithoutFeedback onPress={() => updateBonus('lr', !bonusOptions.lr)}>
                            <View style={bonusOptions.lr ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.lr ? {fontWeight:'bold'} : null}>Living Room</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateBonus('kitchen', !bonusOptions.kitchen)}>
                            <View style={bonusOptions.kitchen ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.kitchen ? {fontWeight:'bold'} : null}>Kitchen</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateBonus('store', !bonusOptions.store)}>
                            <View style={bonusOptions.store ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.store ? {fontWeight:'bold'} : null}>Store</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </bonusScrollView.ScrollView>
                </View>
                <View style={{ marginVertical:10 }}>
                    <bonusScrollView.ScrollView horizontal={true}>
                        <TouchableWithoutFeedback onPress={() => updateBonus('bedroom', !bonusOptions.bedroom)}>
                            <View style={bonusOptions.bedroom ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.bedroom ? {fontWeight:'bold'} : null}>Bedroom</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateBonus('DA', !bonusOptions.DA)}>
                            <View style={bonusOptions.DA ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.DA ? {fontWeight:'bold'} : null}>Dining Area</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateBonus('balcony', !bonusOptions.balcony)}>
                            <View style={bonusOptions.balcony ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.balcony ? {fontWeight:'bold'} : null}>Balcony</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </bonusScrollView.ScrollView>
                </View>
                <View style={{ marginVertical:10 }}>
                    <bonusScrollView.ScrollView horizontal={true}>
                        <TouchableWithoutFeedback onPress={() => updateBonus('bathroom', !bonusOptions.bathroom)}>
                            <View style={bonusOptions.bathroom ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.bathroom ? {fontWeight:'bold'} : null}>Bathroom</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateBonus('closet', !bonusOptions.closet)}>
                            <View style={bonusOptions.closet ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.closet ? {fontWeight:'bold'} : null}>Closet</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateBonus('walkway', !bonusOptions.walkway)}>
                            <View style={bonusOptions.walkway ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={bonusOptions.walkway ? {fontWeight:'bold'} : null}>Walk Way</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </bonusScrollView.ScrollView>
                </View>
            </View>
            </BottomSheet>
            <BottomSheet
                ref={subscriptionBottomSheetRef}
                index={-1}
                snapPoints={snapPointsForBonusSheets}
                enablePanDownToClose={true}
                style={styles.bottomSheetContainer}
                backdropComponent={renderBonusBackdrop}
            >
                <FastImage style={{ width:'100%',height:'40%' }} source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/chargeInterval.png'}} resizeMode={FastImage.resizeMode.contain} />
                <View style={{ padding:10 }}>
                    <Text style={{ fontSize:24,textAlign:'center',fontFamily:'Funzi',letterSpacing:1 }}>Charge Frequency</Text>
                    <Text style={{ textAlign:'center',marginVertical:20,fontSize:18 }}>This is how often your account would be charged. It is the interval of your subscription.</Text>
                </View>
            </BottomSheet>
            <BottomSheet
                ref={cleaningFrequencyBottomSheetRef}
                index={-1}
                snapPoints={snapPointsForBonusSheets}
                enablePanDownToClose={true}
                style={styles.bottomSheetContainer}
                backdropComponent={renderBonusBackdrop}
            >
                <FastImage style={{ width:'100%',height:'40%' }} source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/cleaningFrequency.png'}} resizeMode={FastImage.resizeMode.contain} />
                <View style={{ padding:10 }}>
                    <Text style={{ fontSize:24,textAlign:'center',fontFamily:'Funzi',letterSpacing:1 }}>Cleaning Frequency</Text>
                    <Text style={{ textAlign:'center',marginVertical:20,fontSize:18 }}>This is how often you would like your space to be cleaned.</Text>
                    <Text style={{ textAlign:'center',fontSize:18,fontWeight:'bold' }}>Monthly/weekly.</Text>
                </View>
            </BottomSheet>
            <BottomSheet
                ref={cleaningDaysBottomSheetRef}
                index={-1}
                snapPoints={snapPointsForBonusSheets}
                enablePanDownToClose={true}
                style={styles.bottomSheetContainer}
                backdropComponent={renderBonusBackdrop}
            >
                <FastImage style={{ width:'100%',height:'40%' }} source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/calendar.png'}} resizeMode={FastImage.resizeMode.contain} />
                <View style={{ padding:10 }}>
                    <Text style={{ fontSize:24,textAlign:'center',fontFamily:'Funzi',letterSpacing:1 }}>Cleaning Days</Text>
                    <Text style={{ textAlign:'center',marginVertical:20,fontSize:18 }}>These are the days that your space would be cleaned.</Text>
                </View>
            </BottomSheet>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={fullSnapPoints}
                // onChange={handleSheetChanges}
                enablePanDownToClose={true}
                style={styles.bottomSheetContainer}
                backdropComponent={renderBackdrop}
                footerComponent={renderFooter}
            >
                <FastImage style={{ width:'100%',height:'20%' }} source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/summary2.png'}} resizeMode={FastImage.resizeMode.contain} />
                <bonusScrollView.ScrollView style={{...styles.contentContainer, marginBottom:100}}>
                  <View style={{...styles.bottomSheetSelection,alignItems:'flex-start'}}>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <SimpleLineIcons name="size-fullscreen" size={12} color={colors.darkPurple} style={{ marginRight:5 }} />
                        <Text style={styles.bottomSheetTitle}>Size of the space</Text>
                    </View>
                    <View>
                        {spaceOption.small && <Text style={styles.textOption}>Small</Text>}
                        {spaceOption.medium && <Text style={styles.textOption}>Medium</Text>}
                        {spaceOption.large && <Text style={styles.textOption}>Large</Text>}
                        {spaceOption.xlarge && <Text style={styles.textOption}> Extra Large</Text>}
                    </View>
                  </View>
                  <View style={styles.bottomSheetSelection}>
                        <View style={{ flexDirection:'row',alignItems:'flex-start' }}>
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <MaterialIcons name="format-list-numbered" size={16} color={colors.darkPurple} style={{ marginRight:2 }} />
                                <Text style={styles.bottomSheetTitle}>Number of spaces</Text>
                            </View>
                        </View>
                        <View style={{ flex:1,justifyContent:'flex-end' }}>
                          {numberOfSSA &&<Text style={styles.textOption}>{numberOfSSA} Small Space</Text>}
                          {numberOfMSA &&<Text style={styles.textOption}>{numberOfMSA} Medium Space</Text>}
                          {numberOfLSA && <Text style={styles.textOption}>{numberOfLSA} Large Space</Text>}
                          {numberOfXLSA &&<Text style={styles.textOption}>{numberOfXLSA} Extra Large Space</Text>}
                        </View>
                  </View>
                  <View style={styles.bottomSheetSelection}>
                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                            <Feather name="refresh-cw" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                            <Text style={styles.bottomSheetTitle}>Cleaning Interval</Text>
                        </View>
                          <View style={{ flex:1,justifyContent:'center' }}>
                            <Text style={styles.textOption}>{interval.weekly ? 'Weekly' : interval.monthly ? 'Monthly' : 'Weekly'}</Text>
                          </View>
                  </View>
                  <View style={styles.bottomSheetSelection}>
                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                            <Fontisto name="spinner-refresh" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                            <Text style={styles.bottomSheetTitle}>Cleaning Frequency</Text>
                        </View>
                          <View style={{ flex:1,justifyContent:'center' }}>
                            <Text style={styles.textOption}>{interval.weekly ? `${intervalFrequency.weekly} days Every Week` : interval.monthly ? intervalFrequency.monthly == 1 ? 'Once a month' : intervalFrequency.monthly == 2 ? 'Once Every 2 weeks': intervalFrequency.monthly == 3 ? 'Once a week for three weeks' : intervalFrequency.monthly == 4 ? 'Once Every week Per Month' : 'Error' : null}</Text>
                          </View>
                  </View>
                  <View style={styles.bottomSheetSelection}>
                        <View style={{ alignItems:'flex-start' }}>
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Ionicons name="today" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                                <Text style={styles.bottomSheetTitle}>Cleaning days</Text>
                            </View>
                        </View>
                        <View style={{ flex:1,justifyContent:'flex-end' }}>
                          {dayOfWeek.monday &&<Text style={styles.textOption}>Monday</Text>}
                          {dayOfWeek.tuesday &&<Text style={styles.textOption}>Tuesday</Text>}
                          {dayOfWeek.wednesday && <Text style={styles.textOption}>Wednesday</Text>}
                          {dayOfWeek.thursday &&<Text style={styles.textOption}>Thursday</Text>}
                          {dayOfWeek.friday &&<Text style={styles.textOption}>Friday</Text>}
                          {dayOfWeek.saturday &&<Text style={styles.textOption}>Saturday</Text>}
                          {dayOfWeek.sunday &&<Text style={styles.textOption}>Sunday</Text>}
                        </View>
                  </View>
                    <View style={styles.bottomSheetSelection}>
                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                            <Ionicons name="time-outline" size={16} color={colors.darkPurple} style={{ marginRight:3 }} />
                            <Text style={styles.bottomSheetTitle}>Time of Cleaning</Text>
                        </View>
                          <View style={{ flex:1,justifyContent:'center' }}>
                            <Text style={styles.textOption}>{timePeriod.six ? '6:00 am - 8:00 am' : timePeriod.eight ? '8:00 am - 10:00 am' : timePeriod.ten ? '10:00 am - 12:00 am' : timePeriod.twelvePM ? '12:00 pm - 2:00 pm' : timePeriod.twoPM ? '2:00 pm - 4:00 pm' : timePeriod.fourPM ? '4:00 pm - 6:00 pm' : '8:00 am - 10:00 am'}</Text>
                          </View>
                    </View>
                    <View style={styles.bottomSheetSelection}>
                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                            <MaterialIcons name="cleaning-services" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                            <Text style={styles.bottomSheetTitle}>Deep Cleaning</Text>
                        </View>
                          <View style={{ flex:1,justifyContent:'center' }}>
                            <Text style={styles.textOption}>{wantsDeepCleaning ? 'Accepted' : 'Denied'}</Text>
                          </View>
                    </View>
                    {
                        wantsDeepCleaning && frequencyOfDeepCleaning &&
                        <View style={styles.bottomSheetSelection}>
                            <Text style={styles.bottomSheetTitle}>Frequency of Deep Cleaning</Text>
                              <View style={{ flex:1,justifyContent:'center' }}>
                                <Text style={styles.textOption}>{frequencyOfDeepCleaning}x Every {interval.weekly ? 'Week' : interval.monthly ? 'Month' : 'Month'}</Text>
                              </View>
                        </View>
                    }
                    {totalAmount.weekly >= 3000 || totalAmount.monthly >= 3000 ?
                    <View style={styles.bottomSheetSelection}>
                        <View style={{ alignItems:'flex-start' }}>
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Feather name="gift" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                                <Text style={styles.bottomSheetTitle}>Bonus</Text>
                            </View>
                        </View>
                          <View style={{ flex:1,justifyContent:'center' }}>
                            {bonusOptions.lr && <Text style={styles.textOption}>Living Room</Text>}
                            {bonusOptions.DA && <Text style={styles.textOption}>Dining Area</Text>}
                            {bonusOptions.balcony && <Text style={styles.textOption}>Balcony</Text>}
                            {bonusOptions.bathroom && <Text style={styles.textOption}>Bathroom</Text>}
                            {bonusOptions.bedroom && <Text style={styles.textOption}>Bedroom</Text>}
                            {bonusOptions.closet && <Text style={styles.textOption}>Closet</Text>}
                            {bonusOptions.store && <Text style={styles.textOption}>Store</Text>}
                            {bonusOptions.kitchen && <Text style={styles.textOption}>Kitchen</Text>}
                            {bonusOptions.walkway && <Text style={styles.textOption}>WalkWay</Text>}
                            {!bonusOptions.walkway && !bonusOptions.lr && !bonusOptions.DA && !bonusOptions.balcony && !bonusOptions.bathroom && !bonusOptions.closet && !bonusOptions.kitchen && !bonusOptions.store && !bonusOptions.bedroom && <Text style={styles.textOption}>No Bonus Selected</Text>}
                          </View>
                    </View>
                    :
                    null
                    }
                    <View style={styles.bottomSheetSelection}>
                        <View style={{ alignItems:'flex-start' }}>
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <TouchableWithoutFeedback>
                                    <>
                                        <Ionicons name="location-outline" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                                        <Text style={styles.bottomSheetTitle}>Address</Text>
                                    </>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{ flex:1,justifyContent:'flex-end', maxWidth:'100%',flexDirection:'row' }}>
                          <Text numberOfLines={1} style={{...styles.textOption, width:'70%', paddingLeft:20 }}>No {street_number}, {street_name}, {LGA}, {estate != '' || !estate && estate + ','} {state}</Text>
                          <AntDesign name="edit" size={18} color={colors.green} />
                        </View>
                    </View>
                    <View style={{...styles.bottomSheetSelection, paddingBottom:100 }}>
                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                            <FontAwesome name="money" size={14} color={colors.darkPurple} style={{ marginRight:5 }} />
                            <Text style={styles.bottomSheetTitle}>Total Amount</Text>
                        </View>
                          <View style={{ flex:1,justifyContent:'center' }}>
                            <Text style={styles.textOption}>{currency.naira}{subscriptionInterval.weekly ? `${Number(totalAmount.weekly).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} every week` : `${Number(totalAmount.monthly).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} every month` }</Text>
                          </View>
                    </View>
                </bonusScrollView.ScrollView>
            </BottomSheet>
    </View> */}
    </>
  )
}

const styles = StyleSheet.create({
    container_one: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:10
    },
    container:{
        padding:20,
        flex:1,
    },
    option:{
        borderWidth:1.2,
        borderColor:'grey',
        padding:5,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:10,
        paddingHorizontal:20,
        opacity:0.7
    },
    btn:{
        backgroundColor:colors.purple,
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        padding:10,
        marginVertical:10
    },
    question: {
        fontFamily:'viga',
        margin:10
    },
    numOfSpace:{
        marginVertical:10
    },
    bottomSheetContainer: {
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    contentContainer: {
        padding:20,
        flex:1
    },
    bottomSheetSelection: {
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10
    },
    bottomSheetTitle: {
        fontFamily:'viga',
        fontSize:16
    },
    textOption: {
        letterSpacing:1,
        textAlign:'right'
    },
    lottie: {
        width: 100,
        height: 100
    },
})