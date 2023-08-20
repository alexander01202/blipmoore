import React, { useEffect } from 'react'
import { Text, View,StyleSheet,TextInput,ActivityIndicator, TouchableWithoutFeedback,Modal, Button, ScrollView, TouchableOpacity,Dimensions  } from 'react-native'
import { colors } from '../colors/colors'
import { Entypo } from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';
// import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { useState } from 'react';
import MyModal from '../components/modal';
import { useSelector } from 'react-redux';
export default function HireCleanerPage({ route,navigation }) {
    const [numberOfSSA, setSSA] = useState(0)
    const [numberOfMSA, setMSA] = useState(0)
    const [numberOfLSA, setLSA] = useState(0)
    const [numberOfELSA, setELSA] = useState(0)
    const [multiSelect,setMultiSelect] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [showModal,setShowModal] = useState(false)
    const [numberPerWeek,setNumberPerWeek] = useState({regularClean:1,deepClean:0})
    const [maximumTimes,setMaximumTimes] = useState([])
    const [numberOfTimesRegularCleaning,setNumberOfTimesRegularCleaning] = useState(1)
    const [numberOfTimesDeepCleaning,setNumberOfTimesDeepCleaning] = useState(0)
    const [resetTimesPerWeek,setResetTimesPerWeek] = useState(false)
    const [cleanerInfo,setCleanerInfo] = useState(null)
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const [review,setReview] = useState('')
    const [starReview,setStarReview] = useState(0)
    const { id,displayName } = useSelector(state => state.login)

    const { acceptedCleanerId,cleanerRating,cleanerFirstname } = route.params
    const { width,height } = Dimensions.get('window')
    const [rooms,setRooms] = useState({
        selectedItems: []
    })
    const star = []
    for (let i = 0; i < 5; i++) {
        star.push(i)
    }
    const [typeOfClean,setTypeOfClean] = useState({
        type:'regular',
        explanation:'Regular cleaning involves only Cleaning of floor and surroundings. This involves only sweeping and mopping.'
    })
    const [amount,setAmount]= useState({
        ssa:0,
        msa:0,
        lsa:0,
        elsa:0,
        deepCleaning:0
    })
    const RoomType = [{
        id: '1',
        name: '(SSA)Small Sized Area/Room/Kitchen...etc'
      }, {
        id: '2',
        name: '(MSA)Meduim Sized Area/Room/Kitchen...etc'
      }, {
        id: '3',
        name: '(LSA)Large Sized Area/Room/Kitchen...etc'
      }, {
        id: '4',
        name: '(ELSA)Extra large Area/Room/Kitchen...etc'
      }
    ];
    useEffect(() => {
        let maxTime = []
        let allNumberOfWeek = numberPerWeek.deepClean + numberPerWeek.regularClean
        for (let i = 0; i <= allNumberOfWeek; i++) {
            maxTime.push(i)
        }
        // setNumberOfTimesRegularCleaning(maxTime[maxTime.length - 1])
        // setNumberOfTimesDeepCleaning(0)
        setNumberPerWeek({ regularClean:maxTime[maxTime.length - 1],deepClean:0 })
        setMaximumTimes(maxTime)
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                deepCleaning:0
            }
        })
    }, [resetTimesPerWeek])

    useEffect(async() => {
        const res = await fetch(`http://192.168.100.12:19002/fetchCleaner?id=${acceptedCleanerId}`)
        const {success,rows} = await res.json()
    
        if (success) {
            setCleanerInfo(rows)   
        }
    }, [])
    

    // Update How  many times per week a particular type of clean would happen
    var newNumberOfTimes;
    var deepCleanFee;
    const updateTypeOfCleanTimes = (maxTimes,cleaningType) => {
        newNumberOfTimes = (maximumTimes.length - 1) - maxTimes
        if (cleaningType === 'deep') {
            deepCleanFee = maxTimes * cleanerInfo.deepCleaning
            setAmount(prevEvents => {
                return {
                    ...prevEvents,
                    deepCleaning:deepCleanFee
                }
            })
            setNumberPerWeek({ regularClean:newNumberOfTimes,deepClean:maxTimes })
            // setNumberOfTimesRegularCleaning(newNumberOfTimes)
            // setNumberOfTimesDeepCleaning(maxTimes)
        }else if (cleaningType === 'regular') {
            deepCleanFee = newNumberOfTimes * cleanerInfo.deepCleaning
            setAmount(prevEvents => {
                return {
                    ...prevEvents,
                    deepCleaning:deepCleanFee
                }
            })
            setNumberPerWeek({ regularClean:maxTimes,deepClean:newNumberOfTimes })
            // setNumberOfTimesDeepCleaning(newNumberOfTimes)
            // setNumberOfTimesRegularCleaning(maxTimes)
        }
    }

    // Function to change amount based on number of rooms
    let fullAmount;
    const changeSSA = (val) => {
        setSSA(val)
        fullAmount = cleanerInfo.ssa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                ssa: fullAmount
            }
        })
    }
    const changeMSA = (val) => {
        setMSA(val)
        fullAmount = cleanerInfo.msa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                msa: fullAmount
            }
        })
    }
    const changeLSA = (val) => {
        setLSA(val)
        fullAmount = cleanerInfo.lsa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                lsa: fullAmount
            }
        })
    }
    const changeELSA = (val) => {
        setELSA(val)
        fullAmount = cleanerInfo.elsa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                elsa: fullAmount
            }
        })
    }
    
    const onSelectedItemsChange = selectedItems => {
        setRooms({ selectedItems });
        if (amount.ssa != 0) {
            if (selectedItems[0] == 1 || selectedItems[1] == 1 || selectedItems[2] == 1 || selectedItems[3] == 1) {
                
            }else{
                setSSA(0)
                setAmount(prevEvents => {
                    return {
                        ...prevEvents,
                        ssa: 0
                    }
                })
            }
        }
        if (amount.msa != 0) {
            if (selectedItems[0] == 2 || selectedItems[1] == 2 || selectedItems[2] == 2 || selectedItems[3] == 2) {
                
            }else{
                setMSA(0)
                setAmount(prevEvents => {
                    return {
                        ...prevEvents,
                        msa: 0
                    }
                })
            }
        }
        if (amount.lsa != 0) {
            if (selectedItems[0] == 3 || selectedItems[1] == 3 || selectedItems[2] == 3 || selectedItems[3] == 3) {
                
            }else{
                setLSA(0)
                setAmount(prevEvents => {
                    return {
                        ...prevEvents,
                        lsa: 0
                    }
                })
            }
        }
        if (amount.elsa != 0) {
            if (selectedItems[0] == 4 || selectedItems[1] == 4 || selectedItems[2] == 4 || selectedItems[3] == 4) {
                
            }else{
                setELSA(0)
                setAmount(prevEvents => {
                    return {
                        ...prevEvents,
                        elsa: 0
                    }
                })
            }
        }
    };

    const reset = (value) => {
        setNumberPerWeek({regularClean:value,deepClean:0})
        setResetTimesPerWeek(!resetTimesPerWeek)
    }
    const changeModal = (val) => {
        setModalVisible({show:val,text:'' })
    }
    const subscribeUser = async(amount) => {
        if (!amount || amount === 0) {
            setModalVisible({
                show:true,
                text:'Please Fill in the required Fields'
            })
            return
        }
        if (!review || review === '') {
            setModalVisible({
                show:true,
                text:'Please Write Your review'
            })
            return
        }
        if (starReview < 1 || !starReview) {
            setModalVisible({
                show:true,
                text:'Please Give a Star Rating'
            })
            return
        }

        var currentDate = new Date().getTime()
        var newRating = Number(cleanerRating) + (starReview * 2)
        const res = await fetch(`http://192.168.100.12:19002/postCleanerReview?totalRating=${newRating}&cleanerId=${acceptedCleanerId}&customerId=${id}&customerName=${displayName}&rating=${starReview}&comment=${review}&currentDate=${currentDate}`)
        const subUser = await fetch(`http://192.168.100.12:19002/SubscribeUser?ssa=${numberOfSSA}&msa=${numberOfMSA}&lsa=${numberOfLSA}&elsa=${numberOfELSA}&deepCleaning=${numberPerWeek.deepClean}&cleanerId=${acceptedCleanerId}&customerId=${id}&amount=${amount}&cleaningInterval=${numberPerWeek.regularClean + numberPerWeek.deepClean}&cleanerName=${cleanerFirstname}`)
        const subscribedUserRes = await subUser.json()
    
        if (subscribedUserRes.success) {
            var newRating = Number(cleanerRating) + 10
            const increaseRating = await fetch(`http://192.168.100.12:19002/increaseRating?newRating=${newRating}&cleanerId=${acceptedCleanerId}`)
            setModalVisible({ show:true,text:'Subscribed User Successfully' })   
            setIsPending(false)
            setTimeout(() => {
                navigation.navigate('OrderCleaner',{ subscribed:true })
            }, 3000);
        }else{
            setModalVisible({
                show:true,
                text:'Could not subscribe User'
            })
            setIsPending(false)
        }
    }
  return ( 
      <>
    <MyModal changeModal={changeModal} modalVisible={modalVisible}/>
    <ScrollView style={{ marginTop:20 }} contentContainerStyle={{ paddingBottom:100 }} >
        {cleanerInfo && 
        <>
        <Text style={{ fontFamily:'viga',textAlign:'center',fontSize:20,textDecorationLine:'underline' }}>Want To Hire {cleanerFirstname} ?</Text>
        <Text style={{ fontFamily:'viga',textAlign:'center' }}>(Fill in the below)</Text>

        <View style={{ justifyContent:'center',alignItems:'center',marginHorizontal:15,marginTop:20 }}>
            <View style={{...styles.view,zIndex:-1}}>
                <Text style={{...styles.text,fontSize:16}}>Select Rooms:</Text>
                <Modal
                    animationType="fade"
                    visible={showModal}
                    style={{ backgroundColor:'grey',alignSelf:'center' }}
                >
                <MultiSelect
                hideTags
                items={RoomType}
                uniqueKey="id"
                ref={(component) => { setMultiSelect(component) }}
                onSelectedItemsChange={(item) => onSelectedItemsChange(item)}
                selectedItems={rooms.selectedItems}
                selectText="Pick Items"
                searchInputPlaceholderText="Search Items..."
                submitButtonColor="#CCC"
                submitButtonText="Submit"
                hideSubmitButton={true}
                />
                <Button title='Close' onPress={() => setShowModal(!showModal)} />
                </Modal>
                <View style={{ flexDirection:'row',width:'100%',marginVertical:10 }}>
                    <TouchableWithoutFeedback onPress={() => setShowModal(!showModal)}>
                        <View style={styles.options}>
                            <Text style={styles.text}>Select Type of Area</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <ScrollView horizontal={true} style={{ flexDirection:'row' }}>
                        {rooms.selectedItems.length > 0 &&
                            rooms.selectedItems.map((item,index) => (
                                <View key={index} style={{ flexDirection:'row' }}>
                                    {item == 1 ? <View style={styles.selectedOptions}><Text style={styles.text}> SSA </Text></View> : null}
                                    {item == 2 ? <View style={styles.selectedOptions}><Text style={styles.text}> MSA </Text></View> : null}
                                    {item == 3 ? <View style={styles.selectedOptions}><Text style={styles.text}> LSA </Text></View> : null}
                                    {item == 4 ? <View style={styles.selectedOptions}><Text style={styles.text}> ELSA </Text></View> : null}
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={{ padding:5,paddingBottom:0 }}>
                <View style={{ marginVertical:10 }}>
                    <Text style={styles.text}>How Many Times Per Week</Text>
                    <RNPickerSelect
                        onValueChange={(value) => reset(value)}
                        items={[
                            { label: '1', value: 1 },
                            { label: '2', value: 2 },
                            { label: '3', value: 3 },
                            { label: '4', value: 4 },
                            { label: '5', value: 5 },
                            { label: '6', value: 6 },
                            { label: '7', value: 7 },
                        ]}
                        value={numberPerWeek.regularClean + numberPerWeek.deepClean}
                        style={{  inputAndroid: {paddingHorizontal:10,color:colors.white,backgroundColor:colors.yellow},  inputIOS:{paddingHorizontal:10,color:colors.white,backgroundColor:colors.yellow,height:40 }  }}
                    />
                </View>
                {rooms.selectedItems.length > 0 && 
                    rooms.selectedItems.map((item,index) => (
                        <View style={{ marginVertical:10 }} key={index}>
                        {item == 1 ? <Text style={styles.text}>Pick the number of rooms for SSA</Text>: item == 2 ? <Text style={styles.text}>Pick the number of rooms for MSA</Text> : item == 3 ? <Text style={styles.text}>Pick the number of rooms for LSA</Text> : item == 4 ? <Text style={styles.text}>Pick the number of rooms for ELSA</Text> : null}
                            <RNPickerSelect key={item}
                                onValueChange={(value) => item == 1 ? changeSSA(value) : item == 2 ? changeMSA(value) : item == 3 ? changeLSA(value) : item == 4 ? changeELSA(value) : null}
                                items={[
                                    { label: '1', value: 1 },
                                    { label: '2', value: 2 },
                                    { label: '3', value: 3 },
                                    { label: '4', value: 4 },
                                    { label: '5', value: 5 },
                                    { label: '6', value: 6 },
                                    { label: '7', value: 7 },
                                    { label: '8', value: 8 },
                                    { label: '9', value: 9 },
                                    { label: '10', value: 10 }
                                ]}
                                value={item == 1 ? numberOfSSA : item == 2 ? numberOfMSA : item == 3 ? numberOfLSA : item == 4 ? numberOfELSA : null}
                                style={{  inputAndroid: {color:colors.white,backgroundColor:colors.yellow,paddingHorizontal:10 },  inputIOS:{paddingHorizontal:10,color:colors.white,backgroundColor:colors.yellow,height:40 }  }}
                            />
                        </View>  
                    ))
                }   
                {rooms.selectedItems.length > 0 && 
                <>
                    <Text style={styles.text}>How Many Times per Week do you want Regular Cleaning for each of the Rooms</Text>
                    <View style={{ flexDirection:'row',marginVertical:10 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{flexGrow: 1,paddingRight:150}} style={{ maxWidth:'100%' }}>    
                            {
                                maximumTimes.map((maxTimes,index) => (
                                    numberPerWeek.regularClean === maxTimes ? <View key={index} style={{...styles.selectedOptions,width:'15%' }}><Text style={styles.text}>{maxTimes}</Text></View> : <TouchableWithoutFeedback key={index} onPress={() => updateTypeOfCleanTimes(maxTimes,'regular')}><View style={{...styles.selectedOptions,width:'15%',borderColor:'#c4c4c4',opacity:0.8}}><Text style={styles.text}>{maxTimes}</Text></View></TouchableWithoutFeedback>
                                ))
                            }
                        </ScrollView>
                    </View>      
                    <Text style={styles.text}>How Many Times per Week do you want Deep Cleaning for each of the Rooms</Text>
                    <View horizontal={true} style={{ flexDirection:'row',marginVertical:10 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{flexGrow: 1,paddingRight:150}} style={{ maxWidth:'100%' }}>
                    {
                        maximumTimes.map((maxTimes,index) => (
                            numberPerWeek.deepClean === maxTimes ? <View key={index} style={{...styles.selectedOptions,width:'15%'}}><Text style={styles.text}>{maxTimes}</Text></View> : <TouchableWithoutFeedback key={index} onPress={() => updateTypeOfCleanTimes(maxTimes,'deep')}><View style={{...styles.selectedOptions,width:'15%',borderColor:'#c4c4c4',opacity:0.8}}><Text style={styles.text}>{maxTimes}</Text></View></TouchableWithoutFeedback>
                        ))
                    }
                    </ScrollView>
                    </View>      
                </>
                }
                    <View>
                        <Text style={styles.text}>What are your thoughts on this Cleaner?</Text>
                        <TextInput value={review} placeholderTextColor={'#c4c4c4'} maxLength={200} onChangeText={(val) => setReview(val)} placeholder='Write your Review on the Cleaner' style={{ color:colors.black,letterSpacing:1, minHeight:80,borderWidth:1,borderColor:colors.yellow,marginVertical:5,padding:10 }} multiline={true} />
                        <View style={{ flexDirection:'row',marginVertical:10 }}>
                            {
                            star.map((item,index) => (
                                <TouchableWithoutFeedback key={index} onPress={() => setStarReview(index + 1)}>
                                    <Entypo name="star" size={24} style={ starReview >= index + 1 && starReview ? { color:'gold',letterSpacing:4 } : { color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                                </TouchableWithoutFeedback>
                            ))   
                            }      
                        </View>
                    </View>
                <TouchableOpacity onPress={() => subscribeUser(((amount.ssa + amount.msa + amount.lsa + amount.elsa) * numberPerWeek.regularClean) + amount.deepCleaning)}>
                    <View style={{ ...styles.button,marginTop:10 }}>
                        {isPending ? <ActivityIndicator color={colors.white} size={'large'}/> : <Text style={{ fontSize:16,color:colors.white,textAlign:'center',fontFamily:'viga' }}>You Pay ₦{((amount.ssa + amount.msa + amount.lsa + amount.elsa) * numberPerWeek.regularClean) + amount.deepCleaning }</Text>}
                    </View>
                </TouchableOpacity>
                </View>     
            </View>
        </View>
        </>
        }
    </ScrollView>
    </>
  )
}
const styles = StyleSheet.create({
    input: {
        borderColor:colors.black,
        borderWidth:2,
        backgroundColor:'#c4c4c4',
        paddingLeft:10,
        letterSpacing:1.4
    },
    parentView:{
        width:'80%',
        marginVertical:15
    },
    text:{
        fontSize:16,
        fontFamily:'viga'
    },
    options: {
        width:'50%',
        backgroundColor:colors.yellow,
        padding:10
    },
    selectedOptions: {
        borderRadius:20,
        padding:5,
        borderColor:colors.yellow,
        borderWidth:2,
        margin:5
    },
    text:{
        fontFamily:'viga',
        color:colors.black,
        textAlign:'center'
    },
    button: {
        backgroundColor: colors.green,
        height: 50,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
})