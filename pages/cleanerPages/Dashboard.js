import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Text, View,StyleSheet,Dimensions, ActivityIndicator, Button, FlatList, TouchableWithoutFeedback, ScrollView, TextInput,Keyboard } from 'react-native'
import { useSelector } from 'react-redux'
import { colors } from '../../colors/colors'
import { Ionicons } from '@expo/vector-icons';
import HireChargeModal from './components/HireChargeModal'
import { Entypo,FontAwesome5 } from '@expo/vector-icons';
import PaymentModal from '../component/PaymentModal'

const { width,height } = Dimensions.get('window')
export default function Dashboard({ navigation }) {
    const { displayName,id } = useSelector(state => state.login)
    const { orderId,active,address,number } = useSelector(state => state.cleanerOrder)
    const [orderLists,setOrderList] = useState(null)
    const [isPending,setIsPending] = useState(true)
    const [isRefreshing,setIsRefreshing] = useState(true)
    const [dailyEarnings,setDailyEarnings] = useState(0)
    const [monthlyEarnings,setMonthlyEarnings] = useState(0)
    const [weeklyEarnings,setWeeklyEarnings] = useState(0)
    const [subCount,setSubCount] = useState(0)
    const [hireModalVisible,setHireModalVisible] = useState(false)
    const [invoice,setInvoice] = useState(null)
    const [starReview,setStarReview] = useState(0)
    const [activeOrder,setActiveOrder] = useState(null)
    const [showPaymentModal,setShowPaymentModal] = useState(false)
    const [bankEdit,setBankEdit] = useState({ Aname:false,Anumber:false,Bname:false })
    const [bankInfo,setBankInfo] = useState({ AccountName:null,AccountNumber:null,BankName:null })
    const star = []
    for (let i = 0; i < 5; i++) {
        star.push(i)
    }

    useEffect(async() => {
        setShowPaymentModal(false)
        setActiveOrder(null)
        const getBankinfo = await fetch(`http://192.168.100.12:19002/getBankInfo?id=${id}`)
        const { rows } = await getBankinfo.json();
        setBankInfo({ AccountName:rows.account_name,AccountNumber:rows.account_number,BankName:rows.bank_name })
        if (active) {
            const fetchActiveOrder = await fetch(`http://192.168.100.12:19002/fetchActiveOrder?orderId=${orderId}`)
            const activeOrder = await fetchActiveOrder.json()

            setActiveOrder(activeOrder.rows)
        }
        const fetchAllOrders = async() => {
            const res = await fetch(`http://192.168.100.12:19002/fetchCleanerOrders?cleanerId=${id}`)
            const orders = await res.json()

            const fetchCleanerInfo = await fetch(`http://192.168.100.12:19002/fetchCleaner?id=${id}`)
            const { rows } = await fetchCleanerInfo.json()

            const fetchCleanerSubscription = await fetch(`http://192.168.100.12:19002/fetchCleanerSubscription?id=${id}`)
            const { subs } = await fetchCleanerSubscription.json()

            const currentDate = new Date().getTime();
            const oneDayAwayDate = currentDate - 86400000
            const oneMonthAwayDate = currentDate - 2629800000
            const oneWeekAwayDate = currentDate - 604800000
            var months = 0
            var weeks = 0
            var days = 0
            for (let i = 0; i < orders.rows.length; i++) {
                if ((orders.rows[i].date_ordered > oneMonthAwayDate) && orders.rows[i].state !== 'declined') {
                    months = months + Number(orders.rows[i].amount)
                }
                if (orders.rows[i].date_ordered > oneWeekAwayDate && orders.rows[i].state !== 'declined') {
                    weeks = weeks + Number(orders.rows[i].amount)
                }
                if (orders.rows[i].date_ordered > oneDayAwayDate && orders.rows[i].state !== 'declined') {
                    days = days + Number(orders.rows[i].amount)
                }
            }
            setInvoice(rows.invoice)
            if (Number(rows.invoice) >= 1000) {
                setShowPaymentModal(true)
            }
            setSubCount(subs)
            setStarReview(Number(rows.rating))
            setMonthlyEarnings(months)
            setWeeklyEarnings(weeks)
            setDailyEarnings(days)
            setIsPending(false)
            setIsRefreshing(false)
            setOrderList(orders)
        }
        fetchAllOrders()
    }, [])
    const fetchSomeOrders = async() => {
        setShowPaymentModal(false)
        setIsRefreshing(true)
        
        const res = await fetch(`http://192.168.100.12:19002/fetchCleanerOrders?cleanerId=${id}`)
        const orders = await res.json()

        const fetchCleanerInfo = await fetch(`http://192.168.100.12:19002/fetchCleaner?id=${id}`)
        const { rows } = await fetchCleanerInfo.json()

        const fetchCleanerSubscription = await fetch(`http://192.168.100.12:19002/fetchCleanerSubscription?id=${id}`)
        const { subs } = await fetchCleanerSubscription.json()

        const currentDate = new Date().getTime();
        const oneDayAwayDate = currentDate - 86400000
        const oneMonthAwayDate = currentDate - 2629800000
        const oneWeekAwayDate = currentDate - 604800000
        var months = 0
        var weeks = 0
        var days = 0
        
        for (let i = 0; i < orders.rows.length; i++) {
            if ((orders.rows[i].date_ordered > oneMonthAwayDate) && orders.rows[i].state !== 'declined') {
                months = months + Number(orders.rows[i].amount)
            }
            if (orders.rows[i].date_ordered > oneWeekAwayDate && orders.rows[i].state !== 'declined') {
                weeks = weeks + Number(orders.rows[i].amount)
            }
            if (orders.rows[i].date_ordered > oneDayAwayDate && orders.rows[i].state !== 'declined') {
                days = days + Number(orders.rows[i].amount)
            }
        }
        setInvoice(rows.invoice)
        if (Number(rows.invoice) >= 1000) {
            setShowPaymentModal(true)
        }
        setSubCount(subs)
        setStarReview(Number(rows.rating))
        setMonthlyEarnings(months)
        setWeeklyEarnings(weeks)
        setDailyEarnings(days)

        setIsRefreshing(false)
        setOrderList(orders)
    }
    const changeHireModal = (val) => {
        setHireModalVisible(val)
    }
    const UpdateOrder = async(orderId) => {
        setIsPending(true)
        const update = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=completed&id=${orderId}&cleanerId=${id}`)
        const response = await update.json()
        fetchSomeOrders()
        setIsPending(false)
    }
    const changePaymentModal = () => {
        setShowPaymentModal(!showPaymentModal)
    }
    const updateAnumber = (val) => {
        setBankInfo(preEvent => { 
            return {...preEvent, AccountNumber:val } 
        })
    }
    const updateAname = (val) => {
        setBankInfo(preEvent => { 
            return {...preEvent, AccountName:val } 
        })
    }
    const updateBname = (val) => {
        setBankInfo(preEvent => { 
            return {...preEvent, BankName:val } 
        })
    }
    const changeBankInfo = () => {
        fetch(`http://192.168.100.12:19002/updateBankInfo?id=${id}&accountName=${bankInfo.AccountName}&accountNumber=${bankInfo.AccountNumber}&bankName=${bankInfo.BankName}`)
    }
  return (
    <>
    <PaymentModal amount={invoice} navigation={navigation} changePaymentModal={changePaymentModal} showPaymentModal={showPaymentModal} />
    <HireChargeModal hireModalVisible={hireModalVisible} id={id} changeHireModal={changeHireModal}/>
    <View style={{ flex:1,alignItems:'center',marginTop:15 }}>
    <View style={{ width:'100%' }}>
    <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ alignItems:'center',alignSelf:'center',flexDirection:'row' }}
    >
        <View style={styles.cards}>
            <View style={styles.eachInfo}>
                <Text style={{ ...styles.text,fontSize: 20,width:'65%' }} numberOfLines={1} >Hi, {displayName}</Text>
                <View style={{ justifyContent:'flex-end',flex:1,width:'100%' }}>
                    <Text style={{ ...styles.text,fontSize: 16,alignSelf:'flex-end' }} numberOfLines={1} >N{dailyEarnings}.00</Text>
                </View>
            </View>
            <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:0.5,marginBottom:10 }} />
            <View style={styles.eachInfo}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Monthly Earnings:</Text>
                <View style={{ justifyContent:'flex-end',flex:1 }}>
                    <Text style={{...styles.text,...styles.smallText}}>N{monthlyEarnings}</Text>
                </View>
            </View>
            <View style={styles.eachInfo}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Weekly Earnings:</Text>
                <View style={{ justifyContent:'flex-end',flex:1 }}>
                    <Text style={{...styles.text,...styles.smallText}}>N{weeklyEarnings}</Text>
                </View>
            </View>
            <View style={styles.eachInfo}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Invoice:</Text>
                <View style={{ justifyContent:'flex-end',flex:1 }}>
                    <Text style={{...styles.text,...styles.smallText}}>N{invoice}</Text>
                </View>
            </View>
            <View style={styles.eachInfo}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Subscribers:</Text>
                <View style={{ justifyContent:'flex-end',flex:1 }}>
                    <Text style={{...styles.text,...styles.smallText}}>{subCount}</Text>
                </View>
            </View>
            <View style={{ ...styles.eachInfo,flex:1 }}>
                <View style={{ flex:1,justifyContent:'flex-end' }}>
                    <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Ratings:</Text>
                </View>
                <View style={{ justifyContent:'flex-end',flex:1 }}>
                    <View style={{ flexDirection:'row',alignSelf:'flex-end',marginVertical:5 }}>
                    {
                    star.map((item,index) => (
                        <Entypo name="star" size={12} style={ starReview >= 1 && index + 1 === 1 ? { color:'gold',letterSpacing:4 } : starReview >= 20 && index + 1 === 2 ? { color:'gold',letterSpacing:4 } : starReview >= 40 && index + 1 === 3 ? { color:'gold',letterSpacing:4 } : starReview >= 60 && index + 1 === 4 ? { color:'gold',letterSpacing:4 } : starReview >= 80 && index + 1 === 5 ? { color:'gold',letterSpacing:4 } :{ color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                    ))   
                    }
                    </View>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={() => setHireModalVisible(!hireModalVisible)}>
            <View style={styles.eachInfo}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Add Your Hire charge:</Text>
                <View style={{ justifyContent:'flex-end',flex:1 }}>
                    <Ionicons name="add" size={width > 598 ? 22 : 18} style={{ backgroundColor:'#f0f8ff',alignSelf:'flex-end' }} color="black" />
                </View>
            </View>
            </TouchableWithoutFeedback>
        </View>
        <View style={{...styles.cards, marginRight:250}}>
            <View style={styles.eachInfo}>
                <Text style={{ ...styles.text,fontSize: 20,width:'65%' }} numberOfLines={1} >Edit Bank Account</Text>
            </View>
            <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:0.5,marginBottom:10 }} />
            <View style={{...styles.eachInfo, marginVertical:10}}>
                {
                    bankEdit.Aname
                    ?
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <TextInput onSubmitEditing={() => {setBankEdit(preEvent => { return {...preEvent, Aname:false} }), changeBankInfo()}} autoFocus style={styles.input} value={bankInfo.AccountName} onChangeText={(val) => updateAname(val)} />
                    </View>
                    :
                    <>
                        <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Account Name:</Text>
                        <View style={{ flex:1,alignItems:'flex-end' }}>
                            <View style={{ justifyContent:'flex-end',position:'absolute',width:'80%' }}>
                                <Text style={{...styles.text,...styles.smallText}} numberOfLines={1}>{bankInfo.AccountName}</Text>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setBankEdit({ Aname:true,Anumber:false,Bname:false })}>
                            <View style={{ marginHorizontal:5 }}>
                                <FontAwesome5 name="pen" size={12} color={colors.yellow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </>
                }
            </View>
            <View style={{...styles.eachInfo, marginVertical:10}}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Account Number:</Text>
                {
                    bankEdit.Anumber
                    ?
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <TextInput keyboardType='numeric' onSubmitEditing={() => {setBankEdit(preEvent => { return {...preEvent, Anumber:false} }), changeBankInfo()}} autoFocus style={styles.input} value={bankInfo.AccountNumber} onChangeText={(val) => updateAnumber(val)} />
                    </View>
                    :
                    <>
                        <View style={{ justifyContent:'flex-end',flex:1 }}>
                            <Text style={{...styles.text,...styles.smallText}}>{bankInfo.AccountNumber}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setBankEdit({ Aname:false,Anumber:true,Bname:false })}>
                            <View style={{ marginHorizontal:5 }}>
                                <FontAwesome5 name="pen" size={12} color={colors.yellow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </>
                }
            </View>
            <View style={{...styles.eachInfo, marginVertical:10}}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Bank Name:</Text>
                {
                    bankEdit.Bname
                    ?
                        <View style={{ justifyContent:'flex-end',flex:1 }}>
                            <TextInput onSubmitEditing={() => {setBankEdit(preEvent => { return {...preEvent, Bname:false} }), changeBankInfo()}} autoFocus style={styles.input} value={bankInfo.BankName} onChangeText={(val) => updateBname(val)} />
                        </View>
                    :
                    <>
                        <View style={{ justifyContent:'flex-end',flex:1 }}>
                            <Text style={{...styles.text,...styles.smallText}}>{bankInfo.BankName}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setBankEdit({ Aname:false,Anumber:false,Bname:true })}>
                        <View style={{ marginHorizontal:5 }}>
                            <FontAwesome5 name="pen" size={12} color={colors.yellow} />
                        </View>
                        </TouchableWithoutFeedback>
                    </>
                }
            </View>
        </View>
        </ScrollView>
        <Text style={{ alignSelf:'center',fontSize:12,fontFamily:'Murecho' }}>Please scroll &gt;&gt;&gt; to see more options</Text>
        </View>

        <View style={{ bottom:0,marginTop:10 }}>
            {
                activeOrder ?
                <TouchableWithoutFeedback style={{ alignItems:'center' }} onPress={() => navigation.navigate('CleanerMapPreview',{orderId,customerId:activeOrder.customer_id,customerName:activeOrder.customer_name,number,ssa:activeOrder.ssa,msa:activeOrder.msa,lsa:activeOrder.lsa,elsa:activeOrder.elsa,cleaningType:activeOrder.cleaningType,amount:activeOrder.amount,address})}>
                    <View style={{ width:'70%',backgroundColor:colors.yellow,alignItems:'center',justifyContent:'center',height:40,padding:10 }}>
                          <Text style={{ color:colors.white,textTransform:'uppercase' }}>Continue With Order</Text>
                    </View>
                </TouchableWithoutFeedback>
                :
                null
            }
            
        </View>

        <View style={{ marginTop:30,flex:1,width:'90%',padding:10 }}>
            <Text style={{...styles.text,color:colors.black}}>Recent Orders</Text>
            <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:1,marginVertical:10 }} />
            <View style={{ backgroundColor:'#c4c4c4',padding:10,flex:1 }}>
                {/* <View style={{ width:'100%',justifyContent:'center' }}>
                    <Text style={{...styles.text,color:colors.black, fontSize:20,textAlign:'center'}}>No Recent Orders</Text>
                </View> */}
                {isPending ? <ActivityIndicator size={'large'} color={colors.black}/>
                : 
                orderLists &&
                    orderLists.success ?
                    <FlatList 
                        onRefresh={fetchSomeOrders}
                        refreshing={isRefreshing}
                        keyExtractor={(item) => item.id}
                        data={orderLists.rows}
                        renderItem={({ item }) => (
                            <View style={styles.orders}>
                                <View style={{ flexDirection:'row',flex:1 }}>
                                <View style={{ flexDirection:'column' }}>
                                    <Text style={{ ...styles.text,color:colors.black }}>{item.customer_name}</Text>
                                    {item.state !== 'completed' && item.state !== 'declined'  && <View style={{ flexDirection:'column' }}><TouchableWithoutFeedback onPress={() => UpdateOrder(item.id)}><Text style={{...styles.text,color:colors.yellow,fontSize:12,textDecorationLine:'underline'}}>Mark as Complete</Text></TouchableWithoutFeedback></View>}
                                    </View>
                                    <View style={{ flex:1 }}>
                                        <Text style={item.state === 'declined' ? {...styles.text,...styles.smallText,color:'red'} : {...styles.text,...styles.smallText,color:colors.green}  }>N{item.amount}</Text>
                                        
                                        <View style={{ height:'100%',justifyContent:'flex-end' }}>
                                            <Text style={{ ...styles.text,color:colors.black,...styles.smallText }}>{new Date(Number(item.date_ordered)).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Text style={item.state === 'declined' ? { color:'red',fontSize:12 } : { color:colors.green,fontSize:12 }}>{item.state}</Text>
                                </View>
                            </View>
                        )}
                    />
                    : <Text style={{...styles.text,textAlign:'center',fontSize:20,color:colors.black}}>No Orders Yet</Text>
                }
            </View>
        </View>
    </View>
    
    </>
  )
}

const styles = StyleSheet.create({
    cards: {
        backgroundColor:colors.black,
        width:'45%',
        maxWidth:'100%',
        borderColor:colors.yellow,
        borderWidth:2,
        borderRadius:20,
        height:height / 4,
        padding:10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        marginHorizontal:15
    },
    eachInfo:{
        flexDirection:'row',
        marginBottom:2
    },
    text:{
        color:'white',
        letterSpacing:1.1,
        fontFamily:'viga'
    },
    input:{
        fontFamily:'viga',
        fontSize:width > 598 ? 16 : 12,
        borderBottomColor:colors.yellow,
        borderBottomWidth:2,
        color:colors.white,
        width:'60%',
        height:20,
        alignSelf:'flex-end',
        textAlign:'center'
    },
    smallText: {
        alignSelf:'flex-end',
        fontSize:width > 598 ? 16 : 12
    },
    amount: {
        fontSize:12,
    },
    orders: {
        backgroundColor:colors.white,
        width:'100%',
        height:60,
        alignSelf:'center',
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding:5,
        marginVertical:5
    }
    // name:{
    //     fontSize:20,
    //     color:'white',
    //     letterSpacing:1.1,
    //     fontFamily:'viga'
    // }
})
