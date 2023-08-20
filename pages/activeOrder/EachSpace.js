import { StyleSheet, Text, View,TouchableNativeFeedback, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Progress from 'react-native-progress/Bar';
import { colors } from '../../colors/colors';
import { Feather,MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import moment from 'moment';
import { AllKeys } from '../../keys/AllKeys';

export default function EachSpace({ navigation,route }) {
    const { letters,number,subActiveOrder } = route.params
    const [isPending, setIsPending] = useState(true)
    const [arr,setArr] = useState([])
    const [progress, setProgress] = useState({ one:0,two:0,three:0,four:0,five:0,six:0,seven:0,eight:0,nine:0,ten:0,eleven:0,twelve:0,thirteen:0,fourteen:0,fifteen:0 })
    const [cleanerName, setCleanerName] = useState({ one:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',eleven:'',twelve:'',thirteen:'' })
    const [btn, setBtn] = useState({ one:false,two:false,three:false,four:false,five:false,six:false,seven:false,eight:false,nine:false,ten:false,eleven:false,twelve:false,thirteen:false })
    const [cleanerId, setCleanerId] = useState({ one:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',eleven:'',twelve:'',thirteen:'' })
    const [refetchJobStatus, setRefetchJobStatus] = useState(false)
    useEffect(() => {
        for (let i = 1; i < Number(number) + 1; i++) {
            setArr(prevEvent => {
                return [...prevEvent, i]
            })
        }  
    }, [])
    useEffect(() => {
        const fetchCompletedJobs = async() => {
            var time = moment().valueOf()
            var startOfDaytime = moment().startOf('day').valueOf()
            const req = await fetch(`${AllKeys.ipAddress}/fetchActiveCompletedJobs?startOfDaytime=${startOfDaytime}&time=${time}&letters=${letters}&sub_id=${subActiveOrder.id}`)
            const { success,rows } = await req.json()
            if (success) {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].place_number == 1) {
                        setBtn(preEvent => {
                            return {...preEvent, two:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, one:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, one:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, one: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 2) {
                        setBtn(preEvent => {
                            return {...preEvent, two:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, two:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, two:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, two: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 3) {
                        setBtn(preEvent => {
                            return {...preEvent, three:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, three:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, three:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, three: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 4) {
                        setBtn(preEvent => {
                            return {...preEvent, four:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, four:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, four:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, four: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 5) {
                        setBtn(preEvent => {
                            return {...preEvent, five:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, five:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, five:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, five: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 6) {
                        setBtn(preEvent => {
                            return {...preEvent, six:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, six:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, six:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, six: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 7) {
                        setBtn(preEvent => {
                            return {...preEvent, seven:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, seven:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, seven:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, seven: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 8) {
                        setBtn(preEvent => {
                            return {...preEvent, eight:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, eight:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, eight:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, eight: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 9) {
                        setBtn(preEvent => {
                            return {...preEvent, nine:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, nine:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, nine:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, nine: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 10) {
                        setBtn(preEvent => {
                            return {...preEvent, ten:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, ten:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, ten:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, ten: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 11) {
                        setBtn(preEvent => {
                            return {...preEvent, eleven:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, eleven:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, eleven:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, eleven: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 12) {
                        setBtn(preEvent => {
                            return {...preEvent, twelve:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, twelve:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, twelve:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, twelve: Number(rows[i].progress_bar)}
                        })
                    }
                }
            }
            if (isPending) {
                setIsPending(false)   
            }
        }
        fetchCompletedJobs()
    }, [refetchJobStatus])
    const navigateToTask = (num) => {
        if (num === 1) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.one,cleanerId:cleanerId.one})   
        }else if (num === 2) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.two,cleanerId:cleanerId.two})   
        }else if (num === 3) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.three,cleanerId:cleanerId.three})   
        }else if (num === 4) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.four,cleanerId:cleanerId.four})   
        }else if (num === 5) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.five,cleanerId:cleanerId.five})   
        }else if (num === 6) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.six,cleanerId:cleanerId.six})   
        }else if (num === 7) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.seven,cleanerId:cleanerId.seven})   
        }else if (num === 8) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.eight,cleanerId:cleanerId.eight})   
        }else if (num === 9) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.nine,cleanerId:cleanerId.nine})   
        }else if (num === 10) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.ten,cleanerId:cleanerId.ten})   
        }else if (num === 11) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.eleven,cleanerId:cleanerId.eleven})   
        }else if (num === 12) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.twelve,cleanerId:cleanerId.twelve})   
        }
    }
  return (
    <SafeAreaView style={styles.container}>
        {
            isPending ?
            <AnimatedLoader 
              visible={isPending}
              source={require('../../lottie/circle2.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
            :
            <ScrollView>
            {
            arr.length > 0 && arr.map(num => (
                <View style={styles.placeContainer} key={num}>
                    <TouchableNativeFeedback onPress={() => navigateToTask(num)}>
                    <View>
                        <View style={styles.place}>
                            <Text style={{ fontWeight:'bold',letterSpacing:1 }}>{num} {letters}</Text>
                            {
                                num == 1 && btn.one === 'done' 
                                ?
                                <View style={{ flexDirection:'row' }}>
                                    <Text>completed By {cleanerName.one}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View>
                                : 
                                num == 2 && btn.two === 'done' ? 
                                 <View style={{ flexDirection:'row' }}>
                                    <Text>completed By {cleanerName.two}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                : 
                                num == 3 && btn.three === 'done' ? 
                                 <View style={{ flexDirection:'row' }}>
                                    <Text>completed By {cleanerName.three}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 4 && btn.four === 'done' ? 
                                 <View style={{ flexDirection:'row' }}>
                                    <Text>completed By {cleanerName.four}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 5 && btn.five === 'done' ? 
                                 <View style={{ flexDirection:'row' }}>
                                    <Text>completed By {cleanerName.five}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 6 && btn.six === 'done' ? 
                                 <View style={{ flexDirection:'row' }}>
                                    <Text>completed By {cleanerName.six}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 7 && btn.seven === 'done' ? 
                                <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.seven}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 8 && btn.eight === 'done' ? 
                                <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.eight}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View>
                                :
                                num == 9 && btn.nine === 'done' ? 
                                <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.nine}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 10 && btn.ten === 'done' ? 
                                <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.ten}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View>
                                :
                                 num == 11 && btn.eleven === 'done' ? 
                                 <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.eleven}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View> 
                                :
                                num == 12 && btn.twelve === 'done' ? 
                                 <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.twelve}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View>
                                :
                                num == 13 && btn.thirteen === 'done' ? 
                                 <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>completed By {cleanerName.thirteen}</Text> 
                                    <Feather name="check-circle" size={24} color={'green'}/> 
                                </View>
                                :
                                <View style={{ flexDirection:'row',alignItems:'center' }}>
                                    <Text>Awaiting completion</Text> 
                                    <Feather name="check-circle" size={24} color={'grey'}/> 
                                </View>
                            }
                        </View>
                        <View style={{ width:'100%',alignItems:'center',flexDirection:'row',justifyContent:'flex-end' }}>
                            <Text style={{ fontSize:12 }}>View Task</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </View>
                    </TouchableNativeFeedback>
                    <View style={{ marginVertical:10 }}>
                      <Progress color={colors.purple} progress={
                         num == 1 ?
                         progress.one 
                        : 
                        num == 2 ?
                         progress.two 
                        : 
                        num == 3 ? 
                        progress.three
                        :
                        num == 4 ?
                        progress.four
                        :
                        num == 5 ?
                        progress.five 
                        :
                        num == 6 ?
                        progress.six
                        :
                        num == 7 ?
                        progress.seven
                        :
                        num == 8 ?
                        progress.eight 
                        :
                        num == 9 ?
                        progress.nine
                        : 
                        num == 10 ?
                        progress.ten
                        : 
                        num == 11 ?
                        progress.eleven
                        :
                        num === 12 ?
                        progress.twelve
                        :
                        num == 13 ?
                        progress.thirteen 
                        :
                        null
                      } width={null} borderWidth={1} />
                    </View>
                </View>
            ))
            }
            </ScrollView>
        }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    placeContainer:{
        backgroundColor:'#dcdcdc',
        marginVertical:10,
        padding:10,
        borderRadius:5
    },
    place:{
        padding:5,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    lottie:{
        height:100,
        width:100
    }
})