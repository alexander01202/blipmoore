import React, { useEffect } from 'react'
import { Text, View,StyleSheet,TextInput,ActivityIndicator, TouchableWithoutFeedback,Modal, Button, ScrollView, TouchableOpacity,Dimensions,ImageBackground, Image  } from 'react-native'
import { colors } from '../../colors/colors';
import MultiSelect from 'react-native-multiple-select';
// import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { useState } from 'react';
import MyModal from '../../components/modal';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { GOOGLE_MAPS_APIKEY } from '../../apikey';
import { Entypo,AntDesign } from '@expo/vector-icons';

export default function HireAgentPage({ route,navigation }) {
    const [numberOfSSA, setSSA] = useState(0)
    const [numberOfMSA, setMSA] = useState(0)
    const [numberOfLSA, setLSA] = useState(0)
    const [numberOfELSA, setELSA] = useState(0)
    const [multiSelect,setMultiSelect] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [showModal,setShowModal] = useState(false)
    const [numberPerWeek,setNumberPerWeek] = useState({ regularClean:1,deepClean:0,TotalNumber:1 })
    const [maximumTimes,setMaximumTimes] = useState([])
    const [numberOfTimesRegularCleaning,setNumberOfTimesRegularCleaning] = useState(1)
    const [numberOfTimesDeepCleaning,setNumberOfTimesDeepCleaning] = useState(0)
    const [resetTimesPerWeek,setResetTimesPerWeek] = useState(false)
    const [agentInfo,setAgentInfo] = useState(null)
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const { id } = useSelector(state => state.login)
    const [address,setAddress] = useState(null)
    const [numberOfBuildings,setNumberOfBuildings] = useState(0)

    const { agentId } = route.params
    const { width,height } = Dimensions.get('window')
    const [rooms,setRooms] = useState({
        selectedItems: []
    })
    const maxNumberOfBuildings = [0,1,2,3,4,5]
    const [typeOfClean,setTypeOfClean] = useState({
        type:'regular',
        explanation:'Regular cleaning involves only Cleaning of floor and surroundings. This involves only sweeping and mopping.'
    })
    const [amount,setAmount]= useState({
        ssa:0,
        msa:0,
        lsa:0,
        elsa:0,
        deepCleaning:0,
        postConstruction:0
    })
    const [entireAmount, setEntireAmount] = useState(0)
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
        const calculations = ((amount.ssa + amount.msa + amount.lsa + amount.elsa) * (numberPerWeek.regularClean + numberPerWeek.deepClean)) + (amount.deepCleaning * (numberOfSSA + numberOfMSA + numberOfLSA + numberOfELSA)) + amount.postConstruction
        setEntireAmount(calculations)
      
    }, [amount.ssa,amount.msa,amount.lsa,amount.elsa,numberPerWeek.regularClean,numberPerWeek.deepClean,amount.deepCleaning,amount.postConstruction,numberOfSSA,numberOfMSA,numberOfLSA,numberOfELSA])
    
    useEffect(() => {
        let maxTime = []
        let allNumberOfWeek = numberPerWeek.deepClean + numberPerWeek.regularClean
        for (let i = 0; i <= allNumberOfWeek; i++) {
            maxTime.push(i)
        }
        // setNumberOfTimesRegularCleaning(maxTime[maxTime.length - 1])
        // setNumberOfTimesDeepCleaning(0)
        setNumberPerWeek({ regularClean:maxTime[maxTime.length - 1],deepClean:0,TotalNumber:maxTime[maxTime.length - 1] })
        setMaximumTimes(maxTime)
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                deepCleaning:0
            }
        })
    }, [resetTimesPerWeek])
    
    useEffect(async() => {
        const res = await fetch(`http://192.168.100.12:19002/fetchAgent?id=${agentId}`)
        const {success,rows} = await res.json()
    
        if (success) {
            setAgentInfo(rows)   
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setModalVisible({
              show: true,
              text: 'Please Enable Location to use this app'
            })
            return
        }
        let { latitude,longitude } = (await Location.getCurrentPositionAsync({})).coords;
        const fetchLoc = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`)
        const locResults = await fetchLoc.json()
        let usersAddressInWords = `NO ${locResults.results[0].formatted_address}`
        setAddress(usersAddressInWords)
    }, [])
    

    // Update How  many times per week a particular type of clean would happen
    var newNumberOfTimes;
    var deepCleanFee;
    const updateTypeOfCleanTimes = (maxTimes,cleaningType) => {
        newNumberOfTimes = (maximumTimes.length - 1) - maxTimes
        if (cleaningType === 'deep') {
            deepCleanFee = maxTimes * agentInfo.deepCleaning
            setAmount(prevEvents => {
                return {
                    ...prevEvents,
                    deepCleaning:deepCleanFee
                }
            })
            setNumberPerWeek(prevEvents => {
                return {
                    ...prevEvents,
                    regularClean:newNumberOfTimes,deepClean:maxTimes
                }
            })
            // setNumberOfTimesRegularCleaning(newNumberOfTimes)
            // setNumberOfTimesDeepCleaning(maxTimes)
        }else if (cleaningType === 'regular') {
            deepCleanFee = newNumberOfTimes * agentInfo.deepCleaning
            setAmount(prevEvents => {
                return {
                    ...prevEvents,
                    deepCleaning:deepCleanFee
                }
            })
            setNumberPerWeek(prevEvents => {
                return {
                    ...prevEvents,
                    regularClean:maxTimes,deepClean:newNumberOfTimes
                }
            })
            // setNumberOfTimesDeepCleaning(newNumberOfTimes)
            // setNumberOfTimesRegularCleaning(maxTimes)
        }
    }

    let fullAmount;
    const updatePostConstruction = (val) => {
        setNumberOfBuildings(val)
        fullAmount = agentInfo.postConstruction * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                deepCleaning:0,
                postConstruction:fullAmount
            }
        })
        setNumberPerWeek({ regularClean:numberPerWeek.TotalNumber,deepClean:0,TotalNumber:numberPerWeek.TotalNumber })
    }

    // Function to change amount based on number of rooms
   
    const changeSSA = (val) => {
        setSSA(val)
        fullAmount = agentInfo.ssa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                ssa: fullAmount
            }
        })
    }
    const changeMSA = (val) => {
        setMSA(val)
        fullAmount = agentInfo.msa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                msa: fullAmount
            }
        })
    }
    const changeLSA = (val) => {
        setLSA(val)
        fullAmount = agentInfo.lsa * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                lsa: fullAmount
            }
        })
    }
    const changeELSA = (val) => {
        setELSA(val)
        fullAmount = agentInfo.elsa * val
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
        if (value < 1) {
            return
        }
        setNumberPerWeek({regularClean:value,deepClean:0,TotalNumber:value})
        setResetTimesPerWeek(!resetTimesPerWeek)
    }
    const changeModal = (val) => {
        setModalVisible({show:val,text:'' })
    }
    const subscribeUser = async(amount) => {
        if (Number(amount) < 1200) {
            return
        }
        setIsPending(true)
        const subUser = await fetch(`http://192.168.100.12:19002/SubscribeUserToAgent?ssa=${numberOfSSA}&msa=${numberOfMSA}&lsa=${numberOfLSA}&elsa=${numberOfELSA}&deepCleaning=${numberPerWeek.deepClean}&cleanerId=${agentId}&customerId=${id}&amount=${amount}&cleaningInterval=${numberPerWeek.regularClean + numberPerWeek.deepClean}&agentName=${agentInfo.company_name}`)
        const subscribedUserRes = await subUser.json()
    
        if (subscribedUserRes.success) {
            setModalVisible({ show:true,text:'Subscribed User Successfully' })   
            setIsPending(false)
            setTimeout(() => {
                navigation.navigate('OrderCleaner',{ subscribed:true })
            }, 3000);
        }else{
            setIsPending(false)
        }
    }
  return ( 
      <>
    <MyModal changeModal={changeModal} modalVisible={modalVisible}/>
    <ScrollView style={{ marginTop:20 }} contentContainerStyle={{ paddingBottom:100 }} >
        {agentInfo && 
        <>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
            <View style={{ ...styles.backIcon,marginVertical:5 }}>
                <AntDesign name="arrowleft" style={{ shadowColor:'black' }} size={24} color="black" />
            </View>
        </TouchableWithoutFeedback>
        <View style={{ width:'100%',alignItems:'center' }}>
            {/* <Image style={{ width:50,height:50 }} source={require('../../assets/hiringBlack.png')} /> */}
        </View>
        <View>
            <Text numberOfLines={1} style={{ width:'100%',fontFamily:'Funzi',textAlign:'center',fontSize:25,color:colors.black }}>{agentInfo.company_name}</Text>
        </View>

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
                        <View style={styles.numberBox}>
                            <TouchableWithoutFeedback onPress={() => reset(numberPerWeek.TotalNumber - 1)}>
                                <View style={{ width:'33%' }}>
                                    <AntDesign name="minuscircle" size={24} color={colors.black} />
                                </View>
                            </TouchableWithoutFeedback>
                            <Text style={{ textAlign:'center' }}>{numberPerWeek.TotalNumber}</Text>
                            <TouchableWithoutFeedback onPress={() => reset(numberPerWeek.TotalNumber + 1)}>
                                <View style={{ width:'33%',alignItems:'flex-end' }}>
                                    <AntDesign name="pluscircle" size={24} color={colors.black} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    {/* <RNPickerSelect
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
                        value={numberPerWeek.TotalNumber}
                        style={{  inputAndroid: {color:colors.white,backgroundColor:colors.yellow,height:40,paddingHorizontal:30,width:'100%'},  inputIOS:{color:colors.white,backgroundColor:colors.yellow,height:height > 768 ? 40 : null,paddingHorizontal:30,width:'100%' }  }}
                    /> */}
                </View>
                {rooms.selectedItems.length > 0 && 
                    rooms.selectedItems.map((item,index) => (
                        <View style={{ marginVertical:10 }} key={index}>
                        {item == 1 ? <Text style={styles.text}>How many Small Sized Area?</Text>: item == 2 ? <Text style={styles.text}>How many Medium Sized Area?</Text> : item == 3 ? <Text style={styles.text}>How many Large Sized Area</Text> : item == 4 ? <Text style={styles.text}>How many Extra Large Sized Area</Text> : null}
                            <View style={styles.numberBox}>
                                <TouchableWithoutFeedback onPress={() => item == 1 ? changeSSA(numberOfSSA - 1) : item == 2 ? changeMSA(numberOfMSA - 1) : item == 3 ? changeLSA(numberOfLSA - 1) : item == 4 ? changeELSA(numberOfELSA - 1) : null}>
                                    <View style={{ width:'33%' }}>
                                        <AntDesign name="minuscircle" size={24} color={colors.black} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <Text style={{ textAlign:'center' }}>{item == 1 ? numberOfSSA : item == 2 ? numberOfMSA : item == 3 ? numberOfLSA : item == 4 ? numberOfELSA : null}</Text>
                                <TouchableWithoutFeedback onPress={() => item == 1 ? changeSSA(numberOfSSA + 1) : item == 2 ? changeMSA(numberOfMSA + 1) : item == 3 ? changeLSA(numberOfLSA + 1) : item == 4 ? changeELSA(numberOfELSA + 1) : null}>
                                    <View style={{ width:'33%',alignItems:'flex-end' }}>
                                        <AntDesign name="pluscircle" size={24} color={colors.black} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {/* <RNPickerSelect key={item}
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
                                style={{  inputAndroid: {color:colors.white,backgroundColor:colors.yellow,height:40,paddingHorizontal:30},  inputIOS:{color:colors.white,backgroundColor:colors.yellow,height:40,paddingHorizontal:30 }  }}
                            /> */}
                        </View>  
                    ))
                }   
                {rooms.selectedItems.length > 0 && 
                <View style={{ marginVertical:10 }}>
                    <Text style={styles.text}>How Many Times per Week do you want Regular Cleaning for each of the Area?</Text>
                    <View style={{ flexDirection:'row',marginVertical:10 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{flexGrow: 1,paddingRight:150}} style={{ maxWidth:'100%' }}>    
                            {
                                maximumTimes.map((maxTimes,index) => (
                                    numberPerWeek.regularClean === maxTimes ? <View key={index} style={{...styles.selectedOptions,width:'15%' }}><Text style={styles.text}>{maxTimes}</Text></View> : <TouchableWithoutFeedback key={index} onPress={() => updateTypeOfCleanTimes(maxTimes,'regular')}><View style={{...styles.selectedOptions,width:'15%',borderColor:'#c4c4c4',opacity:0.8}}><Text style={styles.text}>{maxTimes}</Text></View></TouchableWithoutFeedback>
                                ))
                            }
                        </ScrollView>
                    </View>      
                    <Text style={styles.text}>How Many Times per Week do you want Deep Cleaning for each of the Area?</Text>
                    <View horizontal={true} style={{ flexDirection:'row',marginVertical:10 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{flexGrow: 1,paddingRight:150}} style={{ maxWidth:'100%' }}>
                    {
                        maximumTimes.map((maxTimes,index) => (
                            numberPerWeek.deepClean === maxTimes ? <View key={index} style={{...styles.selectedOptions,width:'15%'}}><Text style={styles.text}>{maxTimes}</Text></View> : <TouchableWithoutFeedback key={index} onPress={() => updateTypeOfCleanTimes(maxTimes,'deep')}><View style={{...styles.selectedOptions,width:'15%',borderColor:'#c4c4c4',opacity:0.8}}><Text style={styles.text}>{maxTimes}</Text></View></TouchableWithoutFeedback>
                        ))
                    }
                    </ScrollView>
                    </View>      
                    <Text style={styles.text}>How many Buildings Require Post Construction Cleaning?</Text>
                    <View horizontal={true} style={{ flexDirection:'row',marginVertical:10 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{flexGrow: 1,paddingRight:150}} style={{ maxWidth:'100%' }}>
                    {
                        maxNumberOfBuildings.map((maxTimes,index) => (
                            numberOfBuildings === maxTimes ? <View key={index} style={{...styles.selectedOptions,width:'15%'}}><Text style={styles.text}>{maxTimes}</Text></View> : <TouchableWithoutFeedback key={index} onPress={() => updatePostConstruction(maxTimes)}><View style={{...styles.selectedOptions,width:'15%',borderColor:'#c4c4c4',opacity:0.8}}><Text style={styles.text}>{maxTimes}</Text></View></TouchableWithoutFeedback>
                        ))
                    }
                    </ScrollView>
                    </View>      
                </View>
                }
                <View style={{ marginVertical:10 }}>
                    <Text style={styles.text}>Address</Text>
                    {address && <TextInput style={{...styles.input,height:40}} onChangeText={(val) => setAddress(val)} value={address} placeholder='Please put in Your address' /> }
                </View>
                <TouchableOpacity onPress={() => subscribeUser(((amount.ssa + amount.msa + amount.lsa + amount.elsa) * (numberPerWeek.regularClean + numberPerWeek.deepClean)) + amount.deepCleaning + amount.postConstruction)}>
                    <View style={{ ...styles.button,marginTop:10 }}>
                        {isPending ? <ActivityIndicator color={colors.white} size={'large'}/> : <Text style={{ fontSize:16,color:colors.white,textAlign:'center',fontFamily:'viga' }}>You Pay ₦{entireAmount}</Text>}
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
    numberBox:{
        backgroundColor:colors.yellow,width:'100%',
        alignSelf:'center',
        flexDirection:'row',
        padding:10,
        justifyContent:'center',
        alignItems:'center'
    },
    backIcon:{
        left:10,
        shadowOpacity:0.2,
        shadowOffset:{ width:5,height:5 },
        borderRadius:20,
        height:30,
        width:30,
        backgroundColor:colors.white,
        justifyContent:'center',
        alignItems:'center',
        elevation:3
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