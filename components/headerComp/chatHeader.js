import React from 'react';
import { Image,StyleSheet,Text,SafeAreaView,TouchableWithoutFeedback,View } from 'react-native';
import { colors } from '../../colors/colors';
import { AntDesign } from '@expo/vector-icons';

export default function ChatHeader({ navigation }) {
    return(
        <SafeAreaView style={{ backgroundColor:colors.darkPurple,justifyContent:'center',alignItems:'center' }}>
          {/* <Image style={{ width:'100%',height:80 }} source={require('../../assets/logo/newlogo.png')}/> */}
          <TouchableWithoutFeedback onPress={() => navigation.navigate('HomePage')}>
            <View style={{ ...styles.backIcon,marginVertical:5 }}>
                <AntDesign name="arrowleft" style={{ shadowColor:'black' }} size={24} color="black" />
            </View>
        </TouchableWithoutFeedback>
          <Text style={{ bottom:10,fontFamily:'viga',color:colors.white }}>CHATS</Text>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    // backIcon:{
    //     left:10,
    //     shadowOpacity:0.2,
    //     shadowOffset:{ width:5,height:5 },
    //     borderRadius:20,
    //     height:30,
    //     width:30,
    //     backgroundColor:colors.white,
    //     justifyContent:'center',
    //     alignItems:'center',
    //     elevation:3
    // }
})