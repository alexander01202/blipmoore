import { StyleSheet, Text, TouchableNativeFeedback, View,TouchableWithoutFeedback,ScrollView,TextInput,TouchableOpacity,Image,BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState,useRef,useMemo,useCallback, useEffect } from 'react'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image'
import { ipaddress } from '../../hostIPaddress';
import { Entypo,AntDesign } from '@expo/vector-icons';
import AnimatedLoader from 'react-native-animated-loader';
import CalendarPicker from 'react-native-calendar-picker';
import Progress from 'react-native-progress/Bar';
import { colors } from '../../colors/colors';
import moment from 'moment';
import { useSelector } from 'react-redux';
import PostPoneModal from '../../components/PostPoneModal';
import { AllKeys } from '../../keys/AllKeys';

export default function AfterPayment({ navigation,route }) {
    const { frequency,plan,amount,planId,custom,plan_name,plan_desc } = route.params
    const { id,displayName,email } = useSelector(state => state.login)
    const { state,country,street_name,street_number,city,estate } = useSelector(state => state.location)
    const [isPending, setIsPending] = useState(null)
    const [planName, setPlanName] = useState(plan_name ? plan_name :`${displayName} plan`)
    const [planDesc, setPlanDesc] = useState(plan_desc ? plan_desc : '')
    const [dayOfWeek, setDayOfWeek] = useState({ monday:false,tuesday:false,wednesday:false,thursday:false,friday:false,saturday:false,sunday:false })
    const [timePeriod, setTimePeriod] = useState({ six:false,eight:true,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })
    const [progressSteps,setProgressSteps] = useState({ one:true,two:false,three:false })
    const [showGoingBackModal,setShowGoingBackModal] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [progress, setProgress] = useState(0.35)
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%'], []);
    
    useEffect(() => {
        const back = BackHandler.addEventListener('hardwareBackPress', () => {
            if (!showGoingBackModal) {
                setShowGoingBackModal(true)
                return true
            }
        })
        return () => back.remove()
    }, [showGoingBackModal])
    
    const finishSetup = async(val) => {
        var selectedDate = moment(startDate).valueOf()
        var day_period = ''
        var time_period = ''
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
                    console.log(time_period,'if')
                    time_period = time_period + ',' + item[0] === 'six' ? '6am' : item[0] === 'eight' ? '8am' : item[0] === 'ten' ? '10am' : item[0] === 'twelvePM' ? '12pm' : item[0] === 'twoPM' ? '2pm' : item[0] === 'fourPM' ? '4pm' : item[0] === 'sixPM' ? '6pm' : null   
                }else{
                    console.log(time_period,'else')
                    time_period = item[0] === 'six' ? '6am' : item[0] === 'eight' ? '8am' : item[0] === 'ten' ? '10am' : item[0] === 'twelvePM' ? '12pm' : item[0] === 'twoPM' ? '2pm' : item[0] === 'fourPM' ? '4pm' : item[0] === 'sixPM' ? '6pm' : null
                }
                if (item[0] === 'eight') {
                    selectedDate = moment(startDate).startOf('day').add(8, 'hours').valueOf()
                }else if (item[0] === 'ten') {
                    selectedDate = moment(startDate).startOf('day').add(10, 'hours').valueOf()
                }else if (item[0] === 'twelvePM') {
                    selectedDate = moment(startDate).startOf('day').add(12, 'hours').valueOf()
                }else if (item[0] === 'twoPM') {
                    selectedDate = moment(startDate).startOf('day').add(14, 'hours').valueOf()
                }else if (item[0] === 'fourPM') {
                    selectedDate = moment(startDate).startOf('day').add(16, 'hours').valueOf()
                }else if (item[0] === 'sixPM') {
                    selectedDate = moment(startDate).startOf('day').add(18, 'hours').valueOf()
                }
            }
        })
        setIsPending(true)
        if (plan === 'free') {
            var deadline = moment().startOf('day').add(7, 'days').valueOf()
            var req = await fetch(`${ipaddress}/checkoutFreePlan?cleaner_pay=${2000}&supervisor_pay=${0}&deadline=${deadline}&state=${state}&country=${country}&supervisor=${0}&cleaner=${1}&places=1 bedroom&deepCleaning=false&cleaningIntervalFrequency=${1}&amount=${0}&email=${email}&customer_name=${displayName}&cleaningInterval=monthly&subInterval=monthly&customerId=${id}&time_period=${time_period}&day_period=${day_period}&date=${selectedDate}&special_treatment=''&bonus=''`)
            const { success,insertId } = await req.json()
            fetch(`${AllKeys.ipAddress}/insertPlanInfo?sub_id=${insertId}&name=${planName}&desc=${planDesc.length > 0 ? planDesc : val}`)
            console.log(insertId)
            setIsPending(false)
            navigation.navigate('ThankYouPage', { selectedDate,planId:insertId })
            return
        }else{
            fetch(`${ipaddress}/updateSubscriptionOrder?deepclean=${'true' }&id=${planId}&timePeriod=${time_period}&dayPeriod=${day_period}&date=${selectedDate}`)
            fetch(`${ipaddress}/sendEmailReciept?estate=${estate}&city=${city}&street_number=${street_number}&street_name=${street_name}&customer_name=${displayName}&email=${email}&planName=${planName}&deepclean=${'true' }&planId=${planId}&time_period=${time_period}&day_period=${day_period}&date=${selectedDate}`)
        }
        if (custom) {
            fetch(`${ipaddress}/updateCustomPlan?id=${id}&plan_name=${planName}&plan_desc=${planDesc}`)
        }
        fetch(`${AllKeys.ipAddress}/insertPlanInfo?sub_id=${planId}&name=${planName}&desc=${planDesc.length > 0 ? planDesc : val}`)
        setIsPending(false)
        navigation.navigate('ThankYouPage', { selectedDate,planId })
    }
    const updateDaysOfWeek = (day, disable) => {
        var count = 0;
        var blockCode = false;
        if (disable) {
            Object.entries(dayOfWeek).map(item => {
                if (item[1]) {
                    count++
                }if (count >= Number(frequency)) {
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
    const renderBackdrop = useCallback(
        props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        ),
        []
    );  
    const goBack = () => {
        navigation.pop()
    }
    const changeGoingBackModal = () => {
        setShowGoingBackModal(false)
    }
    const handleTextChange = (val) => {
        setPlanDesc(val)
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
    <SafeAreaView style={{ flex:1 }}>
    <PostPoneModal showPostponeModal={showGoingBackModal} date={null} changePostponeModal={changeGoingBackModal} acceptPostone={goBack} positive={"Yes, I want to go back"} negative={"No, I don't want to go back"} title={'We urge you not to close this page after payment, else your order would not be activated'} />
    <View style={{ flex:1 }}>
        <Progress progress={progress} width={null} borderWidth={0} color={colors.purple} />
        {
        progressSteps.one &&
        <View style={{ marginVertical:10,padding:10 }}>
        <View style={{ marginVertical:10 }}>
            <Text style={{ fontFamily:'viga',fontSize:25 }}>What day and time would you like your cleaning?</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => bottomSheetRef.current.expand()}>
            <View style={{ flexDirection:'row',alignItems:'center' }}>
                <Text style={{...styles.question, marginRight:5 }}>Pick { frequency } days for your cleaning?</Text>
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
        <>
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
            (dayOfWeek.monday || dayOfWeek.tuesday || dayOfWeek.wednesday || dayOfWeek.thursday || dayOfWeek.friday || dayOfWeek.saturday || dayOfWeek.sunday) && (timePeriod.six || timePeriod.eight || timePeriod.ten || timePeriod.twelvePM || timePeriod.twoPM || timePeriod.fourPM || timePeriod.sixPM) ?
        <TouchableNativeFeedback onPress={() => {
            setProgressSteps({ one:false,two:true,three:false })
            setProgress(custom ? 0.7 : 1)
        }}>
            <View style={{ backgroundColor:colors.purple,padding:8,marginVertical:20,borderRadius:5 }}>
                <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
            </View>
        </TouchableNativeFeedback>
        :
        <View style={{ backgroundColor:colors.lightPurple,padding:8,marginVertical:20,borderRadius:5 }}>
            <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
        </View>
        }
        </>   
        </View>
    }
    {
        progressSteps.two &&
        <View style={{ flex:1,padding:10 }}>
            <TouchableOpacity onPress={() => {
                setProgressSteps({ one:true,two:false,three:false })
                setProgress(custom ? 0.35 : 0.5)
            }}>
                <View>
                  <AntDesign name="arrowleft" size={24} color={colors.black} />
                </View>
            </TouchableOpacity>
            <View style={{ marginVertical:10 }}>
                <Text style={{ fontFamily:'viga',fontSize:25 }}>What day would you like your first service?</Text>
            </View>
            <CalendarPicker
                minDate={moment().startOf('day').add(7, 'days')}
                onDateChange={(date) => setStartDate(date)}
                selectedDayColor={colors.lightPurple}
                disabledDates={(date) => {
                    if (dayOfWeek.monday && (moment(date).format('ddd').toLowerCase() === 'mon')) {
                        return false
                    }else if (dayOfWeek.tuesday && (moment(date).format('ddd').toLowerCase() === 'tue')) {
                        return false
                    }else if (dayOfWeek.wednesday && (moment(date).format('ddd').toLowerCase() === 'wed')) {
                        return false
                    }else if (dayOfWeek.thursday && (moment(date).format('ddd').toLowerCase() === 'thu')) {
                        return false
                    }else if (dayOfWeek.friday && (moment(date).format('ddd').toLowerCase() === 'fri')) {
                        return false
                    }else if (dayOfWeek.saturday && (moment(date).format('ddd').toLowerCase() === 'sat')) {
                        return false
                    }else if (dayOfWeek.sunday && (moment(date).format('ddd').toLowerCase() === 'sun')) {
                        return false                        
                    }else{
                        return true
                    }
                }}
            />
            <View>
                <Text style={{ marginVertical:5,fontSize:12,fontFamily:'viga' }}>7 days taken for cleaning preparation</Text>
                <Text style={{ fontSize:12 }}>Based on your previous selection: Only <Text style={{ fontWeight:'bold' }}>{dayOfWeek.monday && 'mondays,'}{dayOfWeek.tuesday && 'tuesdays,'}{dayOfWeek.wednesday && 'wednesdays,'}{dayOfWeek.thursday && 'thursdays,'}{dayOfWeek.friday && 'fridays,'}{dayOfWeek.saturday && 'saturdays,'}{dayOfWeek.sunday && 'sundays,'}</Text></Text>
            </View>
            {
                !custom && startDate ?
                <TouchableNativeFeedback onPress={finishSetup}>
                    <View style={styles.button}>
                        <Text style={styles.btnText}>Finish</Text>
                    </View>
                </TouchableNativeFeedback>
                :
                !custom ?
                    <View style={{...styles.button, backgroundColor:colors.lightPurple}}>
                        <Text style={styles.btnText}>Finish</Text>
                    </View>
                :
                custom && startDate ?
                    <TouchableNativeFeedback onPress={() => {
                        setProgressSteps({ one:false,two:false,three:true })
                        setProgress(1)
                    }}>
                        <View style={styles.button}>
                            <Text style={styles.btnText}>Next</Text>
                        </View>
                    </TouchableNativeFeedback>
                :
                    <View style={{...styles.button, backgroundColor:colors.lightPurple}}>
                        <Text style={styles.btnText}>Next</Text>
                    </View>
            }
        </View>
    }
    {
        custom && progressSteps.three && 
        <View style={{ flex:1,padding:10 }}>
            <TouchableOpacity onPress={() => {
                setProgressSteps({ one:true,two:true,three:false })
                setProgress(0.7)
            }}>
                <View>
                  <AntDesign name="arrowleft" size={24} color={colors.black} />
                </View>
            </TouchableOpacity>
            <View style={{ marginVertical:10 }}>
                <Text style={{ fontFamily:'viga',fontSize:25 }}>Your own plan details?</Text>
            </View>
            <View style={{ marginVertical:10 }}>
                <View style={{ marginVertical:10 }}>
                    <Text style={{ fontFamily:'viga',fontSize:20 }}>Plan Name</Text>
                    <View style={{ borderColor:colors.purple,borderWidth:1,padding:5,marginTop:5,borderRadius:5,backgroundColor:colors.lightPurple }}>
                        <TextInput autoFocus={true} value={planName} placeholder={`eg. ${displayName} plan`} onChangeText={(val) => setPlanName(val)} />
                    </View>
                </View>
                <View style={{ marginVertical:10 }}>
                    <Text style={{ fontFamily:'viga',fontSize:20 }}>Plan Description</Text>
                    <View style={{ borderColor:colors.purple,borderWidth:1,padding:5,marginTop:5,height:100,borderRadius:5 }}>
                        <TextInput textAlignVertical='top' style={{ height:'100%' }} placeholder='Say something about yourself...' value={planDesc} onChangeText={(val) => handleTextChange(val)} />
                    </View>
                </View>
            </View>
        {
            startDate && planDesc ?
                <TouchableNativeFeedback onPress={finishSetup}>
                    <View style={styles.button}>
                        <Text style={styles.btnText}>Finish</Text>
                    </View>
                </TouchableNativeFeedback>
            :
                <View style={{...styles.button, backgroundColor:colors.lightPurple}}>
                    <Text style={styles.btnText}>Finish</Text>
                </View>
        }
        <View style={{ alignItems:'flex-end' }}>
            <TouchableOpacity onPress={() => finishSetup('No description Provided')}>
                <View style={{ alignSelf:'flex-end' }}>
                    <Text style={{ color:colors.purple }}>Skip</Text>
                </View>
            </TouchableOpacity>
        </View>
        </View>
    }
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            style={styles.bottomSheetContainer}
            backdropComponent={renderBackdrop}
        >
            <FastImage style={{ width:'100%',height:'50%' }} source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/cleaningFrequency.png'}} resizeMode={FastImage.resizeMode.contain} />
            <View style={{ padding:20,alignItems:'center',justifyContent:'center',marginVertical:20 }}>
                <Text style={{ fontSize:24,textAlign:'center',fontFamily:'Funzi',letterSpacing:1 }}>Cleaning Days</Text>
                <Text style={{ fontSize:18,textAlign:'center',letterSpacing:1 }}>This is the day your cleaning would take place.</Text>
            </View>
        </BottomSheet>
    </View>
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
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
    question: {
        fontFamily:'viga',
        margin:10
    },
    button:{
        backgroundColor:colors.purple,
        padding:8,
        marginVertical:10,
        borderRadius:5
    },
    btnText:{
        color:colors.white,
        textAlign:'center',
        fontFamily:'viga',
        fontSize:16
    },
    lottie:{
        width:100,
        height:100
    }
})