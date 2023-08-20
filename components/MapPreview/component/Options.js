import React, { useEffect } from 'react'
import { View,StyleSheet,Text,ActivityIndicator, TouchableWithoutFeedback,Modal, Button, ScrollView, TouchableOpacity,Dimensions } from 'react-native';
import { colors } from '../../../colors/colors';
import MultiSelect from 'react-native-multiple-select';
import { useState } from 'react';
// import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import TypeOfCleaningModal from './TypeOfCleaningModal';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import MyModal from '../../modal';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_APIKEY } from '../../../apikey';

export default function Options({ changeOrderState,login,changeModal,dispatch,getOrderId }) {
    const { latitude,longitude } = useSelector(state => state.location)
    const [rooms,setRooms] = useState({
        selectedItems: []
    })
    const {width,height} = Dimensions.get('window')
    const [numberOfSSA, setSSA] = useState(0)
    const [numberOfMSA, setMSA] = useState(0)
    const [numberOfLSA, setLSA] = useState(0)
    const [numberOfELSA, setELSA] = useState(0)
    const [multiSelect,setMultiSelect] = useState(null)
    const [showModal,setShowModal] = useState(false)
    const [showExplanation,setShowExplanation] = useState(false)
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [isPending,setIsPending] = useState(false)
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
        totalAmount:0
    })
    var forwardLatitude
    var backwardLatitude
    var forwardLongitude 
    var backwardLongitude
    const RoomType = [{
        id: '1',
        name: 'Small Sized Area/Room/Kitchen...etc'
      }, {
        id: '2',
        name: 'Meduim Sized Area/Room/Kitchen...etc'
      }, {
        id: '3',
        name: 'Large Sized Area/Room/Kitchen...etc'
      }, {
        id: '4',
        name: 'Extra large Area/Room/Kitchen...etc'
      }
    ];
    useEffect(() => {
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                totalAmount: amount.ssa + amount.msa + amount.lsa + amount.elsa + amount.deepCleaning
            }
        })
    }, [amount.ssa,amount.msa ,amount.lsa ,amount.elsa ,amount.deepCleaning])
    const onSelectedItemsChange = selectedItems => {
        setRooms({ selectedItems });
        if (amount.ssa === 0 && selectedItems[0] == 1 || selectedItems[1] == 1 || selectedItems[2] == 1 || selectedItems[3] == 1) {
            setSSA(1)
            changeSSA(1)
        }else if (amount.ssa != 0) {
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
        if (amount.msa === 0 && selectedItems[0] == 2 || selectedItems[1] == 2 || selectedItems[2] == 2 || selectedItems[3] == 2) {
            setMSA(1)
            changeMSA(1)
        }else if (amount.msa != 0) {
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
        if (amount.lsa === 0 && selectedItems[0] == 3 || selectedItems[1] == 3 || selectedItems[2] == 3 || selectedItems[3] == 3) {
            setLSA(1)
            changeLSA(1)
        }else if (amount.lsa != 0) {
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
        if (amount.elsa === 0 && selectedItems[0] == 4 || selectedItems[1] == 4 || selectedItems[2] == 4 || selectedItems[3] == 4) {
            setELSA(1)
            changeELSA(1)
        }else if (amount.elsa != 0) {
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
    let fullAmount;
    // Select number of rooms for each type of area selected
    const changeSSA = (val) => {
        if (!val) {
            return
        }
        setSSA(val)
        fullAmount = 1200 * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                ssa: fullAmount
            }
        })
    }
    const changeMSA = (val) => {
        if (!val) {
            return
        }
        setMSA(val)
        fullAmount = 2100 * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                msa: fullAmount
            }
        })
    }
    const changeLSA = (val) => {
        if (!val) {
            return
        }
        setLSA(val)
        fullAmount = 3000 * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                lsa: fullAmount
            }
        })
    }
    const changeELSA = (val) => {
        if (!val) {
            return
        }
        setELSA(val)
        fullAmount = 4000 * val
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                elsa: fullAmount
            }
        })
    }
    // Show modal and choose type of cleaning
    const chooseRegularClean = () => {
        setTypeOfClean({
            type:'regular',
            explanation:'Regular cleaning involves only Cleaning of floor and surroundings. This involves only sweeping and mopping.'
        })
        setShowExplanation(true)
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                deepCleaning: 0
            }
        })
    }
    const chooseDeepClean = () => {
        setTypeOfClean({
            type:'deep',
            explanation:'Deep cleaning involves Cleaning of all surrounding environment and all surfaces. This usually involves Sweeping,Mopping,Dusting & Cleaning of surfaces,Bed arrangement,window cleaning etc'
        })
        setShowExplanation(true)
        setAmount(prevEvents => {
            return {
                ...prevEvents,
                deepCleaning: 4000
            }
        })
    }
    // Toggle type of cleaning explanation modal
    const changeExplanationModal = () => {
        setShowExplanation(!showExplanation)
    }

    // On submit 
    const SubmitSelection = async() => {
        if (isPending) {
            return
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setModalVisible({
            show: true,
            text: 'Please Enable Location to request cleaners'
          })
          return;
        }
        if (amount.elsa + amount.lsa + amount.msa + amount.ssa != 0) {
            // if (isPending) {
            //     return
            // }
            const amountToBePaid = amount.elsa + amount.lsa + amount.msa + amount.ssa + amount.deepCleaning
            setIsPending(true)
            const { id,displayName } = login
            forwardLatitude = latitude + 0.01
            backwardLatitude = latitude - 0.01
            forwardLongitude = longitude + 0.01
            backwardLongitude = longitude - 0.01
            const date = new Date().getTime()
            const fetchLoc = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number(latitude) - 0.01},${Number(longitude) - 0.01}&key=${GOOGLE_MAPS_APIKEY}`)
            const locResults = await fetchLoc.json()
            const res = await fetch(`http://192.168.100.12:19002/InsertOrder?addressInWords=${locResults.results[0].formatted_address}&customerNumber=${login.number}&backwardLongitude=${backwardLongitude}&forwardLongitude=${forwardLongitude}&forwardLatitude=${forwardLatitude}&backwardLatitude=${backwardLatitude}&customerName=${displayName}&customerId=${id}&amount=${amountToBePaid}&state=pending&date=${date}&ssa=${numberOfSSA}&msa=${numberOfMSA}&lsa=${numberOfLSA}&elsa=${numberOfELSA}&typeOfCleaning=${typeOfClean.type}`)
            const { success,rows } = await res.json()
            setIsPending(false)
            if (success) {
                console.log(rows)
                getOrderId(rows)
                dispatch({ type:'ORDER_INFO',payload:{ orderId:rows,askHire:true } })
                changeOrderState('pending')   
            }else{
                changeModal(true,'There was an error,Please try again later')
                setIsPending(false)
            }
        }else{
            changeModal(true,'Please Select an option')
        }   
    }
  return (
      <>
        <MyModal changeModal={changeModal} modalVisible={modalVisible} />
        <View style={{...styles.view,zIndex:1}}>
        <Modal
            animationType="fade"
            visible={showModal}
            style={{ backgroundColor:'grey',alignSelf:'center' }}
        >
        <View style={{ marginTop:30 }}>
        <MultiSelect
          hideTags
          items={RoomType}
          uniqueKey="id"
          ref={(component) => { setMultiSelect(component) }}
          onSelectedItemsChange={(item) => onSelectedItemsChange(item)}
          selectedItems={rooms.selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
          hideSubmitButton={true}
        />
        <View>
            {multiSelect && multiSelect.getSelectedItemsExt(rooms.selectedItems) }
        </View>
        <Button title='Close' onPress={() => setShowModal(!showModal)} />
        </View>
        </Modal>
        <View style={{ flexDirection:'row',width:'100%' }}>
        <TouchableWithoutFeedback onPress={() => setShowModal(!showModal)}>
            <View style={styles.options}>
                <Text style={styles.text}>Select Type of Area</Text>
            </View>
        </TouchableWithoutFeedback>
            <ScrollView horizontal={true} style={{ flexDirection:'row' }}>
                {
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
        <ScrollView style={{ padding:5,paddingBottom:0,maxHeight:'30%' }}>
        {rooms.selectedItems != 0 && 
            rooms.selectedItems.map((item,index) => (
                <View style={{ marginVertical:10 }} key={index}>
                {item == 1 ? <Text style={styles.text}>Pick the number of rooms for SSA</Text>: item == 2 ? <Text style={styles.text}>Pick the number of rooms for MSA</Text> : item == 3 ? <Text style={styles.text}>Pick the number of rooms for LSA</Text> : item == 4 ? <Text style={styles.text}>Pick the number of rooms for ELSA</Text> : null}
                <View style={{ backgroundColor:'#2196F3',width:'50%',alignSelf:'center',flexDirection:'row',alignItems:'center' }}>
                    <TouchableWithoutFeedback onPress={() => item == 1 ? changeSSA(numberOfSSA === 0 ? null : numberOfSSA - 1) : item == 2 ? changeMSA(numberOfMSA === 0 ? null : numberOfMSA - 1) : item == 3 ? changeLSA(numberOfLSA === 0 ? null : numberOfLSA - 1) : item == 4 ? changeELSA(numberOfELSA === 0 ? null : numberOfELSA - 1) : null}>
                        <View style={{ width:'33%' }}>
                            <AntDesign name="minuscircle" size={24} color={colors.yellow} />
                        </View>
                    </TouchableWithoutFeedback>    
                    <View style={{ width:'33%' }}>
                        <Text style={{ textAlign:'center',fontFamily:'viga',marginVertical:10 }}>{item == 1 ? numberOfSSA : item == 2 ? numberOfMSA : item == 3 ? numberOfLSA : item == 4 ? numberOfELSA : null}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => item == 1 ? changeSSA(numberOfSSA + 1) : item == 2 ? changeMSA(numberOfMSA + 1) : item == 3 ? changeLSA(numberOfLSA + 1) : item == 4 ? changeELSA(numberOfELSA + 1) : null}>
                        <View style={{ width:'33%',alignItems:'flex-end' }}>
                            <AntDesign name="pluscircle" size={24} color={colors.yellow} />
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
                    style={{  inputAndroid: {color:colors.white,backgroundColor:'#2196F3',height: 40,paddingHorizontal:10},  inputIOS:{color:colors.white,backgroundColor:'#2196F3',height:40,paddingHorizontal:10 }  }}
                /> */}
                </View>  
            ))
        }   
        {rooms.selectedItems.length != 0 && 
            <>
            <TypeOfCleaningModal showExplanation={showExplanation} text={typeOfClean.explanation} changeExplanationModal={changeExplanationModal} type={typeOfClean.type} />
            <View style={{ marginTop:10 }}>
                <TouchableWithoutFeedback onPress={() => chooseRegularClean()}>
                    <View style={typeOfClean.type === 'regular' ? styles.selectedOptions : {...styles.selectedOptions, borderColor:'#c4c4c4'}}><Text style={styles.text}>Regular Cleaning</Text></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => chooseDeepClean()}>
                    <View style={typeOfClean.type === 'deep' ? styles.selectedOptions : {...styles.selectedOptions, borderColor:'#c4c4c4'}}><Text style={styles.text}>Deep Cleaning</Text></View>
                </TouchableWithoutFeedback>
            </View>
            </>
        }
        {
         amount.totalAmount > 0 &&   
         <Text style={{ textAlign:'right',color:colors.whitishBlue,fontWeight:'bold' }}>₦{amount.totalAmount} - ₦{amount.totalAmount + 500}</Text>
        }
        {
            amount.totalAmount !== 0 ?
            <TouchableOpacity onPress={() => SubmitSelection()}>
            <View style={{ ...styles.button,marginTop:10 }}>
                {isPending ? <ActivityIndicator color={colors.white} size={'large'}/> :
                <Text style={{ fontSize:16,color:colors.white,fontFamily:'Murecho' }}>Blip a cleaner</Text>
                }
            </View>
            </TouchableOpacity>
            :
            <View style={{ ...styles.button,marginTop:10,backgroundColor:colors.purple,opacity:.5 }}>
                <Text style={{ fontSize:16,color:colors.white,fontFamily:'Murecho' }}>Blip a cleaner</Text>
            </View>
        }   
        <Text style={{...styles.text,paddingBottom:100}}>Hi there, if your selection gets too long, scroll down to see me again!!!</Text>
        </ScrollView>     
        </View>
    </>
    )
}

const styles = StyleSheet.create({
    view: {
        height:'100%',
        width:'100%',
        padding:30,
        zIndex:1
    },
    options: {
        width:'60%',
        backgroundColor:colors.purple,
        padding:10
    },
    selectedOptions: {
        borderRadius:20,
        padding:5,
        borderColor:colors.purple,
        borderWidth:2,
        margin:5
    },
    text:{
        fontFamily:'viga',
        color:colors.white,
        textAlign:'center'
    },
    button: {
        backgroundColor: colors.yellow,
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