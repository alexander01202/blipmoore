import React,{useEffect,useState} from 'react';
import { StyleSheet, View,Text,Image,Dimensions,TouchableOpacity,TouchableWithoutFeedback, ImageBackground, ScrollView, TextInput, Button, ActivityIndicator, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import { colors } from '../../colors/colors'
import call from 'react-native-phone-call'
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import MyModal from '../../components/modal';
import { AgentProfileLoading } from './AgentProfileLoading';
import ChatModal from './ChatModal';

export function ContentThatStaysAbove({ route,settingReviews,navigation }) {
    const { width,height } = Dimensions.get('window')
    const { agentId,agentName,agentBio } =  route.params
    const [agentInfo,setAgentInfo] = useState(null)
    const [isPending,setIsPending] = useState(true)
    const [review,setReview] = useState(null)
    const [isPosting,setIsPosting] = useState(false)
    const [starReview,setStarReview] = useState(0)
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const [ratingsCount,setRatingsCount] = useState(null)
    const [showChatModal,setShowChatModal] = useState(false)
    // const reFetchReviews = useRef(null)
    const { id,displayName } = useSelector(state => state.login)
    const star = []
    for (let i = 0; i < 5; i++) {
        star.push(i)
    }
    const getContactPermission = async() => {
        const args = {
            number: `+23408121209489`, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
          }
          call(args).catch(console.error)
    }
    useEffect(async() => {
        const fetchAgentInfo = await fetch(`http://192.168.100.12:19002/fetchAgent?id=${agentId}`)
        const { success,rows } = await fetchAgentInfo.json()
        const getRatingsCount = await fetch(`http://192.168.100.12:19002/getReviewCount?agentId=${agentId}`)
        const getRatingsCountRes = await getRatingsCount.json()
    
      if (success) {
        setAgentInfo(rows)
        setIsPending(false)
        setRatingsCount(getRatingsCountRes)
      }
      
    }, [])
    const reFetchReviews = async() => {
        
        const getAllReviews = await fetch(`http://192.168.100.12:19002/getReviews?agentId=${agentId}`)
        const { success,rows } = await getAllReviews.json()

        if (success) {
            settingReviews(rows)
            setReview('')
        }
    }
    const postReview = async() => {
        if (!review || review === '') {
            setModalVisible({
                show:true,
                text:'Please Write a brief review'
            })
            return
        }
        if (starReview < 1) {
            setModalVisible({
                show:true,
                text:'Please choose a star rating'
            })
            return
        }
        setIsPosting(true)
        const checkIfUserOrdered = await fetch(`http://192.168.100.12:19002/checkAllAgentOrders?customerId=${id}&agentId=${agentId}`)
        const checkIfUserHasOrderRes = await checkIfUserOrdered.json()
        if (!checkIfUserHasOrderRes.success) {
            setIsPosting(false)
            setModalVisible({
                show:true,
                text:'You have never hired this agent'
            })
            return
        }
        const checkIfUserhasMadeReview = await fetch(`http://192.168.100.12:19002/checkAllReviews?customerId=${id}&agentId=${agentId}`)
        const checkIfUserhasMadeReviewRes = await checkIfUserhasMadeReview.json()
        if (checkIfUserhasMadeReviewRes.success) {
            setIsPosting(false)
            setModalVisible({
                show:true,
                text:'You have Previously made a Review'
            })
            return
        }

        const currentDate = new Date().getTime()
        const newAgentRating = agentInfo.ratings + starReview
        const postUserReview = await fetch(`http://192.168.100.12:19002/postReview?customerId=${id}&agentId=${agentId}&review=${review}&customerName=${displayName}&currentDate=${currentDate}&ratings=${starReview}&newAgentRating=${newAgentRating}`)
        const { success } = await postUserReview.json()

        if (success) {
            setModalVisible({
                show:true,
                text:"Thanks For the Review,You're the best!!!"
            })
            setStarReview(0)
            reFetchReviews()
        }else{
            setModalVisible({
                show:true,
                text:'Could not post Review, Please try again Later'
            })
        }
        setIsPosting(false)
    }
    const changeModal = () => {
        setModalVisible({
            show:false,
            text:''
        })
    }
    const changeChatModal = () => {
        setShowChatModal(!showChatModal)
    }
    return(
        <>
        {
            ratingsCount && agentInfo ?
        <>
        <MyModal modalVisible={modalVisible} changeModal={changeModal} />
        <ChatModal customerId={id} agentId={agentId} companyName={agentName} showChatModal={showChatModal} changeChatModal={changeChatModal} />
        <ScrollView style={{ backgroundColor:colors.black }}>
            <View style={{ width:'100%',height:height / 4,marginBottom:100 }}>
                <ImageBackground style={{ width:'100%',maxWidth:'100%',height:'100%' }} source={require('../../assets/background.jpg')} >
                    <TouchableWithoutFeedback onPress={() => navigation.pop()}>
                     <View style={styles.backIcon}>
                       <AntDesign name="arrowleft" style={{ top:Dimensions.get('window').height < 596 ? 10 : 0,shadowColor:'black' }} size={24} color="black" />
                     </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex:1,justifyContent:'flex-end',alignItems:'center',transform:[{ translateY:width > 598 ? 100 : 80 }] }}>
                        {/* <Image style={{ width:width > 598 ? 100 : 70,height:width > 598 ? 100 : 70, borderRadius:50,borderWidth:3,borderColor:colors.yellow }} source={require('../../assets/icon.png')} /> */}
                        <Text style={{...styles.text,fontSize:width > 598 ? 20 : 16,marginVertical:5}}>{agentName}</Text>
                        <View style={{ flexDirection:'row' }}>
                        {
                            ratingsCount &&
                            <Text style={{ color:'gold',fontSize:10,letterSpacing:1,marginHorizontal:5 }}>{ratingsCount.rows.count} (ratings)</Text>
                        }
                        {
                        agentInfo &&
                        star.map((item,index) => (
                            <Entypo name="star" size={14} color="black" style={ agentInfo.ratings >= 1 && index + 1 === 1 ? { color:'gold',letterSpacing:4 } : agentInfo.ratings >= 20 && index + 1 === 2 ? { color:'gold',letterSpacing:4 } : agentInfo.ratings >= 40 && index + 1 === 3 ? { color:'gold',letterSpacing:4 } : agentInfo.ratings >= 60 && index + 1 === 4 ? { color:'gold',letterSpacing:4 } : agentInfo.ratings >= 80 && index + 1 === 5 ? { color:'gold',letterSpacing:4 } :{ color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                        ))   
                        }      
                    </View>
                    </View>
                </ImageBackground>
            </View>
            <View style={{ flex:1, flexDirection:'row',paddingTop:10,justifyContent:'center',alignItems:'center' }}>
                <TouchableWithoutFeedback onPress={changeChatModal}>
                    <View style={{ flex:1,flexDirection:'row',alignItems:'center', justifyContent:'center',width:'50%',height:'100%' }}>
                        <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                        <Text style={{...styles.text,left:5}}>Chat With Agent</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={getContactPermission}>
                    <View style={{ flex:1,marginLeft:30 ,justifyContent:'center',width:'50%',height:'100%'}}>
                        <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <View style={{ backgroundColor:colors.white,borderRadius:50,width:20,height:20,justifyContent:'center',alignItems:'center' }}>
                                <FontAwesome style={{ color:colors.green }} name="phone" size={15} color="white" />
                            </View>
                            <Text style={{...styles.text,left:10}}>Call Agent</Text>
                        </View>
                    </View> 
                </TouchableWithoutFeedback>
            </View>
            <View style={{ flex:1,alignItems:'center',marginVertical:20 }}>
                <View style={{ ...styles.bio }}>
                    <Text style={{...styles.text,color:colors.yellow}}>Bio</Text>
                    <View style={{ width:'100%',borderWidth:1,borderColor:colors.yellow,marginBottom:10 }}></View>
                    <View style={{ flex:1,justifyContent:'center' }}>
                        <Text style={{ fontStyle:'italic' }}>{agentBio}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex:1,alignItems:'center',marginVertical:10 }}>
                <View style={{ ...styles.bio }}>
                    <View style={{ flexDirection:'row',flex:1 }}>
                        <Text style={{...styles.text,color:colors.yellow}}>Hire Fees</Text>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('HireAgentPage',{ agentId })}>
                            <View style={{ flex:1,alignItems:'flex-end',marginBottom:5 }}>
                                <View style={{ backgroundColor:'lightblue',paddingHorizontal:20,borderRadius:10,flexDirection:'row',justifyContent:'center',elevation:3 }}>
                                    <Ionicons name="add-sharp" size={16} color="black" style={{ marginRight:5 }} />
                                    <Text style={{ color:'blue',fontFamily:'viga' }}>Hire Agent</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ width:'100%',borderWidth:1,borderColor:colors.yellow,marginBottom:10 }}></View>
                    <View>
                        {
                            isPending ? <ActivityIndicator size={'large'} color={colors.yellow} /> :
                            agentInfo && 
                            <>
                                <Text style={{...styles.text,color:colors.black}}>SSA(Small Sized Area): N{agentInfo.ssa}</Text>
                                <Text style={{...styles.text,color:colors.black}}>MSA(Medium Sized Area): N{agentInfo.msa}</Text>
                                <Text style={{...styles.text,color:colors.black}}>LSA(Large Sized Area): N{agentInfo.lsa}</Text>
                                <Text style={{...styles.text,color:colors.black}}>ELSA(Extra Large Sized Area): N{agentInfo.elsa}</Text>
                                <Text style={{...styles.text,color:colors.black}}>Deep Cleaning(Additional fee): N{agentInfo.deepCleaning}</Text>
                                <Text style={{...styles.text,color:colors.black}}>Post Construction(Additional fee): N{agentInfo.postConstruction}</Text>
                            </>
                        }
                    </View>
                    <Text style={{ marginVertical:10,fontStyle:'italic',color:colors.yellow }}>Note that Deep Cleaning is an additional fee to each Area/Rooms.</Text>
                </View>
            </View>
            <View style={{ padding:20 }}>
                <Text style={{...styles.text,color:colors.yellow}}>Reviews</Text>
                <View style={{ width:'100%',borderWidth:1,borderColor:colors.yellow,marginBottom:10 }}></View>
                    <View>
                        <TextInput value={review} placeholderTextColor={colors.white} maxLength={200} onChangeText={(val) => setReview(val)} placeholder='Write your own Review' style={{ color:'white',letterSpacing:1, minHeight:80,borderWidth:1,borderColor:colors.yellow,marginVertical:5,padding:10 }} multiline={true} />
                        <View style={{ flexDirection:'row',marginVertical:10 }}>
                            {
                            star.map((item,index) => (
                                <TouchableWithoutFeedback key={index} onPress={() => setStarReview(index + 1)}>
                                    <Entypo name="star" size={24} style={ starReview >= index + 1 && starReview ? { color:'gold',letterSpacing:4 } : { color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                                </TouchableWithoutFeedback>
                            ))   
                            }      
                        </View>
                        {isPosting ? <ActivityIndicator size={'large'} color={colors.yellow} /> : 
                        <TouchableWithoutFeedback onPress={() => postReview()}>
                            <View style={{ width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:colors.yellow,padding:10 }}>
                                <Text style={{ color:colors.white,letterSpacing:1,fontSize:width > 598 ? 24 :16 }}>POST</Text>
                            </View>
                            </TouchableWithoutFeedback> }
                    </View>
                <View>
            </View>
        </View>
    </ScrollView>
    </>
    : <AgentProfileLoading />
    }
    </>
    )
}

