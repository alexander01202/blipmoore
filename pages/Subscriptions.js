import { useState,useEffect } from 'react';
import { View,StyleSheet,Text,InteractionManager,TouchableNativeFeedback, TouchableOpacity,Dimensions,FlatList,ScrollView,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable';
import { colors } from '../colors/colors';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons,Entypo,Feather,AntDesign } from '@expo/vector-icons';
import { currency } from '../currency/currency';
import ContentLoader from "react-native-easy-content-loader";
import { AllKeys } from '../keys/AllKeys';

var arrLoader = [1,2,3,4,5]
export default function Subscriptions({ navigation }) {
    const { id } = useSelector(state => state.login)
    const { width,height } = Dimensions.get('window')
    const [subs,setSubs] = useState(null)
    const [isPending,setIsPending] = useState(true)
    const [isRefreshing,setIsRefreshing] = useState(false)
    const isFocused = useIsFocused();
    
    useEffect(async() => {
        setIsRefreshing(true)
        InteractionManager.runAfterInteractions(() => {
            fetchSub()
        })
        const res = await fetch(`${AllKeys.ipAddress}/fetchSubscription?id=${id}`)
        const { success,rows } = await res.json()
    
        if (success) {
            var arr = []
            for (let i = 0; i < rows.length; i++) {
                const req = await fetch(`${AllKeys.ipAddress}/fetchPlanInfo?sub_id=${rows[i].id}`)
                const { success,row } = await req.json()
                var obj = { planName:row[0].plan_name,planDesc:row[0].plan_desc }
                arr.push({...rows[i],...obj})
            }
            setSubs(arr)    
        }else{
            setSubs(null)
        }
        setIsRefreshing(false)
        setIsPending(false)
    }, [isFocused])
    const fetchSub = async() => {
        setIsRefreshing(true)
        const res = await fetch(`${AllKeys.ipAddress}/fetchSubscription?id=${id}`)
        const { success,rows } = await res.json()
    
        if (success) {
            var arr = []
            for (let i = 0; i < rows.length; i++) {
                const req = await fetch(`${AllKeys.ipAddress}/fetchPlanInfo?sub_id=${rows[i].id}`)
                const { success,row } = await req.json()
                var obj = { planName:row[0].plan_name,planDesc:row[0].plan_desc }
                arr.push({...rows[i],...obj})
            }
            setSubs(arr)    
        }else{
            setSubs(null)
        }
        setIsRefreshing(false)
    }
  return (
    <View style={{ flex:1,backgroundColor:'#dcdcdc' }}>
        {
            isPending ?
            <ScrollView style={{ padding:10,flex:1 }}>
                {
                    arrLoader.map(arr => (
                        <View key={arr} style={{...styles.cards, backgroundColor:'rgba(255,255,255,1)'}}>
                            <View style={{ alignItems:'center',marginVertical:5,justifyContent:'space-between',flexDirection:'row'  }}>
                                <View style={{ flexDirection:'row',width:'80%' }}>
                                    <ContentLoader titleStyles={{ width:'90%' }} active pRows={1} pWidth={'100%'} />
                                </View>
                            </View>
                            <View style={{ flexDirection:'row',justifyContent:'space-between',maxWidth:'100%',marginTop:30 }}>
                                <View style={{ width:'50%'  }}>
                                    <ContentLoader active title={false} pRows={1} pWidth={100} />
                                </View>
                                <View style={{ width:'50%'  }}>
                                    <ContentLoader active title={false} pRows={1} pWidth={50} paragraphStyles={{alignSelf:'flex-end'}} />
                                </View>
                            </View>
                            <View>
                                <ContentLoader active title={false} pRows={1} pWidth={'100%'} pHeight={3} />
                            </View>
                            <ContentLoader active title={false} pRows={1} paragraphStyles={{ width:'100%',borderRadius:10,height:40 }} />
                        </View>
                    ))
                }
            </ScrollView>
            :
            !subs ? 
            <View style={{ width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}>
                {/* <Ionicons name="md-card" size={154} color="#c4c4c4" /> */}
                <View style={{ width:'100%',height:'40%',alignItems:'center',justifyConten:'center' }}>
                    <FastImage source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/cart.png'}} resizeMode={FastImage.resizeMode.contain} style={{ width:'50%',height:'100%',left:-15 }} />
                </View>
                <Text style={{ fontFamily:'viga',fontSize:16 }}>Such Emptiness</Text>
                <TouchableNativeFeedback onPress={() => navigation.navigate('Pricing')}>
                    <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                      <View style={{ borderColor:colors.purple,borderRadius:10,padding:15,marginVertical:10,borderWidth:1 }}>
                        <Text style={{ color:colors.black,textAlign:'center' }}>Get rid of cleaning now</Text>
                      </View>
                    </Animatable.View>
                </TouchableNativeFeedback>
            </View>
            : 
            <View style={{ padding:10 }}>
            <FlatList 
                onRefresh={fetchSub}
                refreshing={isRefreshing}
                keyExtractor={(item) => item.id}
                data={subs}
                renderItem={({ item }) => (
                <View style={styles.selection}>
                  <View style={styles.header}>
                        <View style={styles.planHeader}>
                            <Text style={styles.planName}>{item.planName}</Text>
                        </View>
                      <Text style={{ color:'#696969' }}>{item.planDesc}</Text>
                  </View>
                  <CollapsibleView 
                      style={{ padding:0,borderWidth:0 }}
                      collapsibleContainerStyle={{ width:'100%' }} 
                      arrowStyling={{ size: 16,rounded: true, thickness: 1, color:"purple" }}
                      noArrow={true}
                      titleStyle={{ borderBottomWidth:1,borderColor:'#696969' }}
                  title={
                  <View style={styles.section}>
                      <Text style={{ fontWeight:'bold',color:colors.black }}
                      >NGN {Number(item.amount).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} / <Text style={{ color:'#696969',fontWeight:'normal' }}>{item.sub_interval}</Text></Text>
                      <View style={styles.dets}>
                          <Text style={{ color:colors.purple }}>Details</Text>
                      </View>
                  </View>
                  }>
                    <View style={styles.benefits}>
                        <View style={styles.benefit}>
                            <Ionicons name="person" size={14} color="black" />
                            <Text style={styles.benefitTxt}>Cleaner</Text>
                        </View>
                        <View style={styles.benefit}>
                            <Feather name="check" size={14} color={colors.purple} />
                            <Text style={styles.benefitTxt}>{item.cleaning_interval_frequency}x / {item.cleaning_interval}</Text>
                        </View>
                        {
                            item.places.split(',').map(place => {
                                var letters = place.replace(/[^a-z]/g, '')
                                var number = place.replace(/[^0-9]/g, '')
                                return (
                                    <View key={place} style={styles.benefit}>
                                        <Feather name="check" size={14} color={colors.purple} />
                                        <Text style={styles.benefitTxt}>{number}{' '}{letters}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={styles.line} />
                    <View style={styles.benefit}>
                        <AntDesign name="pluscircleo" size={14} color={'green'} />
                        <Text style={{...styles.benefitTxt,...styles.bonusText}}>1 Deep cleaning / month</Text>
                    </View>
                    </CollapsibleView>
                    <TouchableOpacity onPress={() => navigation.navigate('OrderOverview', { item })}>
                        <View style={styles.button}>
                            <Text style={{ color:colors.white,fontWeight:'bold',fontSize:16 }}>View Order</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                )}
            />
            </View>
        }
    </View>
  )
}
const styles = StyleSheet.create({
    cards:{
        backgroundColor:colors.lightPurple,
        elevation:3,
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        borderRadius:10,
        width:'100%',
        padding:10,
        marginVertical:10
    },
    text: {
        fontFamily:"viga",
        letterSpacing:1
    },
    button: {
        backgroundColor: colors.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        paddingVertical:10
    },
    selection:{
        backgroundColor:"#FAF9F6",
        padding:10,
        borderRadius:10,
        paddingHorizontal:15,
        marginVertical:10
    },
    header:{
        alignItems:'flex-start',
        justifyContent:'center',
        marginVertical:10
    },
    planName:{
        fontFamily:'viga',
        fontSize:20,
        letterSpacing:1,
        color:colors.purple,
        textTransform:'capitalize'
    },
    planHeader:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        alignItems:'center',
        marginBottom:10
    },
    customizeLink:{
        color:'blue',
        textDecorationLine:'underline',
        fontSize:12
    },
    section:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10,
        alignItems:'center',
        width:"100%",
    },
    line:{
        backgroundColor:'#c8c8c8',
        height:2,
        width:'100%'
    },
    dets:{
        // backgroundColor:colors.purple,
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        paddingHorizontal:15,
        // borderRadius:5,
        flexDirection:'row'
    },
    benefits:{
        width:'100%',
        marginVertical:10
    },
    benefit:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5
    },
    benefitTxt:{
        textTransform:'capitalize',
        marginLeft:10
    },
    bonusText:{
        fontWeight:'bold'
    },
    lottie: {
        width: 100,
        height: 100
    },
})
