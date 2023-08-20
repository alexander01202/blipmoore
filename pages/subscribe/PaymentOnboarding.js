import { Image, ImageBackground, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View,Share } from 'react-native'
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import { colors } from '../../colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useEffect } from 'react';
import { AllKeys } from '../../keys/AllKeys';
import { mixpanel } from '../../components/MixPanel'

export default function PaymentOnboarding({ navigation,route }) {
    const { selectedDate,planId } = route.params
    const { displayName,id } = useSelector(state => state.login)
    const { street_name,street_number,city,state } = useSelector(state => state.location)

    useEffect(() => {
        var time = moment().startOf('day').valueOf()
        fetch(`${AllKeys.ipAddress}/InserthasSubscribed?id=${id}&time=${time}`)
    }, [])
    
    const shareOptions = {
        title: `You're gonna want to hear this!!!`,
        message: `You're gonna want to hear this!!! Blipmoore helps get all my cleaning done (P.S for free too for first timers) reducing repetitive cleaning and reducing my stress. Download the app on google play store/app store and use the code ${displayName}${id} to register and get your first order freeeee.`, // Note that according to the documentation at least one of "message" or "url" fields is required
        url: 'www.blipmoore.com',
    };
    const onSharePress = async() => {
        Share.share(shareOptions)
        mixpanel.getPeople().increment('shareWithFriends', 1)
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.overview}>
            <View style={{ width:'100%',height:'10%',marginBottom:40 }}>
                <FastImage resizeMode={FastImage.resizeMode.stretch} style={{ width:'100%',height:'300%' }} source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/topcurtain.png'}} />
            </View>
            <View style={{ borderRadius:50,backgroundColor:colors.lightPurple,width:100,height:100,justifyContent:'center',alignItems:'center' }}>
                <View style={{ borderRadius:50,backgroundColor:colors.purple,width:70,height:70,justifyContent:'center',alignItems:'center' }}>
                    <FontAwesome name="check" size={34} color="white" />
                </View>
            </View>
            <View style={{ marginVertical:20,alignItems:'center',padding:10 }}>
                <Text style={{ fontFamily:'viga',fontSize:20,letterSpacing:1 }}>Your Order Was Placed</Text>
                <Text style={{ textAlign:'center',color:'rgba(0,0,0,0.5)',marginVertical:5 }}>You will be notified when we have positioned a cleaner for you.</Text>
            </View>
            <View style={{ backgroundColor:colors.grey,padding:10,width:'100%' }}>
                <View style={{ flexDirection:'row',justifyContent:'space-between',marginVertical:10 }}>
                    <View style={{ width:'50%' }}>
                        <Text style={styles.title}>Start Date</Text>
                        <Text style={styles.text}>{moment(selectedDate).format('Do')} {moment(selectedDate).format('MMMM')} {moment(selectedDate).format('YYYY')}</Text>
                    </View>
                    <View style={{ width:'50%',alignItems:'flex-end' }}>
                        <Text style={styles.title}>Order</Text>
                        <Text style={styles.text}>#{planId}</Text>
                    </View>
                </View>
                <View style={{ flexDirection:'row',justifyContent:'space-between',marginVertical:10 }}>
                    <View style={{ width:'50%' }}>
                        <Text style={styles.title}>Address</Text>
                        <Text style={styles.text}>{street_number}, {street_name}</Text>
                        <Text style={styles.text}>{city}, {state}</Text>
                    </View>
                </View>
            </View>
            <LottieView
                loop={false}
                autoPlay
                style={{ width: '100%', height: '100%',position:'absolute' }}
                source={require('../../lottie/celebration-animation.json')}
            />
        </View>
        <TouchableNativeFeedback onPress={onSharePress}>
            <View style={styles.btn}>
                <Text style={{ color:colors.white,fontFamily:'viga',letterSpacing:1 }}>Share with friends</Text>
            </View>
        </TouchableNativeFeedback>
        <TouchableOpacity onPress={() => navigation.navigate('OrderCleaner')}>
            <View style={{ width:'100%',marginVertical:5 }}>
                <Text style={{ textAlign:'center',color:'blue' }}>Continue</Text>
            </View>
        </TouchableOpacity>  
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'rgba(225,225,225,0.7)'
    },
    title:{
        color:'grey',
        marginBottom:5
    },
    text:{
        fontFamily:'viga'
    },
    overview:{
        borderRadius:20,
        backgroundColor:'white',
        flex:1,
        alignItems:'center',
        width:'100%',
        elevation:3,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        padding:10
    },
    btn:{
        backgroundColor:colors.purple,
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        padding:10,
        marginVertical:5,
    },
})