export default function AgentProfile({ route,navigation }) {
    const [isRefreshing,setIsRefreshing] = useState(false)
    const [allReviews,setAllReviews] = useState(null)
    const { agentId,agentName,agentBio } =  route.params
    const stars = []
    for (let i = 0; i < 5; i++) {
        stars.push(i)
    }
    useEffect(() => {
        const getReviews = async() => {
            setIsRefreshing(true)
            const getAllReviews = await fetch(`http://192.168.100.12:19002/getReviews?agentId=${agentId}`)
            const { success,rows } = await getAllReviews.json()
    
            if (success) {
                setAllReviews(rows)
            }
            setIsRefreshing(false)
        }
            // reFetchReviews.current = getReviews
            getReviews()
    }, [])
    const settingReviews = (rows) => {
        setAllReviews(rows)
    }
  return (
    <>
    {
        <FlatList 
            keyExtractor={(item) => item.id}
            data={allReviews}
            ListHeaderComponent={<ContentThatStaysAbove route={route} navigation={navigation} settingReviews={settingReviews}/>}
            renderItem={({ item }) => (
                !item ? <View style={{ opacity:0.6,backgroundColor:'#c4c4c4',minHeight:80,padding:10,marginVertical:10 }}><Text style={{ fontStyle:'italic' }}>No Reviews Yet</Text></View>
            :
                <View style={{ flex:1,alignItems:'center',backgroundColor:colors.black }}>
                    <View style={{...styles.bio,width:'90%',minHeight:80,elevation:3,marginVertical:10}}>
                        <Text style={{...styles.text,color:colors.yellow}}>{item.customer_name}</Text>
                        <View>
                            <Text>{item.review}</Text>
                        </View>
                        <View style={{ flex:1,justifyContent:"flex-end" }}>
                            <View style={{ flexDirection:'row' }}>
                                {
                                stars.map((star,index) => (
                                    <Entypo name="star" size={14} style={ item.ratings >= index + 1 ?  { color:'gold',letterSpacing:4 } : { color:'#c4c4c4',letterSpacing:4 }} key={index} />
                                ))   
                                } 
                                <View style={{ flex:1,justifyContent:'flex-end',flexDirection:"row" }}>
                                    <Text style={{ fontFamily:'viga' }}>{new Date(item.dateofreview).toLocaleDateString()}</Text>
                                </View>     
                            </View>
                        </View>
                    </View>
                </View>
            )}
        />
    }
    </>
  )
}
const styles = StyleSheet.create({
    text: {
      fontFamily:'viga',
      color:colors.white
    },
    bio:{
        width:'90%',
        marginVertical:15,
        backgroundColor:'#f0f8ff',
        minHeight:100,
        padding:10,
    },
    backIcon:{
        top:10,
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
})
