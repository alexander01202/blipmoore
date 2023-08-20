import React from 'react';
import { Image,StyleSheet,Text,SafeAreaView } from 'react-native';
import { colors } from '../../colors/colors';

export default function HomeHeader() {
    return(
        <SafeAreaView style={{ backgroundColor:colors.black,justifyContent:'center',alignItems:'center' }}>
          <Image style={{ width:'60%',height:80 }} resizeMode={'contain'} source={require('../../assets/logo/BlipmooreLogo(light).png')}/>
          <Text style={{ bottom:10,fontFamily:'viga',color:colors.white }}>GIVES YOU THE BEST OF THE BEST</Text>
        </SafeAreaView>
    )
}
