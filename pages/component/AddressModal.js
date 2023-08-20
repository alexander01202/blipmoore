import { View, Text, Modal, TextInput,StyleSheet, TouchableOpacity, BackHandler, Linking, TouchableNativeFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import Progress from 'react-native-progress/Bar';
import { AllKeys } from '../../keys/AllKeys'
import * as Location from 'expo-location';
import { colors } from '../../colors/colors';
import { BarIndicator } from 'react-native-indicators';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ADDRESS, LOCATION } from '../../redux/actions/actions';
import { showMessage } from 'react-native-flash-message';
import AnimatedLoader from 'react-native-animated-loader';
import LottieView from 'lottie-react-native';

export default function AddressModal({ showAddressModal,changeAddressModal,updateApp }) {
    const [settingsModal, setSettingModal] = useState(false)
    const [progress, setProgress] = useState(0.35)
    const [refetchLoc, setRefetchLoc] = useState(false)
    const [stateOpen, setStateOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [lgaOpen, setLgaOpen] = useState(false);
    const [state, setState] = useState(null);
    const [stateId, setStateId] = useState(null);
    const [country, setCountry] = useState(null);
    const [countryId, setCountryId] = useState(null);
    const [estate, setEstate] = useState('')
    const [lga, setLga] = useState('');
    const [lgaId, setLgaId] = useState(null);
    const [streetNo, setStreetNo] = useState(null)
    const [streetName, setStreetName] = useState(null)
    const [city, setCity] = useState(null)
    const [loading, setLoading] = useState(false);
    const [isPending, setIsPending] = useState(false)
    const { id } = useSelector(state => state.login) 
    const [steps, setSteps] = useState({ one:true,two:false,three:false })
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
    
    const backHandler = () => {
        if (steps.two) {
            setProgress(0.35)
            setSteps({ one:true,two:false,three:false })
        }else if (steps.three) {
            setProgress(0.7)
            setSteps({ one:false,two:true,three:false })
        }else{
            BackHandler.exitApp()
        }
    }
    useEffect(() => {
        const getUserLocations = async() => {
        setIsPending(true)
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted' && !updateApp) {
                setSettingModal(true)
                return
            }
            let { latitude,longitude } = (await Location.getCurrentPositionAsync({})).coords;
            const address = await Location.reverseGeocodeAsync({latitude,longitude})
            const { city,country,streetNumber,street,region } = address[0]
            setCity(city)
            setCountry(country)
            setStreetNo(streetNumber)
            setStreetName(street)
            setState(region)
          } catch (err) {
            showMessage({
              type:'danger',
              message:'Error',
              description:'Please enable your location for us to serve you better'
            })
            // setRefetchLoc(!refetchLoc)
          }
          setIsPending(false)
        }
        getUserLocations()
    }, [refetchLoc])
    
    const updateAddress = async() => {
        setIsPending(true)
        var rows = {
            street_number:streetNo,
            street_name:streetName,
            estate,
            lga,
            city,
            state,
            country
        }
        dispatch(ADDRESS(rows))
        var fullAddress = `${streetNo} ${streetName} ${city} ${state} ${country}`
        var lat = await Location.geocodeAsync(fullAddress)
        const { latitude,longitude } = lat[0]
        dispatch(LOCATION(latitude,longitude)) 
        fetch(`${AllKeys.ipAddress}/updateLocation?latitude=${latitude}&longitude=${longitude}&id=${id}`)
        fetch(`${AllKeys.ipAddress}/insertAddress?userid=${id}&estate=${estate}&city=${city}&number=${streetNo}&streetName=${streetName}&lga=${lga}&state=${state}&country=${country}`)
        setIsPending(false)
        changeAddressModal()
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
    <>
    <Modal
        visible={settingsModal}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setSettingModal(false)}
    >
        <View style={{...styles.centeredView, backgroundColor:'rgba(0,0,0,0.5)'}}>
            <View style={styles.modalView}>
                <Text style={{ textAlign:'center' }}>Please allow location for our app through the settings</Text>
                <View style={{ marginVertical:10 }}>
                    <Text style={{ fontWeight:'bold',fontSize:12,textAlign:'center' }}>Permissions > Location > Allow while using app</Text>
                </View>
                <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                    <TouchableNativeFeedback onPress={() => Linking.openSettings()}>
                        <View style={{ backgroundColor:colors.purple,padding:10,margin:10,borderRadius:5 }}>
                            <Text style={{ color:colors.white,fontFamily:'viga' }}>Open Settings</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => setSettingModal(false)}>
                        <View style={{ backgroundColor:colors.grey,padding:10,margin:10,borderRadius:5 }}>
                            <Text style={{ color:colors.black }}>Close</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </View>
    </Modal>
    <Modal
        visible={showAddressModal}
        statusBarTranslucent={true}
        onRequestClose={backHandler}
    >
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}} extraScrollHeight={100} enableOnAndroid={true}>
        <View style={styles.container}>
            <Text style={{ ...styles.text, marginBottom:30 }}>Please enter your address 🏡</Text>
            <Progress progress={progress} style={{ marginBottom:20 }} width={null} borderWidth={1} color={colors.purple} />
            {
                steps.one &&
                <>
                    <View style={styles.eachOption}>
                        <Text style={styles.fieldText}>Street Number:</Text>
                        <View style={{ flexDirection:'row' }}>
                            <TextInput style={styles.input} value={streetNo} placeholder='eg. 1' keyboardType='numeric' onChangeText={(val) => setStreetNo(val)}  />
                            {
                                isPending &&
                                <LottieView 
                                    autoPlay
                                    source={require('../../lottie/circle2.json')}
                                    style={styles.lottie}
                                />
                            }
                        </View>
                    </View>
                    {
                        streetNo ?
                        <View style={styles.eachOption}>
                            <Text style={styles.fieldText}>Street Name.</Text>
                            <View style={{ flexDirection:'row' }}>
                                <TextInput style={styles.input} value={streetName} placeholder='eg. John doe Street' onChangeText={(val) => setStreetName(val)}/>
                                {
                                    isPending &&
                                    <LottieView 
                                        autoPlay
                                        source={require('../../lottie/circle2.json')}
                                        style={styles.lottie}
                                    />
                                }
                            </View>
                        </View>
                        :
                        null
                    }
                     {
                        streetName && streetNo ?
                        <TouchableNativeFeedback onPress={() => {
                            setProgress(0.7)
                            setSteps(preEvents => {
                                return {...preEvents, one:false,two:true}
                            })
                        }}>
                            <View style={styles.button}>
                                <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Proceed</Text>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        <>
                        <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                            <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Proceed</Text>
                        </View>
                        <TouchableOpacity onPress={() => setRefetchLoc(!refetchLoc)}>
                            <Text style={{ fontSize:12,color:colors.purple }}>Get location automatically?</Text>
                        </TouchableOpacity>
                        </>
                    }
                </>
            }
            {
                steps.two &&
                <>
                    {
                        streetName && streetNo ?
                        <View style={styles.eachOption}>
                            <Text style={styles.fieldText}>Country</Text>
                            {
                                country ?
                                <TextInput style={styles.input} value={country} placeholder='eg. Nigeria' onChangeText={(val) => setCountry(val)}  />
                                :
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
                            }
                        </View>
                        :
                        null
                    }
                    {
                        country && streetName && streetNo ?
                        <View style={styles.eachOption}>
                            <Text style={styles.fieldText}>State</Text>
                            {
                                state ?
                                <TextInput style={styles.input} value={state} placeholder='eg. Lagos' onChangeText={(val) => setState(val)}  />
                                :
                                <DropDownPicker
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
                            }
                        </View>
                        :
                        null
                    }
                    {
                        streetName && streetNo && country && state?
                        <TouchableNativeFeedback onPress={() => {
                            setProgress(1)
                            setSteps(preEvents => {
                                return {...preEvents, two:false,three:true}
                            })
                        }}>
                            <View style={styles.button}>
                                <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Proceed</Text>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                            <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Update address</Text>
                        </View>
                    }
                </>
            }
            {
                steps.three &&
                <>
                    {
                        country && streetName && streetNo && state ?
                        <View style={styles.eachOption}>
                            <Text style={styles.fieldText}>City:</Text>
                            <TextInput style={styles.input} value={city} placeholder='name of city, not state' keyboardType='default' onChangeText={(val) => setCity(val)}  />
                        </View>
                        :
                        null
                    }
                    {/* {
                        country && streetName && streetNo && stateId && city ?
                        <View style={styles.eachOption}>
                            <Text style={styles.fieldText}>LGA</Text>
                            <DropDownPicker
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
                    } */}
                    {
                        country && streetName && streetNo && state && city ?
                        <View style={styles.eachOption}>
                            <Text style={styles.fieldText}>Estate<Text style={{ fontSize:10 }}>(optional)</Text>:</Text>
                            <TextInput style={styles.input} value={estate} placeholder='leave empty if you dont live in estate' keyboardType='default' onChangeText={(val) => setEstate(val)}  />
                        </View>
                        :
                        null
                    }
                    {
                        state && country && streetName && streetNo && !isPending ?
                        <TouchableNativeFeedback onPress={updateAddress}>
                            <View style={{ backgroundColor:colors.purple,width:'100%',padding:10,borderRadius:10,marginVertical:10 }}>
                                <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Update address</Text>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        <View style={{ backgroundColor:colors.lightPurple,width:'100%',padding:10,borderRadius:10,marginVertical:10 }}>
                            {
                                isPending
                                ?
                                    <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
                                :
                                    <Text style={{...styles.text, color:colors.white,fontSize:16 }}>Update address</Text>

                            }
                        </View>
                    }
                </>
            }
        </View>
        </KeyboardAwareScrollView>
    </Modal>
    </>
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
        borderRadius:10,
        width:'100%'
    },
    eachOption: {
        marginVertical:10
    },
    button:{
        backgroundColor:colors.purple,
        width:'100%',
        padding:10,
        borderRadius:10,
        marginVertical:10
    },
    centeredView: {
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    lottie: {
        position:'absolute',
        alignSelf:'center',
        left:'75%',
        width: 50,
        height: 50
    }
})