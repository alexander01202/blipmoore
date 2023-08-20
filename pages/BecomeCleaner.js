import React, { useEffect } from 'react'
import { useState } from 'react'
import { Text, View,StyleSheet,TouchableWithoutFeedback, ActivityIndicator,SafeAreaView,TouchableOpacity,ScrollView,Modal,Dimensions, TouchableNativeFeedback, Linking } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../colors/colors'
import SelectDropdown from 'react-native-select-dropdown'
import { BarIndicator } from 'react-native-indicators';
import { useSelector } from 'react-redux'
import MyModal from '../components/modal'
import { useDispatch } from 'react-redux'
import { Ionicons,FontAwesome } from '@expo/vector-icons';
import AnimatedLoader from "react-native-animated-loader";
import { AllKeys } from '../keys/AllKeys'
import { showMessage } from 'react-native-flash-message'
import WarningModal from '../components/WarningModal'
import moment from 'moment'
// import { VERIFY_NIN_TEST_SECRET_KEY,VERIFY_NIN_LIVE_SECRET_KEY } from '@env'

const {width,height} = Dimensions.get('window')
export default function BecomeCleaner({ navigation }) {
    const [nin,setNin] = useState('')
    const [isPending,setIsPending] = useState(false)
    const [error, setError] = useState({ text:'',nin:false,birthYear:false,birthMonth:false,birthDay:false,accountName:false,bankName:false,accountNumber:false })
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showBankInput,setShowBankInput] = useState(false)
    const [bankNameList,setBankNameList] = useState([])
    const [bankModalVisible, setBankModalVisible] = useState(false);
    const [birthInfo,setBirthInfo] = useState({birthYear : '', birthMonth:'',birthDay: ''})
    const [bvnBirthInfo, setBvnBirthInfo] = useState(false)
    const [accountName,setAccountName] = useState(null)
    const [bankName,setBankName] = useState(null)
    const [bvn,setBvn] = useState(null)
    const [accountNumber,setAccountNumber] = useState('')
    const [bankCode,setBankCode] = useState(null)
    const [loadingBankInfo,setLoadingBankInfo] = useState(false)
    const { id,displayName,lastName } = useSelector(state => state.login)
    const [loginIsPending,setLoginIsPending] = useState(false)
    const dispatch = useDispatch()
    const [loginWorkersVisible,setLoginWorkersVisible] = useState(false)
    const year = ["1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972",'1973', "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004"]
    const month = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']

    const { width,height } = Dimensions.get('window')
    useEffect(() => {
      setBankNameList([])
      const getBanks = async() => {
        const banks = await fetch('https://vapi.verifyme.ng/v1/bvn-nuban/banks', {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
          }
        })
        const bankListRes = await banks.json()
        var arr = []
        bankListRes.data.map(bankList => {
          arr.push(bankList.name)
        })
        setBankNameList(arr)
      }
      getBanks()
    }, [])
    
    const updateBirthInfo = (selectedItem, option) => {
      if (option === 'year') {
        setBirthInfo(prevEvents => { return {...prevEvents, birthYear: selectedItem} }) 
        setError(prevEvents => {
          return {...prevEvents, birthYear:false, text:''}
        })
        return
      }
      if (option === 'month') {
        setBirthInfo(prevEvents => { return {...prevEvents, birthMonth: selectedItem} })
        setError(prevEvents => {
          return {...prevEvents, birthMonth:false, text:''}
        })
        return 
      }
      if (option === 'day') {
        setBirthInfo(prevEvents => { return {...prevEvents, birthDay: selectedItem} }) 
        setError(prevEvents => {
          return {...prevEvents, birthDay:false, text:''}
        })
        return
      }
    }
    const registerCleaner = async({ birthYear,birthMonth,birthDay }) => {
      setShowWarningModal(false)
      setError({ text:'',nin:false,birthYear:false,birthMonth:false,birthDay:false,accountName:false,bankName:false,accountNumber:false })
      if (!birthYear || birthYear === ''  ) {
        setError(prevEvents => {
          return {...prevEvents, birthYear:true, text:'Invalid Birth Year'}
        })
        return
      }
      if (!birthMonth || birthMonth === '') {
        setError(prevEvents => {
          return {...prevEvents, birthMonth:true, text:'Invalid Birth Month'}
        })
        return
      }
      if (birthDay === '' || !birthDay) {
        setError(prevEvents => {
          return {...prevEvents, birthDay:true, text:'Invalid Birth Day'}
        })
        return
      }
      if (!bankName || bankName === '') {
        setError(prevEvents => {
          return {...prevEvents, bankName:true, text:'Invalid Bank Name'}
        })
        setBankModalVisible(true)
        return
      }
      if (!accountNumber || accountNumber === '' ) {
        setError(prevEvents => {
          return {...prevEvents, accountNumber:true, text:'Invalid Bank Number'}
        })
        setBankModalVisible(true)
        return
      }
      if (!accountName || accountName === '') {
        setError(prevEvents => {
          return {...prevEvents, accountName:true, text:'Invalid Account Name'}
        })
        setBankModalVisible(true)
        return
      }
      if (!moment(bvnBirthInfo, "DD-MMM-YYYY").isSame(moment(birthDay + '-' + birthMonth + '-' + birthYear, "DD-MMMM-YYYY"))) {
        showMessage({
         type:'danger',
         message:'Wrong date of birth',
         description:"Your date of birth registered with your bank account isn't the same as the inputted date of birth",
         duration:5000
        }) 
        return
      }
      if (birthMonth === 'January') {
        birthMonth = '01'
      }else if (birthMonth === 'February') {
        birthMonth = '02'
      }else if (birthMonth === 'March') {
        birthMonth = '03'
      }else if (birthMonth === 'April') {
        birthMonth = '04'
      }else if (birthMonth === 'May') {
        birthMonth = '05'
      }else if (birthMonth === 'June') {
        birthMonth = '06'
      }else if (birthMonth === 'July') {
        birthMonth = '07'
      }else if (birthMonth === 'August') {
        birthMonth = '08'
      }else if (birthMonth === 'September') {
        birthMonth = '09'
      }else if (birthMonth === 'October') {
        birthMonth = '10'
      }else if (birthMonth === 'November') {
        birthMonth = '11'
      }else if (birthMonth === 'December') {
        birthMonth = '12'
      }
      var FullBirthInfo =  birthDay + '-' + birthMonth + '-' + birthYear
      setIsPending(true)
      if (nin != '' || nin) {
        const req = await fetch(`${AllKeys.ipAddress}/getCleanerLocation?id=${id}`)
        const { success } = await req.json()
        if (success) {
          setIsPending(false)
          showMessage({
            type:'danger',
            message:'Already registered',
            description:'Please download the blipmoore cleaner app to continue'
          })
          return
        }
        // const getBvn = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks/${bankCode}/account/${accountNumber}`, {
        //   method: 'GET',
        //   headers:{
        //     'Authorization':`Bearer ${AllKeys.verifyNINKey}`
        //   }
        // })
        // setIsPending(false)
        // const response = await getBvn.json()
        const res = await fetch(`${AllKeys.ipAddress}/registerCleaner?bvn=${bvn}&nin=${nin}&birthinfo=${FullBirthInfo}&id=${id}&bankname=${bankName}&accountName=${accountName}&banknumber=${accountNumber}`)
        const response = await res.json()
        if (response.success) {
          setIsPending(false)
          dispatch({ type:'CHANGE_ROLE',payload:{ role:'worker' } })
          showMessage({
            type:'success',
            message:'Registration Successful',
            description:'Registered Successfully. Download our cleaner app to start recieving orders.'
          })
          setTimeout(() => {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.blipmoore.blipmoore_cleaner')
          }, 1000);
        }else {
          setIsPending(false)
          if (response.message === 'duplicate') {
            showMessage({
              type:'danger',
              message:'Already registered',
              description:'Please download the blipmoore cleaner app to continue'
            })
            setTimeout(() => {
              Linking.openURL('https://play.google.com/store/apps/details?id=com.blipmoore.blipmoore_cleaner')
            }, 500);
          }else{
            setModalVisible({
              show:true,
              text:'Please try again Later'
            }) 
          }
        }
      }else{
        setIsPending(false)
        setError(prevEvents => {
          return {...prevEvents, nin:true, text:'Invalid NIN'}
        })
        return
      }
    }
    const changeModal = () => {
      setModalVisible({
        show:false,
        text: ''
      })
    }
    const changeBankName = async(val) => {
      setBankName(val)
      if (error.bankName) {
        setError(prevEvents => {
          return {...prevEvents, bankName:false}
        }) 
      }
      const banks = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks`, {
        method:'GET',
        headers:{
          'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
        }
      })
      const bankListRes = await banks.json()
      bankListRes.data.map(async(bankList) => {
        if (bankList.name === val) {
          setBankCode(bankList.code)
          if (accountNumber.length === 10 && bankList.code) {
            setLoadingBankInfo(true)
            const verifyAccount = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks/${bankList.code}/account/${accountNumber}`, {
              method:'GET',
              headers:{
                'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
              }
            })
            const { status,data } = await verifyAccount.json()
            setLoadingBankInfo(false)
            if (status === 'success' && data) {
              setBvnBirthInfo(data.birthdate)
              setBvn(data.bvn)
              setAccountName(data.lastname + ' ' + data.firstname + ' ' + data.middlename) 
              setBankModalVisible(false) 
            }else{
              setAccountNumber('')
              setAccountName('')
              setError(prevEvents => {
                return {...prevEvents, accountNumber:true, text:'Wrong account details'}
              }) 
            }
          }
        }
      })
    }
    const changeBankNumber = async(val) => {
      setAccountNumber(val)
      if (error.accountNumber) {
        setError(prevEvents => {
          return {...prevEvents, accountNumber:false}
        }) 
      }
      if (val.length === 10 && bankCode) {
        setLoadingBankInfo(true)
        const verifyAccount = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks/${bankCode}/account/${val}`, {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
          }
        })
        const {status,data} = await verifyAccount.json()
        setLoadingBankInfo(false)
        if (status === 'success' && data) {
          setBvnBirthInfo(data.birthdate)
          setBvn(data.bvn)
          setAccountName(data.lastname + ' ' + data.firstname + ' ' + data.middlename) 
          setBankModalVisible(false) 
        }else{
          setAccountNumber('')
          setAccountName('')
          setError(prevEvents => {
            return {...prevEvents, accountNumber:true, text:'Wrong account details'}
          })
        }
      }
    }
    const changeAccountName = (val) => {
      setAccountName(val)
      if (error.accountName) {
        setError(prevEvents => {
          return {...prevEvents, accountName:false}
        }) 
      }
    }
    const changeBankModal = () => {
      setBankModalVisible(!bankModalVisible)
    }
    const loginUser = async() => {
      setLoginIsPending(true)
      const res = await fetch(`${AllKeys.ipAddress}/fetchCleaner?id=${id}`)
      const {success,rows} = await res.json()

      if (success) {
        setLoginIsPending(false)
        dispatch({ type:'CHANGE_ROLE',payload:{ role:'worker' } })
      }else{
        setLoginIsPending(false)
        setModalVisible({
          show:true,
          text:'Please Sign Up'
        })
      }
    }
    const declineRegister = () => {
      setShowWarningModal(false)
    }
  return (
    <>
      <WarningModal positive={'Yes, submit'} negative={'Cancel'} title='Are you sure all details are correct?' showModal={showWarningModal} acceptFunction={() => registerCleaner(birthInfo)} declineFunction={declineRegister} />
      <MyModal changeModal={changeModal} modalVisible={modalVisible}/>
      <ScrollView>
      <SafeAreaView style={{ flex:1,alignItems:'center',marginTop:20 }}>
        <Modal
          animationType="slide"
          style={{ justifyContent:'center' }}
          visible={bankModalVisible}
          onRequestClose={() => setBankModalVisible(false)}
        >
        <View style={{ alignItems:'center',marginVertical:height > 768 ? 40 : null }}>
          <View style={styles.parentView}>
            <Text style={styles.text}>BANK NAME</Text>
            {
              showBankInput ?
              <TextInput value={bankName} placeholder='Please Enter Your Bank Name' onChangeText={(val) => changeBankName(val)} style={error.bankName ? {...styles.input, borderColor:'red'} : styles.input}/>
              :
              <>
                <SelectDropdown searchPlaceHolder={'Search for your bank'} renderSearchInputLeftIcon={() => <FontAwesome name={'search'} color={colors.purple} size={18} />} dropdownStyle={{ borderRadius:10,marginTop:5 }} searchPlaceHolderColor={colors.black} search={true} defaultValue={bankName} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%',borderRadius:10 }} rowStyle={{ width:'100%' }} data={bankNameList} onSelect={(selectedItem, index) => { changeBankName(selectedItem) }} />
                {error.bankName && <Text style={styles.error}>{error.text}</Text>}
                <TouchableOpacity onPress={() => setShowBankInput(true)}>
                  <Text style={{ color:'blue',textDecorationLine:'underline',fontSize:12,marginTop:5 }}>Your Bank not on this list?</Text>
                </TouchableOpacity>
              </>
            }
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>ACCOUNT NUMBER</Text>
            <TextInput maxLength={10} value={accountNumber} placeholder='Please Enter Your Account Number' onChangeText={(val) => changeBankNumber(val)} keyboardType='number-pad' style={error.bankNumber ? {...styles.input, borderColor:'red'} : styles.input}/>
            {error.accountNumber && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <View style={styles.parentView}>
            <View style={{ flexDirection:'row' }}>
              <Text style={{...styles.text, marginRight:5}}>ACCOUNT NAME</Text>
              {loadingBankInfo ? <ActivityIndicator size={'small'} color={colors.green}/> : null }
            </View>
            <TextInput value={accountName} editable={showBankInput ? true : false} placeholder={loadingBankInfo ? 'Verifying... Please wait' : 'Fill in the fields above first'} onChangeText={(val) => changeAccountName(val)} style={error.accountName ? {...styles.input, borderColor:'red'} : styles.input}/>
            {error.accountName && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <TouchableOpacity onPress={() => setBankModalVisible(!bankModalVisible)}>
            <View style={{...styles.button, paddingHorizontal:30}}>
              <Text style={{...styles.text,color:colors.white}}>Add Bank Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setBankModalVisible(!bankModalVisible)}>
            <View style={{ marginVertical:10 }}>
              <Text style={{ color:colors.purple }}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
        </Modal>
          <View style={styles.parentView}>
            <Text style={styles.text}>NIN</Text>
            <TextInput keyboardType='number-pad' placeholder='Please Provide Your NIN' onChangeText={(val) => setNin(val)} value={nin} maxLength={11} style={error.nin ? {...styles.input, borderColor:'red',backgroundColor:'pink'} : styles.input}/>
            {error.nin && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>Birth Year</Text>
            <SelectDropdown buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%',borderRadius:10 }} rowStyle={{ width:'100%' }} data={year} onSelect={(selectedItem, index) => { updateBirthInfo(selectedItem, 'year') }} />
            {error.birthYear && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>Birth Month</Text>
            <SelectDropdown buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%',borderRadius:10 }} rowStyle={{ width:'100%' }} data={month} onSelect={(selectedItem, index) => { updateBirthInfo(selectedItem, 'month') }} />
            {error.birthMonth && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>Birth Day</Text>
            <SelectDropdown buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%',borderRadius:10 }} rowStyle={{ width:'100%' }} data={day} onSelect={(selectedItem, index) => { updateBirthInfo(selectedItem, 'day') }} />
            {error.birthDay && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <TouchableNativeFeedback onPress={() => setBankModalVisible(!bankModalVisible)}>
            <View style={{ ...styles.parentView,borderRadius:10, backgroundColor:'#f0f8ff',height:100,flexDirection:'row',padding:10,elevation:3,shadowOffset: { width: 2, height: 2},shadowOpacity: 0.2 }}>
              <View>
                <Ionicons name="add" size={24} color="black" />
              </View>
              <View style={{ margin:3 }}>
                {  bankName && bankName.length > 0 
                  ? 
                  <>
                    <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{accountName}</Text>
                    <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{bankName}</Text>
                    <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{accountNumber}</Text>
                  </>
                  : 
                  <Text>Add Bank Account</Text>
                }
              </View>
            </View>
          </TouchableNativeFeedback>
          <View style={{ marginTop:20,width:'70%' }}>
            
            {
              isPending ? 
              <AnimatedLoader 
                visible={isPending}
                overlayColor="rgba(0,0,0,0.75)"
                source={require('../lottie/circle2.json')}
                animationStyle={styles.lottie}
                speed={1}
              />
            : 
            bankName && accountName && accountNumber && nin && nin.length > 10 && birthInfo.birthDay && birthInfo.birthMonth && birthInfo.birthYear
            ?
              <TouchableNativeFeedback style={{ alignItems:'center' }} onPress={() => setShowWarningModal(true)}>
                <View style={{...styles.button}}>
                      <Text style={{ color:colors.white,textAlign:'center' }}>SUBMIT APPLICATION</Text>
                </View>
              </TouchableNativeFeedback>
            :
              <View style={{...styles.button, opacity:0.6}}>
                <Text style={{ color:colors.white,textAlign:'center' }}>SUBMIT APPLICATION</Text>
              </View>
            }
            
            {
              loginIsPending ? <ActivityIndicator size={'large'} color={colors.yellow}/> : 
              <TouchableNativeFeedback onPress={() => loginUser()}>
                <View style={{ justifyContent:'center',alignItems:'center',marginVertical:20 }}>
                  <Text style={{ color:'blue',textDecorationLine:'underline' }}>Already a cleaner ?</Text>
                </View>
              </TouchableNativeFeedback>
            }
          </View>  
      </SafeAreaView>
      </ScrollView>
    </>  
  )
}

const styles = StyleSheet.create({
  input:{
    backgroundColor:"#c4c4c4",
    borderRadius:10,
    padding:width > 375 ? 15 : 10,
    fontFamily:'viga',
    color:colors.black,
    width:'100%'
  },
    parentView:{
      width:'80%',
      marginVertical:15
    },
    text:{
      fontSize:16,
      fontFamily:'viga'
    },
    button: {
      backgroundColor:colors.black,
      borderRadius:5,
      padding:10
    },
    error:{
      fontSize:12,
      color:'red'
    },
    lottie:{
      width:100,
      height:100
    }
})
