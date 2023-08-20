import { View, Text, TextInput,StyleSheet, TouchableOpacity,TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { AllKeys } from '../../keys/AllKeys'
import { colors } from '../../colors/colors';
import { BarIndicator } from 'react-native-indicators';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Address({ navigation }) {
    const [stateOpen, setStateOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [lgaOpen, setLgaOpen] = useState(false);
    const [state, setState] = useState(null);
    const [stateId, setStateId] = useState(null);
    const [country, setCountry] = useState(null);
    const [countryId, setCountryId] = useState(null);
    const [lga, setLga] = useState(null);
    const [lgaId, setLgaId] = useState(null);
    const [estate, setEstate] = useState(false)
    const [estateName, setEstateName] = useState(null)
    const [streetNo, setStreetNo] = useState(null)
    const [streetName, setStreetName] = useState(null)
    const [loading, setLoading] = useState(false);
    const [isPending, setIsPending] = useState(false)
    const { id,address } = useSelector(state => state.login) 
    const [countryList, setCountryList] = useState([
      {label: 'Nigeria', value: 'Nigeria'}
    ]);
    const [stateList, setStateList] = useState([
      {label: '', value: ''}
    ]);
    const [lgaList, setLgaList] = useState([
      {label: '', value: ''}
    ]);

    const dispatch = useDispatch()
    const updateAddress = async() => {
        setIsPending(true)
        var fullAddress;
        if (estate) {
            fullAddress = `NO ${streetNo} ${streetName},${estate}, ${lga}, ${state}`   
        }else{
            fullAddress = `NO ${streetNo} ${streetName},${lga}, ${state}`
        }
        const res = await fetch(`${AllKeys.ipAddress}/updateUserAddress?userid=${id}&number=${streetNo}&streetName=${streetName}&estate=${estateName}&lga=${lga}&state=${state}&country=${country}`)
        const { success } = await res.json();
        if (success) {
            dispatch({ type:'UPDATE_ADDRESS',payload: { address:fullAddress } })
            navigation.pop()
        }
        setIsPending(false)
    }
    useEffect(async() => {
        if (stateId) {
            const getLga = await fetch(`${AllKeys.verifyNINurl}/states/${stateId}/lgas`, {
                method: 'GET',
                headers:{
                  'Authorization':`Bearer <${AllKeys.verifyNINKey}>`,
                },
            })
            const { data } = await getLga.json()
            var arr = []
            Object.entries(data).map(item => {
               arr.push({ label:item[1].name,value:item[1].name })
            }) 
            setLgaList(arr)
        }if (countryId) {
            setLoading(true)
            const getStates = await fetch(`${AllKeys.verifyNINurl}/countries/${countryId}/states`, {
                method: 'GET',
                headers:{
                  'Authorization':`Bearer <${AllKeys.verifyNINKey}>`,
                },
            })
            const { data } = await getStates.json()
            var arr = []
            Object.entries(data).map(item => {
               arr.push({ label:item[1].name,value:item[1].id })
            }) 
            setStateList(arr)
            setLoading(false)
        }else{
            const res = await fetch(`${AllKeys.verifyNINurl}/countries`, {
                method: 'GET',
                headers:{
                  'Authorization':`Bearer <${AllKeys.verifyNINKey}>`,
                },
            })
            const response = await res.json()
            setCountryList([ {label:response.data[0].name, value:response.data[0].id } ])
        }
      
    }, [countryId,stateId])
    
  return (
    <KeyboardAwareScrollView>
        <View style={styles.container}>
            <Text style={{ fontStyle:'italic',fontSize:12,textAlign:'center' }}>{address}</Text>
            <Text style={{ ...styles.text, marginBottom:30 }}>Please enter your address 🏡</Text>
            <View style={styles.eachOption}>
                <Text style={styles.fieldText}>Street Number:</Text>
                <TextInput style={styles.input} value={streetNo} placeholder='eg. 1' keyboardType='numeric' onChangeText={(val) => setStreetNo(val)}  />
            </View>
            {
                streetNo ?
                <View style={styles.eachOption}>
                    <Text style={styles.fieldText}>Street Name.</Text>
                    <TextInput style={styles.input} value={streetName} placeholder='eg. John doe Street' onChangeText={(val) => setStreetName(val)}/>
                </View>
                :
                null
            }
            {
                streetName && streetNo ?
                <View style={styles.eachOption}>
                <Text style={styles.fieldText}>Do you live in an estate?</Text>
                    <View style={{ flexDirection:'row' }}>
                        <TouchableWithoutFeedback onPress={() => setEstate(true)}>
                            <View style={estate ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={estate ? {fontWeight:'bold'} : null}>Yes</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => setEstate(false)}>
                            <View style={!estate ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                                <Text style={!estate ? {fontWeight:'bold'} : null}>No</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                :
                null
            }
            {
                estate ?
                <View style={styles.eachOption}>
                    <Text style={styles.fieldText}>Estate Name?</Text>
                    <TextInput style={styles.input} value={estateName} placeholder='eg. County Estate' onChangeText={(val) => setEstateName(val)}/>
                </View>
                :
                null
            }
            {
                streetName && streetNo ?
                <View style={styles.eachOption}>
                    <Text style={styles.fieldText}>Country</Text>
                    <DropDownPicker
                      open={countryOpen}
                      value={countryId}
                      items={countryList}
                      setOpen={setCountryOpen}
                      setValue={setCountryId}
                      setItems={setCountryList}
                      onSelectItem={(item) => {
                        setCountry(item.label)
                        setStateId(null)
                      }}
                    />
                </View>
                :
                null
            }
            {
                country && streetName && streetNo ?
                <View style={styles.eachOption}>
                    <Text style={styles.fieldText}>State</Text>
                    <DropDownPicker
                        searchable={true}
                      loading={loading}
                      open={stateOpen}
                      value={stateId}
                      items={stateList}
                      setOpen={setStateOpen}
                      setValue={setStateId}
                      setItems={setStateList}
                      onSelectItem={(item) => {
                        setState(item.label)
                        setLgaId(null)
                      }}
                    />
                </View>
                :
                null
            }
            {
                country && streetName && streetNo && stateId ?
                <View style={styles.eachOption}>
                    <Text style={styles.fieldText}>LGA</Text>
                    <DropDownPicker
                        searchable={true}
                      loading={loading}
                      open={lgaOpen}
                      value={lgaId}
                      items={lgaList}
                      setOpen={setLgaOpen}
                      setValue={setLgaId}
                      setItems={setLgaList}
                      onSelectItem={(item) => {
                        setLga(item.label)
                      }}
                    />
                </View>
                :
                null
            }
            {
                stateId && country && streetName && streetNo && lgaId && !isPending ?
                <TouchableOpacity onPress={updateAddress}>
                    <View style={{ backgroundColor:colors.purple,width:'100%',padding:10,borderRadius:20,marginVertical:10 }}>
                        <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Update address</Text>
                    </View>
                </TouchableOpacity>
                :
                <View style={{ backgroundColor:colors.lightPurple,width:'100%',padding:10,borderRadius:20,marginVertical:10 }}>
                    {
                        isPending
                        ?
                            <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
                        :
                            <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Update address</Text>
                            
                    }
                </View>
            }
        </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
    container:{
        marginVertical:20,
        padding:20
    },
    text:{
        fontFamily:'viga',
        fontSize:20,
        textAlign:'center',
    },
    fieldText:{
        fontSize:16,
        marginBottom:10,
        fontWeight:'bold'
    },
    input: {
        borderWidth: 2,
        padding:5,
        paddingHorizontal:10,
        borderColor:colors.darkPurple,
        borderRadius:10
    },
    eachOption: {
        marginVertical:10
    },
    lottie: {
        width: 100,
        height: 100
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
})