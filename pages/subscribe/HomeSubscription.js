import { Text, StyleSheet, View, ScrollView, TouchableWithoutFeedback,InteractionManager, TouchableOpacity,Dimensions, Image, Modal,TouchableNativeFeedback, TextInput } from 'react-native'
import { WebView } from 'react-native-webview';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { colors } from '../../colors/colors'
import SelectDropdown from 'react-native-select-dropdown'
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image'
import * as Location from 'expo-location'
import { AntDesign,Zocial,Entypo,MaterialIcons,Feather,Fontisto,Ionicons,FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
// import DiscountModal from './DiscountModal';
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import * as bonusScrollView from 'react-native-gesture-handler'
import { ipaddress } from '../../hostIPaddress';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
import WebViewMainModal from '../webView/WebView';
import { currency } from '../../currency/currency'
import moment from 'moment';
import { mixpanel } from '../../components/MixPanel';
import { showMessage } from 'react-native-flash-message';
import AddressModal from '../component/AddressModal';

export default function HomeSubscription({ navigation,route }) {
    const { displayName, email, id } = useSelector(state => state.login)
    const { state, street_number,street_name,estate,LGA,country } = useSelector(state => state.location)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [pageIsLoading, setPageIsLoading] = useState(true)
    const [isPending, setIsPending] = useState(false)
    const [planName, setPlanName] = useState(`${displayName} plan`)
    const [planDesc, setPlanDesc] = useState('')
    const [spaceOption, setSpaceOption] = useState({ bedroom:true,kitchen:false,store:false,balcony:false,closet:false,walkway:false,bathroom:false })
    const numberOfSpaces = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','16','17','18','19','20']
    const weeklyInterval = ['1','2','3','4','5','6','7']
    // I removed 3 from monthlyInterval because it's difficult/complex calculating how and when the next cleaning is due
    const monthlyInterval = ['1','2','4']
    const [progressSteps,setProgressSteps] = useState({ one:true,two:false,three:false,four:false,five:false })
    const [progress, setProgress] = useState(0.2)
    const [numberOfBedroom, setNumberOfBedroom] = useState(null)
    const [numberOfBathroom, setNumberOfBathroom] = useState(null)
    const [numberOfBalcony, setNumberOfBalcony] = useState(null)
    const [numberOfCloset, setNumberOfCloset] = useState(null)
    const [numberOfKitchen, setNumberOfKitchen] = useState(null)
    const [numberOfStore, setNumberOfStore] = useState(null)
    const [numberOfWalkway, setNumberOfWalkway] = useState(null)
    const [numOfSupervisors, setNumOfSupervisors] = useState(0)
    const [numOfCleaners, setNumOfCleaners] = useState(1)
    const [cleanerPay,setCleanerPay] = useState(null)
    const [supervisorPay,setSupervisorPay] = useState(null)
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
    const [subscriptionInterval, setSubscriptionInterval] = useState({ weekly:false,monthly:true,threeMonths:false })
    const [bonus,setBonus] = useState({ weekly:0,monthly:0,threeMonths:0 })
    const [bonusOptions, setBonusOptions] = useState({ lr:false,kitchen:false,store:false,bedroom:false,DA:false,balcony:false,bathroom:false,closet:false,walkway:false })
    const [extra,setExtra] = useState({ family:false,special:false })
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
        mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} custom plan`, 1);
        InteractionManager.runAfterInteractions(() => {
            // 2: Component is done animating
            // 3: Start fetching the team / or render the view
           // this.props.dispatchTeamFetchStart();
        //    info is gotten from custom plan btn click on pricing page
           if (route.params) {
            const { info } = route.params
            const { setup_step,sub_interval,cleaning_interval } = info
            if (sub_interval === 'weekly') {
                setSubscriptionInterval({ weekly:true,monthly:false,threeMonths:false })
                setTotalAmount(prevEvents => {
                    return {...prevEvents, weekly:info.amount}
                })
            }else{
                setSubscriptionInterval({ weekly:false,monthly:true,threeMonths:false })
                setTotalAmount(prevEvents => {
                    return {...prevEvents, monthly:info.amount}
                })
            }
            if (cleaning_interval === 'monthly') {
                setInterval({ monthly:true,weekly:false })
                setIntervalFrequency({ weekly:null,monthly:info.cleaning_frequency == 'null' ? null : info.cleaning_frequency })
            }else{
                setInterval({ monthly:false,weekly:true })
                setIntervalFrequency({ weekly:info.cleaning_frequency == 'null' ? null : info.cleaning_frequency,monthly:null })
            }
                if(info.time_period.length > 0){
                    if (info.time_period === '6am') {
                        setTimePeriod({ six:true,eight:false,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })
                    }if (info.time_period === '8am') {
                        setTimePeriod({ six:false,eight:true,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })
                    }if (info.time_period === '10am') {
                        setTimePeriod({ six:false,eight:false,ten:true,twelvePM:false,twoPM:false,fourPM:false,sixPM:false })
                    }if (info.time_period === '12pm') {
                        setTimePeriod({ six:false,eight:false,ten:false,twelvePM:true,twoPM:false,fourPM:false,sixPM:false })
                    }if (info.time_period === '2pm') {
                        setTimePeriod({ six:false,eight:false,ten:false,twelvePM:false,twoPM:true,fourPM:false,sixPM:false })
                    }if (info.time_period === '4pm') {
                        setTimePeriod({ six:false,eight:false,ten:false,twelvePM:false,twoPM:false,fourPM:true,sixPM:false })
                    }if (info.time_period === '6pm') {
                        setTimePeriod({ six:false,eight:false,ten:false,twelvePM:false,twoPM:false,fourPM:true,sixPM:true })
                    }
                }
                if(info.cleaning_days.length > 0){
                    info.cleaning_days.split(',').map(day => {
                        if (day.includes('monday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, monday:true}
                            })
                        }if (day.includes('tuesday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, tuesday:true}
                            })
                        }if (day.includes('wednesday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, wednesday:true}
                            })
                        }if (day.includes('thursday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, thursday:true}
                            })
                        }if (day.includes('friday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, friday:true}
                            })
                        }if (day.includes('saturday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, saturday:true}
                            })
                        }if (day.includes('sunday')) {
                            setDayOfWeek(prevEvents => {
                                return {...prevEvents, sunday:true}
                            })
                        }
                    })
                }
                info.places.split(',').map(place => {
                    if (place.includes('bedroom')) { 
                        setNumberOfBedroom(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, bedroom:true}
                        })
                    }if (place.includes('closet')) {
                        setNumberOfCloset(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, closet:true}
                        })
                    }if (place.includes('balcony')) {
                        setNumberOfBalcony(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, balcony:true}
                        })
                    }if (place.includes('bathroom')) {
                        setNumberOfBathroom(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, bathroom:true}
                        })
                    }if (place.includes('store')) {
                        setNumberOfStore(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, store:true}
                        })
                    }if (place.includes('kitchen')) {
                        setNumberOfKitchen(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, kitchen:true}
                        })
                    }if (place.includes('walkway')) {
                        setNumberOfWalkway(Number(place.replace(/[^0-9]/g, '')))
                        setSpaceOption(prevEvents => {
                            return {...prevEvents, walkway:true}
                        })
                    }
                })
                if (setup_step === 'two') {
                    setProgressSteps(prevEvents => {
                        return {...prevEvents,one:false,two:true }
                    })   
                    setProgress(0.4)
                }else if (setup_step === 'three') {
                    setProgressSteps(prevEvents => {
                        return {...prevEvents,two:false,three:true,one:false  }
                    })   
                    setProgress(0.6)
                }else if (setup_step === 'four') {
                    setProgress(progress + 0.8)
                    setProgressSteps(prevEvents => {
                        return {...prevEvents,three:false,four:true,one:false  }
                    })   
                }else if (setup_step === 'five') {
                    setProgress(1)
                    setProgressSteps(prevEvents => {
                        return {...prevEvents,four:false,five:true,one:false  }
                    })   
                }
                setPageIsLoading(false)
           }else{
            setPageIsLoading(false)
           }
        });
    }, [])
    
useEffect(() => {
    var bedroom = 1000
    var bedroom_deep_clean = 2500
    var closet = 500
    var closet_deep_clean = 1000
    var toilet = 2000
    var toilet_deep_clean = 3500
    var balcony = 700
    var balcony_deep_clean = 1200
    var walkway = 500
    var walkway_deep_clean = 1000
    var kitchen = 1500
    var kitchen_deep_clean = 3000
    var store = 500
    var store_deep_clean = 1800

  var amountOfBedroom = numberOfBedroom * bedroom
  var amountOfToilet = numberOfBathroom * toilet
  var amountOfCloset = numberOfCloset * closet
  var amountOfBalcony = numberOfBalcony * balcony
  var amountOfWalkway = numberOfWalkway * walkway
  var amountOfKitchen = numberOfKitchen * kitchen
  var amountOfStore = numberOfStore * store

  var amount_of_bedroom_deep_clean = numberOfBedroom * bedroom_deep_clean
  var amount_of_bathroom_deep_clean = numberOfBathroom * toilet_deep_clean
  var amount_of_closet_deep_clean = numberOfCloset * closet_deep_clean
  var amount_of_balcony_deep_clean = numberOfBalcony * balcony_deep_clean
  var amount_of_walkway_deep_clean = numberOfWalkway * walkway_deep_clean
  var amount_of_store_deep_clean = numberOfStore * store_deep_clean
  var amount_of_kitchen_deep_clean = numberOfKitchen * kitchen_deep_clean

    var concludeAmount = (amountOfBedroom + amountOfToilet + amountOfCloset + amountOfBalcony + amountOfKitchen + amountOfWalkway + amountOfStore)
    var amount_deep_clean = (amount_of_kitchen_deep_clean + amount_of_bedroom_deep_clean + amount_of_bathroom_deep_clean + amount_of_closet_deep_clean + amount_of_balcony_deep_clean + amount_of_walkway_deep_clean + amount_of_store_deep_clean)
    if (subscriptionInterval.monthly && interval.monthly) {
        console.log((concludeAmount * (Number(intervalFrequency.monthly) - 1)) + amount_deep_clean)
        setTotalAmount(prevEvents => {
            return {...prevEvents, weekly:null, monthly:(concludeAmount * (Number(intervalFrequency.monthly) - 1)) + amount_deep_clean }
        })
        // -1 because the deep clean is for one day in the week
    }else if(subscriptionInterval.monthly && interval.weekly){
        var monthlyAmt = (concludeAmount * ((Number(intervalFrequency.weekly) * 4) - 1)) + amount_deep_clean
        setTotalAmount(prevEvents => {
            return {...prevEvents, weekly:(concludeAmount * (intervalFrequency.monthly - 1)) + amount_deep_clean, monthly:monthlyAmt }
        })
    }
  
}, [subscriptionInterval.monthly,subscriptionInterval.weekly,subscriptionInterval.threeMonths,intervalFrequency.monthly,intervalFrequency.weekly,interval.weekly,interval.monthly,numberOfBedroom,numberOfBathroom,numberOfCloset,numberOfBalcony,numberOfKitchen,numberOfStore,numberOfWalkway])

// Used to calculate the cleaner and supervisor pay
useEffect(() => {
    var totalPayforSupervisor = 0
    if (subscriptionInterval.monthly) {
        var tenPercentCut = Math.floor((totalAmount.monthly / 100) * 10)
        var remaining = totalAmount.monthly - tenPercentCut
        if (Number(numOfSupervisors) > 0) {
            var equalPay = remaining / ( Number(numOfCleaners) + Number(numOfSupervisors))
            var twentyPercentOfEqualPay = equalPay * 0.2
            var supervisor_pay = equalPay + twentyPercentOfEqualPay
            totalPayforSupervisor = supervisor_pay * numOfSupervisors   
        }
        var remainingMoney = remaining - totalPayforSupervisor
        var cleaner_pay = remainingMoney / numOfCleaners
        setCleanerPay(cleaner_pay)
        setSupervisorPay(supervisor_pay)
    }else if (subscriptionInterval.weekly) {
        var tenPercentCut = Math.floor(((totalAmount.weekly * 4) / 100) * 10)
        var remaining = (totalAmount.weekly * 4) - tenPercentCut
        var equalPay = remaining / ( Number(numOfCleaners) + Number(numOfSupervisors))
        var twentyPercentOfEqualPay = (equalPay / 100) * 20
        var supervisor_pay = equalPay + twentyPercentOfEqualPay
        var totalPayforSupervisor = supervisor_pay * numOfSupervisors
        var remainingMoney = remaining - totalPayforSupervisor
        var cleaner_pay = remainingMoney / numOfCleaners
        setCleanerPay(cleaner_pay)
        setSupervisorPay(supervisor_pay)
    }

}, [totalAmount.monthly, totalAmount.weekly,totalAmount.threeMonths,numOfCleaners,numOfSupervisors,subscriptionInterval.monthly,subscriptionInterval.weekly,subscriptionInterval.threeMonths])

// Used to calculate the number of supervisors 
useEffect(() => {
    var totalAmount = numberOfBedroom + numberOfBathroom + numberOfBalcony + numberOfCloset + numberOfWalkway + numberOfKitchen + numberOfStore
    if (totalAmount > 7) {
        var num_of_supervisors = Math.ceil(numOfCleaners / 4)
        var num_of_cleaners = Math.floor((totalAmount * 2) / 8)
        if (num_of_supervisors > numOfSupervisors) {
            setNumOfSupervisors(num_of_supervisors)
        }
        if (num_of_cleaners > numOfCleaners) {
            setNumOfCleaners(num_of_cleaners)
        }
    }

}, [numberOfBedroom,numberOfBathroom,numberOfBalcony,numberOfCloset,numberOfWalkway,numberOfKitchen,numberOfStore])


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
    if (totalAmount.weekly >= 7000 || totalAmount.monthly >= 7000 ) {
        var weeklyBonus = Math.floor(totalAmount.weekly / 7000)
        var monthlyBonus = Math.floor(totalAmount.monthly / 7000)
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
    if (space === 'bedroom') {
        if (spaceOption.bedroom) {
            setNumberOfBedroom(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, bedroom:!spaceOption.bedroom}
        })
    }else if (space === 'closet') {
        if (spaceOption.closet) {
            setNumberOfCloset(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, closet:!spaceOption.closet}
        })
    }else if (space === 'balcony') {
        if (spaceOption.balcony) {
            setNumberOfBalcony(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, balcony:!spaceOption.balcony}
        })
    }else if (space === 'bathroom') {
        if (spaceOption.bathroom) {
            setNumberOfBathroom(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, bathroom:!spaceOption.bathroom}
        })
    }else if (space === 'store') {
        if (spaceOption.store) {
            setNumberOfStore(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, store:!spaceOption.store}
        })
    }else if (space === 'kitchen') {
        if (spaceOption.kitchen) {
            setNumberOfKitchen(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, kitchen:!spaceOption.kitchen}
        })
    }else if (space === 'walkway') {
        if (spaceOption.walkway) {
            setNumberOfWalkway(null)
        }
        setSpaceOption(prevEvents => {
            return {...prevEvents, walkway:!spaceOption.walkway}
        })
    }
}
const updateNumberOfSpaces = (selectedItem, typeOfSpace) => {
    if (typeOfSpace === 'bathroom') {
        setNumberOfBathroom(Number(selectedItem))
        return
    }if (typeOfSpace === 'balcony') {
        setNumberOfBalcony(Number(selectedItem))
        return
    }if (typeOfSpace === 'closet') {
        setNumberOfCloset(Number(selectedItem))
        return
    }if (typeOfSpace === 'bedroom') {
        setNumberOfBedroom(Number(selectedItem))
        return
    }if (typeOfSpace === 'store') {
        setNumberOfStore(Number(selectedItem))
        return
    }if (typeOfSpace === 'kitchen') {
        setNumberOfKitchen(Number(selectedItem))
        return
    }if (typeOfSpace === 'walkway') {
        setNumberOfWalkway(Number(selectedItem))
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
    if ((!blockCode && !bonusOptions.family && !bonusOptions.special) || (selectedBonus === 'special' || selectedBonus === 'family')) {
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
        if (selectedBonus === 'family') {
            if ((subscriptionInterval.weekly && totalAmount.weekly > 30000) || (subscriptionInterval.monthly && totalAmount.monthly > 30000)) {
                setBonusOptions(prevEvents => {
                    return {...prevEvents,walkway:false,closet:false,bathroom:false,balcony:false,bedroom:false,kitchen:false,DA:false,lr:false,store:false}
                })
                setExtra({ special:false,family:!extra.family })
            }else{
                showMessage({
                    type:'warning',
                    message: "Error",
                    description: "Must spend atleast 30,000",
                })
            }
        }
        if (selectedBonus === 'special') {
            if ((subscriptionInterval.weekly && totalAmount.weekly > 80000) || (subscriptionInterval.monthly && totalAmount.monthly > 80000)) {
                setBonusOptions(prevEvents => {
                    return {...prevEvents, special: !bonusOptions.special,walkway:false,closet:false,bathroom:false,balcony:false,bedroom:false,kitchen:false,DA:false,lr:false,family:false,store:false}
                })
                setExtra({ special:!extra.special,family:false })
            }else{
                showMessage({
                    type:'warning',
                    message: "Error",
                    description: "Must spend atleast 80,000",
                })
            }
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
    if (Number(totalAmount.monthly) < 5000) {
        showMessage({
            type:'danger',
            message:'Cmon, add some more stuff..',
            description:'We cant do small jobs for our customers. You deserve more.'
        })
        return
    }
    if (!interval.weekly && !interval.monthly) {
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
    var special_treatment = ''
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
                time_period = time_period + ',' + item[0] === 'eight' ? '8am' : item[0] === 'ten' ? '10am' : item[0] === 'twelvePM' ? '12pm' : item[0] === 'twoPM' ? '2pm' : item[0] === 'fourPM' ? '4pm' : item[0] === 'sixPM' ? '6pm' : null   
            }else{
                time_period = item[0] === 'eight' ? '8am' : item[0] === 'ten' ? '10am' : item[0] === 'twelvePM' ? '12pm' : item[0] === 'twoPM' ? '2pm' : item[0] === 'fourPM' ? '4pm' : item[0] === 'sixPM' ? '6pm' : null
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
    if (extra.family) {
        special_treatment = 'family treatment'
    }else if (extra.special) {
        special_treatment = `${displayName} special treatment`
    }
    const createPlan = await fetch(`${ipaddress}/createPlan?special_treatment=${special_treatment}&cleaner=${numOfCleaners}&supervisor=${numOfSupervisors}&email=${email}&deepCleaning=${wantsDeepCleaning}&time_period=${time_period}&day_period=${day_period}&cleaningInterval=${interval.weekly ? 'weekly' : 'monthly' }&cleaningIntervalFrequency=${interval.weekly ? intervalFrequency.weekly :intervalFrequency.monthly }&bedroom=${numberOfBedroom}&closet=${numberOfCloset}&bathroom=${numberOfBathroom}&balcony=${numberOfBalcony}&bonus=${bonus_options}&name=blipmoore${interval.monthly ? `monthly${totalAmount.monthly}` : `weekly${totalAmount.weekly}`}&amount=${interval.monthly ? `${totalAmount.monthly}` : subscriptionInterval.weekly ? `${totalAmount.weekly}` : subscriptionInterval.monthly ? `${totalAmount.monthly}` : null }&subInterval=${subscriptionInterval.weekly ? 'weekly' : subscriptionInterval.monthly ? 'monthly' : 'monthly' }&email=${email}&customer_name=${displayName}&customerId=${id}`)
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
        mixpanel.getPeople().set("Plan", "custom");
        mixpanel.getPeople().trackCharge(totalAmount.monthly);
        setIsPending(false)
        navigation.navigate('ThankYouPage', { frequency:interval.monthly ? intervalFrequency.monthly : intervalFrequency.weekly,plan:'paid',amount:totalAmount.monthly,custom:true })
    }else{
        setIsPending(false)
    }
}
const goBack = () => {
    setProgress(progress - 0.2)
    if (progress <= 0.2) {
        navigation.pop()   
    }else if (progressSteps.two) {
        setProgressSteps(prevEvents => {
            return {...prevEvents,one:true,two:false  }
        }) 
    }else if (progressSteps.three) {
        setProgressSteps(prevEvents => {
            return {...prevEvents,two:true,three:false  }
        }) 
    }else if (progressSteps.four) {
        setProgressSteps(prevEvents => {
            return {...prevEvents,four:false,three:true  }
        }) 
    }else if (progressSteps.five) {
        setProgressSteps(prevEvents => {
            return {...prevEvents,five:false,four:true  }
        }) 
    }else{
        navigation.pop()
    }
}
const nextChoice = (step) => {
    setProgress(progress + 0.2)
    if (step === 'two') {
        setProgressSteps(prevEvents => {
            return {...prevEvents,one:false,two:true  }
        })   
    }else if (step === 'three') {
        setProgressSteps(prevEvents => {
            return {...prevEvents,two:false,three:true  }
        })   
    }else if (step === 'four') {
        setProgressSteps(prevEvents => {
            return {...prevEvents,three:false,four:true  }
        })   
    }else if (step === 'five') {
        setProgressSteps(prevEvents => {
            return {...prevEvents,four:false,five:true  }
        })   
    }
    var places = ''
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
                time_period = time_period + ',' + item[0] === 'eight' ? '8am' : item[0] === 'ten' ? '10am' : item[0] === 'twelvePM' ? '12pm' : item[0] === 'twoPM' ? '2pm' : item[0] === 'fourPM' ? '4pm' : item[0] === 'sixPM' ? '6pm' : null
            }else{
                time_period = item[0] === 'eight' ? '8am' : item[0] === 'ten' ? '10am' : item[0] === 'twelvePM' ? '12pm' : item[0] === 'twoPM' ? '2pm' : item[0] === 'fourPM' ? '4pm' : item[0] === 'sixPM' ? '6pm' : null
            }
        }
    })
    console.log(step)
    fetch(`${ipaddress}/updateCustomPlan?step=${step}&plan_name=${planName}&desc=${planDesc}&time_period=${time_period}&days=${day_period}&places=${places.slice(0, -1)}&amount=${subscriptionInterval.weekly ? totalAmount.weekly : totalAmount.monthly}&subInterval=${subscriptionInterval.weekly ? 'weekly' : subscriptionInterval.monthly ? 'monthly' : 'monthly' }&id=${id}&cleaningInterval=${interval.monthly ? 'monthly' : 'weekly'}&cleaningFrequency=${intervalFrequency.weekly ? intervalFrequency.weekly : intervalFrequency.monthly}`)
}
const refuseBonus = async() => {
    setIsPending(true)
    var places = ''
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
    const createPlan = await fetch(`${ipaddress}/createPlan?cleaner=${numOfCleaners}&supervisor=${numOfSupervisors}&places=${places}&name=blipmoore${interval.monthly ? `monthly${totalAmount.monthly}` : `weekly${totalAmount.weekly}`}&amount=${interval.monthly ? `${totalAmount.monthly}` : subscriptionInterval.weekly ? `${totalAmount.weekly}` : subscriptionInterval.monthly ? `${totalAmount.monthly}` : null }&interval=${subscriptionInterval.weekly ? 'weekly' : subscriptionInterval.monthly ? 'monthly' : 'monthly' }&email=${email}&customer_name=${displayName}&customerId=${id}`)
    const { success,url } = await createPlan.json()
    if (success) {
        setWebViewModal({ show:true, url })
    }
    setIsPending(false)
}
const changeAddressModal = () => {
    setShowAddressModal(false)
}
const changeAddress = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showMessage({
        type:'danger',
        message:'Error',
        description:'Please allow location to change address'
      })
      return;
    }else{
        setShowAddressModal(true)
    }
}
if (pageIsLoading) {
    return (
        <AnimatedLoader 
          visible={pageIsLoading}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
    )
}else{
return (
    <>
    <AnimatedLoader 
      visible={isPending}
      overlayColor="rgba(255,255,255,0.75)"
      source={require('../../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    <Modal
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
    <AddressModal changeAddressModal={changeAddressModal} showAddressModal={showAddressModal} />
    <WebViewMainModal amount={subscriptionInterval.weekly ? totalAmount.weekly : totalAmount.monthly } userid={id} closeWebView={closeWebView} webViewModal={webViewModal} />
    {/* <DiscountModal updateDiscountCode={updateDiscountCode} changeDiscountModal={changeDiscountModal} showDiscountModal={showDiscountModal} /> */}
    <Progress.Bar progress={progress} color={colors.purple} width={null} borderWidth={0} borderRadius={10} />
    <View style={styles.container}>
    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
        <TouchableOpacity onPress={goBack}>
            <View>
              <AntDesign name="arrowleft" size={24} color={colors.black} />
            </View>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Subscription')}>
            <View>
                <Text style={{ color:'blue',textDecorationLine:'underline',fontWeight:'bold' }}>Are you an enterprise?</Text>
            </View>
        </TouchableWithoutFeedback>
    </View>
        {
            progressSteps.one && !progressSteps.two && !progressSteps.three &&
            <>
        <View style={{ marginVertical:10 }}>
        <Text style={styles.question}>Name Of the Space/Area?</Text>
            <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
                <TouchableWithoutFeedback onPress={() => updateSpace('bedroom')}>
                    <View style={spaceOption.bedroom ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.bedroom ? {fontWeight:'bold'} : null}>Bedroom</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('bathroom')}>
                    <View style={spaceOption.bathroom ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.bathroom ? {fontWeight:'bold'} : null}>Bathroom</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('closet')}>
                    <View style={spaceOption.closet ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.closet ? {fontWeight:'bold'} : null}>Closet</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('balcony')}>
                    <View style={spaceOption.balcony ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.balcony ? {fontWeight:'bold'} : null}>Balcony</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('store')}>
                    <View style={spaceOption.store ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.store ? {fontWeight:'bold'} : null}>Store</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('walkway')}>
                    <View style={spaceOption.walkway ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.walkway ? {fontWeight:'bold'} : null}>Walkway</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateSpace('kitchen')}>
                    <View style={spaceOption.kitchen ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={spaceOption.kitchen ? {fontWeight:'bold'} : null}>Kitchen</Text>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </View>
        <ScrollView>
        {
            spaceOption.bedroom
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many bedrooms?</Text>
                <SelectDropdown defaultValue={numberOfBedroom} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'bedroom') }} />
            </View>
        }
        {
            spaceOption.balcony
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many balconies?</Text>
                <SelectDropdown defaultValue={numberOfBalcony} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'balcony') }} />
            </View>
        }
        {
            spaceOption.bathroom
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many bathrooms?</Text>
                <SelectDropdown defaultValue={numberOfBathroom} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'bathroom') }} />
            </View>
        }
        {
            spaceOption.closet
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Closets?</Text>
                <SelectDropdown defaultValue={numberOfCloset} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'closet') }} />
            </View>
        }
        {
            spaceOption.store
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Stores?</Text>
                <SelectDropdown defaultValue={numberOfStore} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'store') }} />
            </View>
        }
        {
            spaceOption.kitchen
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Kitchens?</Text>
                <SelectDropdown defaultValue={numberOfKitchen} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'kitchen') }} />
            </View>
        }
        {
            spaceOption.walkway
            &&
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Walkways?</Text>
                <SelectDropdown defaultValue={numberOfWalkway} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfSpaces} onSelect={(selectedItem, index) => { updateNumberOfSpaces(selectedItem, 'walkway') }} />
            </View>
        }
        {
            numberOfBedroom || numberOfBalcony || numberOfBathroom || numberOfCloset ?
            <TouchableNativeFeedback onPress={() => nextChoice('two')}>
                <View style={{ backgroundColor:colors.purple,padding:8,marginBottom:100 }}>
                    <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Let's Go!!!</Text>
                </View>
            </TouchableNativeFeedback>
        :
            <View style={{ backgroundColor:colors.lightPurple,padding:8,marginBottom:100 }}>
                <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Let's Go!!!</Text>
            </View>
        }
        </ScrollView>
        </>
        }
          {
            progressSteps.two &&
            <> 
        {
            numberOfBedroom || numberOfBalcony || numberOfBathroom || numberOfCloset ?
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
                {
                     (numberOfBalcony || numberOfCloset || numberOfBathroom || numberOfBedroom) && (interval.weekly || interval.monthly)  ?
                    <TouchableNativeFeedback onPress={() => nextChoice('three')}>
                        <View style={{ backgroundColor:colors.purple,padding:8,marginBottom:100 }}>
                            <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
                        </View>
                    </TouchableNativeFeedback>
                :
                    <View style={{ backgroundColor:colors.lightPurple,padding:8,marginBottom:100 }}>
                        <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
                    </View>
                }
            </>   
            :
            null
        }
        </>
        }
        {
            progressSteps.three &&
            <>
        {
            (numberOfBalcony || numberOfCloset || numberOfBathroom || numberOfBedroom) && interval.weekly ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times Per Week?</Text>
                <SelectDropdown ref={selectDropdownWeekly} defaultValue={intervalFrequency.weekly} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={weeklyInterval} onSelect={(selectedItem, index) => { setIntervalFrequency({weekly:selectedItem, monthly:null}) }} />
            </View>
            :
           ( numberOfBalcony || numberOfCloset || numberOfBathroom || numberOfBedroom) && interval.monthly?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times Per Month?</Text>
                <SelectDropdown ref={selectDropdownMonthly} defaultValue={intervalFrequency.monthly} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={monthlyInterval} onSelect={(selectedItem, index) => { setIntervalFrequency({monthly:selectedItem, weekly:null}) }} />
            </View>
            :
            null
        }
        {
            (intervalFrequency.weekly && interval.weekly) || (intervalFrequency.monthly && interval.monthly)  ?
            <TouchableNativeFeedback onPress={() => nextChoice('four')}>
                <View style={{ backgroundColor:colors.purple,padding:8,marginBottom:100 }}>
                    <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
                </View>
            </TouchableNativeFeedback>
        :
            <View style={{ backgroundColor:colors.lightPurple,padding:8,marginBottom:100 }}>
                <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
            </View>
        }
        </>
        }
        {
            progressSteps.four &&
            <>
        {
            (totalAmount.weekly || totalAmount.monthly || totalAmount.threeMonths) ?
            <View style={{ marginVertical:10 }}>
                    <TouchableWithoutFeedback onPress={() => subscriptionBottomSheetRef.current.snapToIndex(1)}>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <Text style={{...styles.question, marginRight:5}}>How often would you like to be charged?</Text>
                        <Entypo name="info-with-circle" size={14} color="black" />
                    </View>
                    </TouchableWithoutFeedback>
                <ScrollView horizontal={true}>
                    <TouchableWithoutFeedback onPress={() => setSubscriptionInterval({ weekly:false,monthly:true,threeMonths:false })}>
                        <View style={subscriptionInterval.monthly ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={subscriptionInterval.monthly ? {fontWeight:'bold'} : null}>Monthly</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setSubscriptionInterval({ weekly:false,monthly:true,threeMonths:false })}>
                        <View style={subscriptionInterval.threeMonths ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={subscriptionInterval.threeMonths ? {fontWeight:'bold'} : null}>Quarterly</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>  
            :
            null
        }
        {
            subscriptionInterval.monthly || subscriptionInterval.threeMonths ?
            <TouchableNativeFeedback onPress={() => nextChoice('five')}>
                <View style={{ backgroundColor:colors.purple,padding:8,marginBottom:100 }}>
                    <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
                </View>
            </TouchableNativeFeedback>
        :
            <View style={{ backgroundColor:colors.lightPurple,padding:8,marginBottom:100 }}>
                <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>Next</Text>
            </View>
        }
        </>
        }
         {
            progressSteps.five &&
            <>
        {/* {
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
        } */}
        {/* {
            (numberOfCloset || numberOfBathroom || numberOfBedroom || numberOfBalcony) && interval.weekly && wantsDeepCleaning?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times do you require deep Cleaning Per Week?</Text>
                <SelectDropdown defaultValue={frequencyOfDeepCleaning} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={arrayForDeepCleaningFrequency} onSelect={(selectedItem, index) => { setFrequencyOfDeepCleaning(selectedItem) }} />
            </View>
            : (numberOfCloset || numberOfBalcony || numberOfBedroom || numberOfBalcony) && interval.monthly && wantsDeepCleaning ?
            <View style={styles.numOfSpace}>
                <Text style={styles.question}>How many Times do you require deep Cleaning Per Month?</Text>
                <SelectDropdown defaultValue={frequencyOfDeepCleaning} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={arrayForDeepCleaningFrequency} onSelect={(selectedItem, index) => { setFrequencyOfDeepCleaning(selectedItem) }} />
            </View>
            :
            null
        } */}
        <View style={{ flex:1,height:'100%' }}>
            {/* <View style={{ height:'50%' }}>
                <Image source={require('../../assets/bondage.png')} resizeMode='contain' style={{ width:'100%',height:'70%' }} />
                <View>
                    <Text style={{ color:'rgba(0,0,0,0.6)',fontSize:30,fontFamily:'viga',textAlign:'center' }}>You're about to break free!!!</Text>
                </View>
            </View> */}
            <View style={{ flexDirection:'row',marginVertical:20,justifyContent:'space-between',alignItems:'center' }}>
                <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black }}>Promo Code</Text>
                <TouchableWithoutFeedback onPress={() => setShowDiscountModal(true)}>
                    <View style={{ flexDirection:'row' }}>
                        <AntDesign name="edit" size={18} color={colors.green} />
                        <Text style={{ color:colors.green,textDecorationLine:'underline',textTransform:'uppercase' }}>{discountCode ? discountCode :'ENTER CODE'}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {/* <View style={{ flexDirection:'row',marginVertical:5,justifyContent:'space-between',alignItems:'center' }}>
                <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black }}>BONUS 🎉🎉</Text>
                <TouchableWithoutFeedback onPress={() => bonusBottomSheetRef.current.snapToIndex(1)}>
                    <View style={{ flexDirection:'row' }}>
                        <Text style={{ color:colors.green,textDecorationLine:'underline' }}>Pick {interval.weekly ? bonus.weekly : bonus.monthly} spaces of any size</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View> */}
            <View style={{ flexDirection:'row',marginVertical:5,justifyContent:'space-between',alignItems:'center' }}>
                <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black }}>Address</Text>
                <TouchableWithoutFeedback onPress={changeAddress}>
                    <View style={{ width:'60%' }}>
                        <Text style={{ textDecorationLine:'underline' }} numberOfLines={1}>{street_number}, {street_name}, {state}, {country}</Text>
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
                        Number(totalAmount.monthly).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
                    }
                    </Text>
                </View>
            </View>
        {
           subscriptionInterval.monthly || subscriptionInterval.weekly || subscriptionInterval.threeMonths
            ?
            <TouchableNativeFeedback onPress={() => 
                navigation.navigate('Summary', { frequency:interval.weekly ? intervalFrequency.weekly : intervalFrequency.monthly,numOfCleaners,numOfSupervisors,interval,spaceOption,numberOfBalcony,numberOfBathroom,numberOfBedroom,numberOfCloset,numberOfKitchen,numberOfStore,numberOfWalkway,bonusOptions,cleanerPay,supervisorPay,subInterval:subscriptionInterval,amount:interval.monthly ? `${totalAmount.monthly}` : subscriptionInterval.weekly ? `${totalAmount.weekly}` : subscriptionInterval.monthly ? `${totalAmount.monthly}` : null })
            }>
                <View style={{ backgroundColor:colors.purple,padding:8,marginBottom:100 }}>
                    <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>View Summary</Text>
                </View>
            </TouchableNativeFeedback>
            :
            <View style={{ backgroundColor:colors.lightPurple,padding:8,marginBottom:100 }}>
                <Text style={{ color:colors.white,textAlign:'center',fontFamily:'viga',fontSize:16 }}>View Summary</Text>
            </View>
        }
        </View>
        </>
        }
        <BottomSheet
            ref={bonusBottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            style={{...styles.bottomSheetContainer, padding:5}}
            backdropComponent={renderBonusBackdrop}
        >
            <Text style={{...styles.question, textAlign:'center',fontSize:18}}>Select {interval.weekly ? bonus.weekly : bonus.monthly} Bonus</Text>
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
                <View>
                    <TouchableWithoutFeedback onPress={() => updateBonus('special', !bonusOptions.special)}>
                        <View style={extra.special ? {...styles.option, borderColor:colors.purple, borderWidth:2, width:'100%',marginVertical:5} : {...styles.option, width:'100%',marginVertical:5}}>
                            <Text style={extra.special ? {fontWeight:'bold'} : null}>{displayName} special treatment</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => updateBonus('family', !bonusOptions.family)}>
                        <View style={extra.family ? {...styles.option, borderColor:colors.purple, borderWidth:2, width:'100%',marginVertical:5} : {...styles.option, width:'100%',marginVertical:5}}>
                            <Text style={extra.family ? {fontWeight:'bold'} : null}>Family Special treatment</Text>
                        </View>
                    </TouchableWithoutFeedback>
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
                <FastImage style={{ width:'100%',height:'40%' }}  source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/changeInterval.png'}} resizeMode={FastImage.resizeMode.contain} />
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
                        <Text style={styles.bottomSheetTitle}>Choosen spaces</Text>
                    </View>
                    <View>
                        {spaceOption.bedroom && <Text style={styles.textOption}>Bedroom</Text>}
                        {spaceOption.balcony && <Text style={styles.textOption}>Balcony</Text>}
                        {spaceOption.bathroom && <Text style={styles.textOption}>Bathroom</Text>}
                        {spaceOption.closet && <Text style={styles.textOption}>Closet</Text>}
                        {spaceOption.kitchen && <Text style={styles.textOption}>Kitchen</Text>}
                        {spaceOption.store && <Text style={styles.textOption}>Store</Text>}
                        {spaceOption.walkway && <Text style={styles.textOption}>Walkway</Text>}
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
                          {numberOfBedroom &&<Text style={styles.textOption}>{numberOfBedroom} Bedroom</Text>}
                          {numberOfBathroom &&<Text style={styles.textOption}>{numberOfBathroom} Bathroom</Text>}
                          {numberOfBalcony && <Text style={styles.textOption}>{numberOfBalcony} Balcony</Text>}
                          {numberOfCloset &&<Text style={styles.textOption}>{numberOfCloset} Closet</Text>}
                          {numberOfKitchen &&<Text style={styles.textOption}>{numberOfKitchen} Kitchen</Text>}
                          {numberOfStore &&<Text style={styles.textOption}>{numberOfStore} Store</Text>}
                          {numberOfWalkway &&<Text style={styles.textOption}>{numberOfWalkway} Walkway</Text>}
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
                            {bonusOptions.special && <Text style={styles.textOption}>{displayName} Special treatment</Text>}
                            {bonusOptions.family && <Text style={styles.textOption}>Family treatment</Text>}
                            {!bonusOptions.special && !bonusOptions.family && !bonusOptions.walkway && !bonusOptions.lr && !bonusOptions.DA && !bonusOptions.balcony && !bonusOptions.bathroom && !bonusOptions.closet && !bonusOptions.kitchen && !bonusOptions.store && !bonusOptions.bedroom && <Text style={styles.textOption}>No Bonus Selected</Text>}
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
    </View>
    </>
  )
}
}

const styles = StyleSheet.create({
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