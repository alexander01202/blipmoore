import { Image, ImageBackground, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View,Share } from 'react-native'
import LottieView from 'lottie-react-native';
import { colors } from '../../colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function CancelSuccess({ navigation,route }) {
    // const { cleaner_name,orderId } = route.params
    const { displayName,id } = useSelector(state => state.login)
  return (
    <View style={styles.container}>
        <View style={{ borderRadius:20,backgroundColor:'white',flex:1,alignItems:'center',width:'100%',elevation:3,padding:10 }}>
            <View style={{ width:'100%',height:'10%',marginBottom:40 }}>
                <Image resizeMode='stretch' style={{ width:'100%',height:'300%' }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/topcurtain.png'}} />
            </View>
            <View style={{ borderRadius:50,backgroundColor:'pink',width:100,height:100,justifyContent:'center',alignItems:'center' }}>
                <View style={{ borderRadius:50,backgroundColor:'red',width:70,height:70,justifyContent:'center',alignItems:'center' }}>
                    <FontAwesome name="check" size={34} color="white" />
                </View>
            </View>
            <View style={{ marginVertical:20,alignItems:'center',padding:10 }}>
                <Text style={{ fontFamily:'viga',fontSize:20,letterSpacing:1 }}>Your Order Was Cancelled</Text>
                <Text style={{ textAlign:'center',color:'rgba(0,0,0,0.5)',marginVertical:5 }}>Thank You for using our product. We hope you enjoyed your experience.</Text>
            </View>
            <View style={{ backgroundColor:'rgba(225,225,225, 0.7)',padding:20,width:'100%',marginBottom:20 }}>
                <View style={{ flexDirection:'row',justifyContent:'space-between',marginVertical:10 }}>
                    <View style={{ width:'50%' }}>
                        <Text style={styles.title}>Cancellation Date</Text>
                        <Text style={styles.text}>{moment().format('Do')} {moment().format('MMMM')} {moment().format('YYYY')}</Text>
                    </View>
                    <View style={{ width:'50%',alignItems:'flex-end' }}>
                        <Text style={styles.title}>OrderId</Text>
                        {/* <Text style={styles.text}>#1{orderId}</Text> */}
                    </View>
                </View>
                <View style={{ flexDirection:'row',justifyContent:'space-between',marginVertical:10 }}>
                    <View style={{ width:'50%' }}>
                        <Text style={styles.title}>Cleaner name</Text>
                        {/* <Text style={styles.text}>{cleaner_name}</Text> */}
                    </View>
                </View>
            </View>
        </View>
        <TouchableNativeFeedback onPress={() => navigation.navigate('Subscriptions')}>
            <View style={styles.btn}>
                <Text style={{ color:colors.white,fontFamily:'viga',letterSpacing:1 }}>Continue</Text>
            </View>
        </TouchableNativeFeedback>
    </View>
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
    btn:{
        backgroundColor:colors.purple,
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        padding:10,
        marginVertical:5,
    },
})