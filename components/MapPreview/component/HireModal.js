import React, { useState, useEffect }  from 'react';
import { View,StyleSheet,Text, Button, Pressable,Modal,TouchableWithoutFeedback, TextInput,Dimensions} from 'react-native'
import { useDispatch } from 'react-redux';
import { colors } from '../../../colors/colors';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const { width,height } = Dimensions.get('window')
export default function HireModal({ acceptedCleanerId,changeOrderState,hireModalVisible,changeHireModal,navigation,cleanerRating,cleanerFirstname}) {
  const [showReviewPage,setShowReviewPage] = useState(false)
  const { id,displayName } = useSelector(state => state.login)
  const [isPending,setIsPending] = useState(false)
    const dispatch = useDispatch()
    const [starReview,setStarReview] = useState(0)
    const [comment,setComments] = useState('')
    const star = []
    for (let i = 0; i < 5; i++) {
        star.push(i)
    }
    const declineHire = () => {
      setShowReviewPage(true)
      changeHireModal(!changeHireModal.show);
    }
    const acceptHire = () => {
      changeHireModal(!changeHireModal.show);
      dispatch({ type:'CHANGE_HIRESTATE',payload:{ askHire:false } })
      navigation.navigate('HireCleanerPage', { acceptedCleanerId,cleanerRating,cleanerFirstname })
    }
    const postReview = async() => {
      setIsPending(true)
      var currentDate = new Date().getTime()
      var newRating = Number(cleanerRating) + starReview
      const res = await fetch(`http://192.168.100.12:19002/postCleanerReview?totalRating=${newRating}&cleanerId=${acceptedCleanerId}&customerId=${id}&customerName=${displayName}&rating=${starReview}&comment=${comment}&currentDate=${currentDate}`)
      setIsPending(false)
      dispatch({ type:'CHANGE_HIRESTATE',payload:{ askHire:false } })
      changeOrderState('order')
    }
    const closeReviewModal = () => {
      dispatch({ type:'CHANGE_HIRESTATE',payload:{ askHire:false } })
      changeOrderState('order')
    }
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        // style={{ backgroundColor:'grey',alignSelf:'center' }}
        visible={showReviewPage}
        onRequestClose={() => {
            setShowReviewPage(false);
            closeReviewModal()
        }}
      >
      <View style={{ padding:10,marginTop:30 }}>
        <TouchableWithoutFeedback onPress={() => closeReviewModal()}>
            <AntDesign name="close" size={24} color={colors.yellow} style={{ marginVertical:10 }} />
        </TouchableWithoutFeedback>
        <TextInput multiline style={styles.ReviewInput} value={comment} onChangeText={(val) => setComments(val)} placeholder='What do you think about this Cleaner?' />
          <View style={{ flexDirection:'row',marginVertical:10 }}>
            {
            star.map((item,index) => (
                <TouchableWithoutFeedback key={index} onPress={() => setStarReview(index + 1)}>
                    <Entypo name="star" size={24} style={ starReview >= index + 1 && starReview ? { color:'gold',letterSpacing:4 } : { color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                </TouchableWithoutFeedback>
            ))   
            }
          </View>
            <TouchableWithoutFeedback onPress={() => postReview()}>
              <View style={{ width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:colors.yellow,padding:10 }}>
                  <Text style={{ color:colors.white,letterSpacing:1,fontSize:width > 598 ? 24 :16 }}>POST</Text>
              </View>
            </TouchableWithoutFeedback>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        style={{ backgroundColor:'grey',alignSelf:'center' }}
        visible={hireModalVisible.show}
      >
      <View style={{...styles.centeredView, backgroundColor:'rgba(0,0,0,0.5)'}}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{hireModalVisible.text}</Text>
          <View style={{ flexDirection:'row' }}>
              <Pressable onPress={() => acceptHire()} style={{ backgroundColor:colors.green,margin:20 }}>
                  <Text style={{ margin:10,color:colors.white }}>YES</Text>
              </Pressable>
              <Pressable onPress={() => declineHire()} style={{ backgroundColor:'red',margin:20 }}>
                  <Text style={{margin:10,color:colors.white }}>NO</Text>
              </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  </View>
  );
}
const styles = StyleSheet.create({
    centeredView: {
      position:'absolute',
      width:'100%',
      height:'100%',
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalBody: {
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        padding:20
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
    button: {
      padding: 10,
      elevation: 2,
      backgroundColor:colors.yellow
    },
    buttonClose: {
      backgroundColor:colors.yellow
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontFamily:'viga'
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontFamily:'viga'
    },
    ReviewInput: {
      color:colors.black,
      letterSpacing:1, 
      minHeight:80,
      borderWidth:1,
      borderColor:colors.yellow,
      marginVertical:5,
      padding:10 
    }
});
