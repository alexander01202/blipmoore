import { View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback,Linking } from 'react-native'
import React from 'react'
import { colors } from '../../colors/colors'
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function Enterprise({ navigation }) {
    const { displayName } = useSelector(state => state.login)

    const openWhatsapp = () => {
        let url = `whatsapp://send?text=Hello. My name is ${displayName}. We are an enterprise and would like to understand how blipmoore works&phone=+23408103539046`
        Linking.openURL(url)
        .then(data => {
          console.log("WhatsApp Opened successfully " + data);
        })
        .catch(() => {
          alert("Make sure WhatsApp installed on your device");
        });
    }
  return (
    <View style={styles.container}>
     <ImageBackground style={{ width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}  source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png'}}>
        <View style={styles.boxContainer}>
            <View style={{ alignItems:'center',justifyContent:'center',marginVertical:10 }}>
                <Text style={{ fontFamily:'viga',fontSize:16,textAlign:'center',textTransform:'uppercase' }}>offers out of the box 🎁</Text>
            </View>
            <View style={{ marginVertical:20 }}>
                <View style={styles.offers}>
                    <MaterialIcons name="verified" style={{ marginRight:5 }} size={18} color="green" />
                    <Text style={{ fontSize:12 }}>Constant <Text style={{ fontWeight:'bold' }}>Quality Cleaning</Text></Text>
                </View>
                <View style={styles.offers}>
                    <MaterialIcons name="verified" style={{ marginRight:5 }} size={18} color="green" />
                    <Text style={{ fontSize:12 }}><Text style={{ fontWeight:'bold' }}>Well-trained</Text> Cleaning Staff</Text>
                </View>
                <View style={styles.offers}>
                    <MaterialIcons name="verified" style={{ marginRight:5 }} size={18} color="green" />
                    <Text style={{ fontSize:12,fontWeight:'bold' }}>Custom Pricing</Text>
                </View>
                <View style={styles.offers}>
                    <MaterialIcons name="verified" style={{ marginRight:5 }} size={18} color="green" />
                    <Text style={{ fontSize:12 }}><Text style={{ fontWeight:'bold' }}>Adequate</Text> Cleaning staff</Text>
                </View>
                <View style={styles.offers}>
                    <MaterialIcons name="verified" style={{ marginRight:5 }} size={18} color="green" />
                    <Text style={{ fontSize:12 }}><Text style={{ fontWeight:'bold' }}>Trustworthy</Text> Staff</Text>
                </View>
                <View style={styles.offers}>
                    <MaterialIcons name="verified" style={{ marginRight:5 }} size={18} color="green" />
                    <Text style={{ fontSize:12 }}><Text style={{ fontWeight:'bold' }}>Automatic replacement</Text> of cleaning staff</Text>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={openWhatsapp}>
                <View style={styles.button}>
                    <Text style={{ fontSize:16,color:colors.whitishBlue,fontFamily:'viga' }}>Contact an advisor</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.pop()}>
                <Text style={{ color:'red',textAlign:'center',marginVertical:10 }}>Maybe later</Text>
            </TouchableWithoutFeedback>
        </View>
     </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    boxContainer:{
        backgroundColor:colors.whitishBlue,
        padding:10,
        width:'80%'
    },
    button:{
        backgroundColor:colors.darkPurple,
        padding:10,
        alignItems:'center',
        borderRadius:20,
        elevation:3
    },
    offers:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:20,
    }
})