import React from 'react'
import { useEffect,useRef } from 'react'
import { Button, View,Text,Platform } from 'react-native'
import { useSelector } from 'react-redux'
import * as Location from 'expo-location';
import { useState } from 'react';
import RequestModal from './components/modal';
import { GOOGLE_MAPS_APIKEY } from '../../apikey';
import PaymentModal from '../component/PaymentModal';

export default function RequestPage ({ navigation }) {
    const intervalId = useRef()
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [customerId,setCustomerId] = useState()
    const { id } = useSelector(state => state.login)
    const [showPaymentModal,setShowPaymentModal] = useState(false)
    const [invoice,setInvoice] = useState(null)
    
    useEffect(async() => {
      setShowPaymentModal(false)
        var forwardLatitude
        var backwardLatitude
        var forwardLongitude 
        var backwardLongitude
        const checkInvoice = await fetch(`http://192.168.100.12:19002/getInvoice?cleanerId=${id}&invoice=${1000}`)
        const { success,rows } = await checkInvoice.json()
        if (success) {
          setInvoice(rows.invoice)
          setShowPaymentModal(true)
          return
        }
        intervalId.current = setInterval(async() => {
            const { latitude,longitude } = (await Location.getCurrentPositionAsync({})).coords;
            forwardLatitude = latitude + 0.01
            backwardLatitude = latitude - 0.01
            forwardLongitude = longitude + 0.01
            backwardLongitude = longitude - 0.01
            const date = new Date().getTime() - 86400000
            const res = await fetch(`http://192.168.100.12:19002/fetchOrders?date=${date}&forwardLatitude=${forwardLatitude}&backwardLatitude=${backwardLatitude}&forwardLongitude=${forwardLongitude}&backwardLongitude=${backwardLongitude}`)
            const { rows } = await res.json()
            if (rows !== []) {
                const customerLat = Number(rows.latitude) 
                const customerLng = Number(rows.longitude)
                setCustomerId(rows.customer_id)
                clearInterval(intervalId.current)
                const fetchLoc = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`)
                const locResults = await fetchLoc.json()
                let usersAddressInWords = `NO ${locResults.results[0].formatted_address}`
                console.log(usersAddressInWords)
                setModalVisible({
                    show:true,
                    customerName: rows.firstname,
                    address:usersAddressInWords,
                    ssa:rows.ssa,
                    msa:rows.msa,
                    lsa:rows.lsa,
                    elsa:rows.elsa,
                    amount:rows.amount,
                    number:rows.number,
                    cleaningType:rows.cleaningType,
                    orderId:rows.id
                })
                Notifications.scheduleNotificationAsync({
                  content:{
                    title:`A New Request from ${rows.firstname}`,
                    body:`SSA: ${rows.ssa}, MSA: ${rows.msa}, LSA: ${rows.lsa}, ELSA: ${rows.elsa}`
                  },
                  trigger:{
                    seconds:1
                  }
                })
            }
        }, 10000);
    
      return () => {
        clearInterval(intervalId.current)
      }
    }, [])
    
    
    const stopInterval = () => {
        clearInterval(intervalId.current)
        navigation.pop()
    }
    const changeModal = () => {
        setModalVisible({
          show:false,
          text: ''
        })
    }
    const changePaymentModal = () => {
      setShowPaymentModal(!showPaymentModal)
    }
  return (
    <>
    <PaymentModal amount={invoice} navigation={navigation} changePaymentModal={changePaymentModal} showPaymentModal={showPaymentModal} />
    <RequestModal changeModal={changeModal} customerId={customerId} navigation={navigation} modalVisible={modalVisible} />
    <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
        <Text style={{ fontFamily:'viga',fontSize:20 }}>Listening for Requests....</Text>
        <Text style={{ marginVertical:10 }}>You must click below to stop receiving requests</Text>
        <Button title='Stop Receiving Request' color={'red'} onPress={() => stopInterval(intervalId)} />
    </View>
    </>
  )
}
// const styles = StyleSheet.create({

// })