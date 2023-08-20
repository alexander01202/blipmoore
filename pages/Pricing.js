import { View, Text, StyleSheet, TouchableNativeFeedback, ScrollView, TouchableOpacity, InteractionManager,StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../colors/colors'
import { MaterialIcons,Feather,AntDesign,Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import * as Animatable from 'react-native-animatable';
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { ipaddress } from '../hostIPaddress';
import { useEffect, useState,useCallback,useMemo,useRef } from 'react';
import WebViewMainModal from './webView/WebView';
import { AllKeys } from '../keys/AllKeys';
import AnimatedLoader from 'react-native-animated-loader';
import moment from 'moment';
import { mixpanel } from '../components/MixPanel';
import TawkTo from './webView/TawkTo';

export default function Pricing({ navigation,route }) {
    const { displayName,id,email } = useSelector(state => state.login)
    const { state,country } = useSelector(state => state.location)
    const [hideStatusBar, setHideStatusBar] = useState(false)
    const [hasSubscribed, setHasSubscribed] = useState(true)
    const [ deepCleaning,setDeepCleaning ] = useState(false)
    const [weeklyFreq, setWeeklyFreq] = useState('')
    const [plan_name, setPlan_name] = useState(null)
    const [plan_desc, setPlan_desc] = useState(null)
    const [amount,setAmount] = useState(null)
    const [ isPending,setIsPending ] = useState(false)
    const [ mounting,setMounting ] = useState(true)
    const [customPlan, setCustomPlan] = useState(null)
    const [webViewModal, setWebViewModal] = useState({show:false, url: '',amount:''})
    const [showTawkModal, setShowTawkModal] = useState({ show:false, url:null })
    const [cleaningType, setCleaningType] = useState({ regular:true, deep:false })
    const isFocused = useIsFocused();
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%'], []);

    useEffect(() => {
        mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} pricing page visits`, 1);
        fetchCustomPlan()
        fetchHasSubscribed()
    }, [isFocused])
    
    useEffect(() => {
        InteractionManager.runAfterInteractions(async() => {
            await fetchCustomPlan()
            await fetchHasSubscribed()
            setMounting(false)
        })
    }, [])
    const fetchCustomPlan = async() => {
        const req = await fetch(`${AllKeys.ipAddress}/fetchCustomPlan?id=${id}`)
        const { success,row } = await req.json()

        if (success && (row.length > 0)) {
            setCustomPlan(row)   
        }
    }
    const fetchHasSubscribed = async() => {
        const req = await fetch(`${AllKeys.ipAddress}/hasSubscribed?id=${id}`)
        const { success } = await req.json()

        if (success) {
            setHasSubscribed(true)
        }else{
            setHasSubscribed(false)
        }
    }
    
    const checkOut = async(amount,code,frequency,option,interval) => {
        setIsPending(true)
        setWeeklyFreq(frequency)
        var places = ''
        var bonus = ''
        var special_treatment = ''
        var deadline = moment().startOf('day').add(7, 'days').valueOf()
        var day_period = ''
        var supervisor = 0
        var cleaner = 0
        var time_period = ''
        var cleaner_pay = ''
        var supervisor_pay = ''
        var discount = 0
        var database_plan_id = 16
        // Make the any of the plan to be atleast 1 cleaner and 1 supervisor, this is because cleaners are not yet trusted enough.
        // Also a supervisor cannot work alone without a cleaner to supervise.
        if (option == 1) {
            database_plan_id = 16
            places = '1 bedroom'
            discount = 0.1
            mixpanel.getPeople().set("Plan", "Basic");
            setPlan_name('basic')
            setPlan_desc("You are doubtful about our services. Yes we know (surprise!!!). You equally don't want to break a neck in order to test out what we offer. This is for you")
            mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} Basic plan`, 1);
            setAmount(amount)
            cleaner_pay = amount - (amount * 0.1)
            cleaner = 1
        }else if(option == 2){
            database_plan_id = 17
            places = '1 bedroom,1 toilet'
            discount = 0.1
            setPlan_name('standard')
            setPlan_desc("There's just something about going to bed and waking up in a clean and uncluttered environment. A clean bedroom brings you peace and comfort even on a bad day. This plan is for you.")
            setAmount(amount)
            cleaner = 1
            cleaner_pay = amount - (amount * 0.1)
            mixpanel.getPeople().set("Plan", "Standard");
            mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} Standard plan`, 1);
        }else if (option == 3) {
            database_plan_id = 18
            places = '1 bedroom,1 kitchen,1 toilet'
            discount = 0.1
            cleaner = 1
            cleaner_pay = amount - (amount * 0.1)
            setAmount(amount)
            setPlan_name('lite')
            setPlan_desc("Your toilet/bathroom means just as much to you as your bedroom. The toilet/bathroom is where you take care of yourself and hygiene. It only makes sense to keep it clean regularly.")
            mixpanel.getPeople().set("Plan", "Lite");
            mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} Lite plan`, 1);
        }else if (option == 4) {
            database_plan_id = 19
            places = '3 bedroom,1 kitchen,2 toilet/bathroom' 
            discount = 0.1  
            cleaner = 1
            cleaner_pay = amount - (amount * 0.1)
            setAmount(amount)
            setPlan_name('premium')
            setPlan_desc("Children isn't it? They can be tiresome atimes. The home can never be fully clean with children around. So Let's take some troubles off your hands. Don't stress anymore, we understand.")
            mixpanel.getPeople().set("Plan", "Premium");
            mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} Premium plan`, 1);
        }else if (option == 5) {
            database_plan_id = 20
            places = '4 bedroom,1 kitchen,3 toilet/bathroom'
            discount = 0.1
            cleaner = 1
            cleaner_pay = amount - (amount * 0.1)
            setAmount(amount)
            setPlan_name('luxury')
            setPlan_desc("Total freedom once and for all. You can now focus only on the most important things in your life. Many other things are more important than the burden of cleaning.")
            mixpanel.getPeople().set("Plan", "Luxury");
            mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} Luxury plan`, 1);
        }else{
            places = '1 bedroom'
        }
        const createPlan = await fetch(`${ipaddress}/subscribeToPlan?plan_id=${database_plan_id}&discount=${discount}&supervisor_pay=${supervisor_pay}&cleaner_pay=${cleaner_pay}&special_treatment=${special_treatment}&type=${cleaningType.deep ? 'deep' : 'regular'}&supervisor=${supervisor}&cleaner=${cleaner}&deadline=${deadline}&state=${state}&country=${country}&day_period=${day_period}&time_period=${time_period}&bonus=${bonus}&places=${places}&planCode=${code}&cleaningInterval=${interval}&cleaningIntervalFrequency=${frequency}&deepCleaning=${deepCleaning}&amount=${amount}&subInterval=monthly&email=${email}&customer_name=${displayName}&id=${id}`)
        const { success,url,sub_amount } = await createPlan.json()
        if (success) {
            setWebViewModal({ show:true, url,amount:sub_amount })
        }
        setIsPending(false)
    }
    const closeWebView = (val,planId,amt) => {
        setIsPending(true)
        setWebViewModal({ show:false, url:null })
        console.log(amt,'amt')
        if (val == 'subscribed') {
            mixpanel.getPeople().trackCharge(Number(amt));
            setIsPending(false)
            navigation.navigate('AfterPayment', { planId,frequency:weeklyFreq,plan:'paid',amount:amt,custom:false,plan_name,plan_desc })
        }else{
            setIsPending(false)
        }
    }
    const checkOutFreePlan = () => {
        mixpanel.getPeople().set("StarterPlan", "Free");
        setIsPending(true)
        navigation.navigate('AfterPayment', { frequency:'1',custom:false,planId:null,plan:'free',plan_name:'Free',plan_desc:"You are doubtful about our services. Yes we know (surprise!!!). You equally don't want to break a neck in order to see what we have to offer. This is for you",amount:0 })
    }
    const closeTawkModal = () => {
        setShowTawkModal({ show:false,url:null })
    }
    const openTawkModal = (url) => {
        setShowTawkModal({ show:true,url })
    }
    // renders
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
  return (
    <>
    {
        mounting ?
        <AnimatedLoader 
          visible={mounting}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        :
        <SafeAreaView style={{ flex:1 }}>
        <TawkTo closeTawkModal={closeTawkModal} showTawkModal={showTawkModal} />
        <StatusBar
            animated={true}
            backgroundColor={cleaningType.regular ? styles.container.backgroundColor : '#4C4A51'}
            hidden={hideStatusBar} 
        />
    <View style={cleaningType.regular ? styles.container : {...styles.container,backgroundColor:'#271E27'}}>
        <AnimatedLoader 
          visible={isPending}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
         <WebViewMainModal amount={webViewModal.amount} userid={id} closeWebView={closeWebView} webViewModal={webViewModal} />
    <ScrollView>
        <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:10 }}>
            <TouchableOpacity onPress={() => navigation.pop()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ marginVertical:10 }}>
                <TouchableNativeFeedback onPress={() => navigation.navigate('Subscription')}>
                    <View style={{ alignSelf:'flex-end' }}>
                        <Text style={{...styles.customizeLink, fontSize:14}}>Are you an enterprise?</Text>
                    </View>
                </TouchableNativeFeedback>
                {/* <TouchableOpacity onPress={() => openTawkModal('https://tawk.to/chat/636a8ef9b0d6371309cdfe8d/1ghc3t0hi')}>
                    <Text style={{...styles.customizeLink, fontSize:14}}>Need more info?</Text>
                </TouchableOpacity> */}
            </View>
        </View>
        {/* <TouchableNativeFeedback onPress={() => bottomSheetRef.current.expand()}>
            <View style={{ borderRadius:5,padding:5,flexDirection:'row',alignItems:'center', backgroundColor:"#FAF9F6",width:'50%',justifyContent:'space-around',elevation:3 }}>
                <Text style={{ fontFamily:'viga' }}>{cleaningType.regular ? 'Regular cleaning' : 'Deep Cleaning'}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </View>
        </TouchableNativeFeedback> */}
        <TouchableNativeFeedback onPress={() => openTawkModal('https://tawk.to/chat/636a8ef9b0d6371309cdfe8d/1ghc3t0hi')}>
            <View>
                <Text style={{ textAlign:'center',fontFamily:'Magison' }}>Click <Text style={{ color:'blue',textDecorationLine:'underline' }}>here</Text> if you need more information</Text>
            </View>
        </TouchableNativeFeedback>
        {
            customPlan && customPlan.map(info => (
                <View key={info.id} style={styles.selection}>
                <View style={styles.header}>
                    <View style={styles.planHeader}>
                        {
                            info.planName ?
                            <Text style={styles.planName}>{info.plan_name} plan</Text>
                            :
                            <Text style={styles.planName}>{displayName} plan</Text>
                        }
                    </View>
                    <Text style={{ color:'#696969' }}>{info.plan_desc.length > 0 ? info.plan_desc : 'No description Provided'}</Text>
                </View>
                <CollapsibleView 
                    style={{ padding:0,borderWidth:0 }}
                    collapsibleContainerStyle={{ width:'100%' }} 
                    arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
                    noArrow={true}
                    titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
                title={
                <View style={styles.section}>
                    <Text style={cleaningType.regular ? 
                        { fontWeight:'bold',color:colors.black } : 
                        { fontWeight:'bold',color:colors.white }}
                    >NGN {Number(info.amount).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} <Text style={{ color:'#696969',fontWeight:'normal' }}>/{info.sub_interval}</Text></Text>
                    <View style={styles.dets}>
                        <Text style={{ color:colors.purple }}>Details</Text>
                    </View>
                </View>
                }>
                <View style={styles.benefits}>
                    <View style={styles.benefit}>
                        <Ionicons name="person" size={14} color="black" />
                        <Text style={styles.benefitTxt}>Cleaner</Text>
                    </View>
                    {info.cleaning_frequency != 'null' &&
                    <View style={styles.benefit}>
                        <Feather name="check" size={14} color={colors.purple} />
                        <Text style={styles.benefitTxt}>{info.cleaning_frequency}<Text style={{ fontSize:10,fontWeight:'bold' }}>x</Text> {info.cleaning_interval}</Text>
                    </View>
                    }
                    {
                        info.places.split(',').map(place => (
                            <View key={place} style={styles.benefit}>
                                <Feather name="check" size={14} color={colors.purple} />
                                <Text style={styles.benefitTxt}>{place}</Text>
                            </View>
                        ))
                    }
                </View>
                <View style={styles.line} />
                <Text style={{ fontStyle:'italic',color:'#696969',marginVertical:5 }}>No Bonus included</Text>
                </CollapsibleView>
                <TouchableNativeFeedback onPress={() => navigation.navigate('HomeSubscription', { info })}>
                    <View style={styles.button}>
                        <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>{info.plan_desc.length > 0 ? 'Select/Change Plan' : 'Finish setup'}</Text>
                    </View>
                </TouchableNativeFeedback>
              </View>
            ))
        }
         {/* Plan Free */}
        {
        !hasSubscribed &&
      <View style={styles.selection}>
        <View style={styles.header}>
            <View style={styles.planHeader}>
                <Text style={styles.planName}>FREE</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HomeSubscription')}>
                    <Text style={styles.customizeLink}>Make your own {displayName} plan?</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ color:'#696969' }}>
                You are doubtful about our services. Yes we know (surprise!!!). You equally don't want to break a neck in order to see what we have to offer. This is for you
            </Text>
        </View>
        <CollapsibleView 
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
        title={
        <View style={styles.section}>
            <Text style={{ fontWeight:'bold',color:colors.black }}>NGN 0<Text style={{ color:'#696969',fontWeight:'normal' }}>/month</Text></Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            <View style={styles.benefit}>
                <Ionicons name="person" size={14} color="black" />
                <Text style={styles.benefitTxt}>Cleaner</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>Just Once</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>1 Bedroom</Text>
            </View>
        </View>
        <View style={styles.line} />
        <Text style={{ fontStyle:'italic',color:'#696969',marginVertical:5 }}>No Bonus included</Text>
        </CollapsibleView>
        <TouchableNativeFeedback onPress={checkOutFreePlan}>
            <Animatable.View animation={'pulse'} iterationCount="infinite" style={styles.button}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Select plan</Text>
            </Animatable.View>
        </TouchableNativeFeedback>
      </View>
    }
      
        {/* Plan One */}
      <View style={styles.selection}>
        <View style={styles.header}>
            <View style={styles.planHeader}>
                <Text style={styles.planName}>Basic</Text>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('HomeSubscription')}>
                        <Text style={styles.customizeLink}>Make your own {displayName} plan?</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ color:'#696969' }}>There's just something about going to bed and waking up in a clean and uncluttered environment. A clean bedroom brings you peace and comfort even on a bad day. This plan is for you.</Text>
        </View>
        <CollapsibleView 
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
        title={
        <View style={styles.section}>
            <Text style={{ fontWeight:'bold',color:colors.black }}
            >NGN 25,749<Text style={{ color:'#696969',fontWeight:'normal' }}>/month</Text></Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            <View style={styles.benefit}>
                <Ionicons name="person" size={14} color="black" />
                <Text style={styles.benefitTxt}>Cleaner</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>once per week</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>1 Bedroom</Text>
            </View>
        </View>
        <View style={styles.line} />
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>1 Deep cleaning / week</Text>
        </View>
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>5 days money-back guarantee</Text>
        </View>
        </CollapsibleView>
        <TouchableNativeFeedback onPress={() => checkOut(25749,'PLN_2cn9srasqulhqld','1',1,'weekly')}>
            <View style={styles.button}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Select plan</Text>
            </View>
        </TouchableNativeFeedback>
      </View>

      {/* Plan Two */}
      <View style={styles.selection}>
        <View style={styles.header}>
            <View style={styles.planHeader}>
                <Text style={styles.planName}>Standard</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HomeSubscription')}>
                    <Text style={styles.customizeLink}>Make your own {displayName} plan?</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ color:'#696969' }}>Your toilet/bathroom means just as much to you as your bedroom. The toilet/bathroom is where you take care of yourself and hygiene. It only makes sense to keep it clean regularly.</Text>
        </View>
        <CollapsibleView 
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
        title={
        <View style={styles.section}>
            <Text style={
                cleaningType.regular ? 
                { fontWeight:'bold',color:colors.black } : 
                { fontWeight:'bold',color:colors.white }}
            >NGN 35,099 <Text style={{ color:'#696969',fontWeight:'normal' }}>/month</Text></Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            <View style={styles.benefit}>
                <Ionicons name="person" size={14} color="black" />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>Cleaner</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>once every week</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>1 Bedroom</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>1 Toilet/bathroom</Text>
            </View>
        </View>
        <View style={styles.line} />
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>1 Deep cleaning / week</Text>
        </View>
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>5 days money-back guarantee</Text>
        </View>
        </CollapsibleView>
        <TouchableNativeFeedback onPress={() => checkOut(35099,'PLN_wj0m7dbmwlgljfy','1',2,'weekly')}>
            <View style={styles.button}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Select plan</Text>
            </View>
        </TouchableNativeFeedback>
      </View>

      {/* Plan Three */}
      <View style={styles.selection}>
        <View style={styles.header}>
            <View style={styles.planHeader}>
                <Text style={styles.planName}>Lite</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HomeSubscription')}>
                    <Text style={styles.customizeLink}>Make your own {displayName} plan?</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ color:'#696969' }}>The kitchen is such a pain in the ass. It never stays clean and it's equally the most important area in the home. You can't prepare a good nice meal in a dirty kitchen. Don't bother anymore. We got you covered.</Text>
        </View>
        <CollapsibleView
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
        title={
        <View style={styles.section}>
            <Text style={{ fontWeight:'bold',color:colors.black }}
            >NGN 52,649<Text style={{ color:'#696969',fontWeight:'normal' }}>/month</Text></Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            <View style={styles.benefit}>
                <Ionicons name="person" size={14} color="black" />
                <Text style={styles.benefitTxt}>Cleaners</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>once every week</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>1 Bedroom</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>1 Kitchen</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>1 Toilet/bathroom</Text>
            </View>
        </View>
        <View style={styles.line} />
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>1 Deep Cleaning / week</Text>
        </View>
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>5 days money-back guarantee</Text>
        </View>
        </CollapsibleView>
        <TouchableNativeFeedback onPress={() => checkOut(52649,'PLN_62hxau847b5vprd', '1',3,'weekly')}>
            <View style={styles.button}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Select plan</Text>
            </View>
        </TouchableNativeFeedback>
      </View>

      {/* Plan Four */}
      <View style={styles.selection}>
        <View style={styles.header}>
            <View style={styles.planHeader}>
                <Text style={styles.planName}>Premium</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HomeSubscription')}>
                    <Text style={styles.customizeLink}>Make your own {displayName} plan?</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ color:'#696969' }}>Children isn't it? They can be tiresome atimes. The home can never be fully clean with children around. So Let's take some troubles off your hands. Don't stress anymore, we understand.</Text>
        </View>
        <CollapsibleView 
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
        title={
        <View style={styles.section}>
            <Text style={cleaningType.regular ? 
                { fontWeight:'bold',color:colors.black } : 
                { fontWeight:'bold',color:colors.white }}
            >NGN 91,349<Text style={{ color:'#696969',fontWeight:'normal' }}>/month</Text></Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            <View style={styles.benefit}>
                <Ionicons name="person" size={14} color="black" />
                <Text style={styles.benefitTxt}>Cleaners</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>once every week</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>3 Bedrooms</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>1 Kitchen</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={styles.benefitTxt}>2 Toilet/bathrooms</Text>
            </View>
        </View>
        <View style={styles.line} />
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Deep Cleaning / Week</Text>
        </View>
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>5 days money-back guarantee</Text>
        </View>
        </CollapsibleView>
        <TouchableNativeFeedback onPress={() => checkOut(91349,'PLN_l1t7y97z67xbfpr','1',4,'weekly')}>
            <View style={styles.button}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Select plan</Text>
            </View>
        </TouchableNativeFeedback>
      </View>

      {/* Plan Four */}
      <View style={styles.selection}>
        <View style={styles.header}>
            <View style={styles.planHeader}>
                <Text style={styles.planName}>Luxury</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HomeSubscription')}>
                    <Text style={styles.customizeLink}>Make your own {displayName} plan?</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ color:'#696969' }}>Total freedom once and for all. You can now focus only on the most important things in your life. Many other things are more important than the burden of cleaning.</Text>
        </View>
        <CollapsibleView 
            style={{ padding:0,borderWidth:0 }}
            collapsibleContainerStyle={{ width:'100%' }} 
            arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
            noArrow={true}
            titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
        title={
        <View style={styles.section}>
            <Text style={{ fontWeight:'bold',color:colors.black }}
            >NGN 134,999 <Text style={{ color:'#696969',fontWeight:'normal' }}>/month</Text></Text>
            <View style={styles.dets}>
                <Text style={{ color:colors.purple }}>Details</Text>
            </View>
        </View>
        }>
        <View style={styles.benefits}>
            <View style={styles.benefit}>
                <Ionicons name="person" size={14} color="black" />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>Cleaners</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>once every week</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>4 Bedroom</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>1 Kitchen</Text>
            </View>
            <View style={styles.benefit}>
                <Feather name="check" size={14} color={colors.purple} />
                <Text style={cleaningType.regular ? styles.benefitTxt : {...styles.benefitTxt,color:'rgba(225,225,225,0.8)'}}>3 Toilet/bathroom</Text>
            </View>
        </View>
        <View style={styles.line} />
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt, ...styles.bonusText}}>1 Deep Cleaning / week</Text>
        </View>
        <View style={styles.benefit}>
            <AntDesign name="pluscircleo" size={14} color={'green'} />
            <Text style={{...styles.benefitTxt,...styles.bonusText}}>5 days money-back guarantee</Text>
        </View>
        </CollapsibleView>
        <TouchableNativeFeedback onPress={() => checkOut(134999,'PLN_9u8rhp6wplgyqmy','1',5,'weekly')}>
            <View style={styles.button}>
                <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>Select plan</Text>
            </View>
        </TouchableNativeFeedback>
      </View>
      </ScrollView>
    </View>
    </SafeAreaView>
    }
    <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        style={styles.bottomSheetContainer}
        backdropComponent={renderBackdrop}
    >
        <TouchableNativeFeedback onPress={() => {
            setCleaningType({ regular:true,deep:false })
            bottomSheetRef.current.close()
        }}>
            <View style={{...styles.benefit, justifyContent:'space-between',padding:10}}>
                <Text style={cleaningType.regular ? {fontFamily:'viga'} : { opacity:0.6 }}>Regular Cleaning</Text>
                {
                    cleaningType.regular &&
                    <Feather name="check" size={24} color={colors.purple} />
                }
            </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => {
            setCleaningType({ regular:false,deep:true })
            bottomSheetRef.current.close()
        }}>
            <View style={{...styles.benefit, justifyContent:'space-between',padding:10}}>
                <Text style={cleaningType.deep ? {fontFamily:'viga'} : { opacity:0.6 }}>Deep Cleaning</Text>
                {
                    cleaningType.deep &&
                    <Feather name="check" size={24} color={colors.purple} />
                }
            </View>
        </TouchableNativeFeedback>
    </BottomSheet>
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
    customizeLink:{
        color:'blue',
        textDecorationLine:'underline',
        fontSize:12
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
    dets:{
        // backgroundColor:colors.purple,
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        paddingHorizontal:15,
        // borderRadius:5,
        flexDirection:'row'
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
    bottomSheetContainer: {
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        padding:15
    },
})