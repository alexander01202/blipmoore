import { ImageBackground, View,StyleSheet,Image,SafeAreaView,Text, StatusBar,Platform } from "react-native";
import { colors } from "../colors/colors";
import Onboarding from 'react-native-onboarding-swiper';
import { Dimensions } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import FastImage from "react-native-fast-image";

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default function Firstpage({ text,img,navigation,smallText,nextPage,btnText }) {
  return (
        <Onboarding
            subTitleStyles={{ width:width,position:'absolute',zIndex:2,top:-height / 1.2 ,fontFamily:'viga',fontSize:20,alignSelf:'center',color:colors.white}}
            onSkip={() => navigation.navigate('SignUpForm')}
            onDone={() => navigation.navigate('SignUpForm')}
            pages={[
            {
              backgroundColor: `${colors.purple}`,
              image: <AnimatedLottieView 
              source={require('../lottie/balance.json')}
              autoPlay={true}
              loop={true}
              resizeMode={'contain'}
              style={{ width:'100%',marginTop:30 }}
          />,
              title:
              <>
                <StatusBar hidden={true} /> 
                <SafeAreaView style={{ position:'absolute',flex:1,flexDirection:'column',alignItems:'flex-start',height:'100%',width:'100%' }}>
                  <Image  
                    style={{width:'60%',height:180,alignSelf:'center'}} 
                    resizeMode={'contain'} 
                    source={{
                     uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png'
                    }}
                  />
                <Text style={styles.onboardText}>No more cluttered mind</Text>
                </SafeAreaView>
              </>,
              subtitle: '',
            },
            {
              backgroundColor: `${colors.darkPurple}` ,
              image: <AnimatedLottieView 
              source={require('../lottie/balance_two.json')}
              autoPlay={true}
              loop={true}
              resizeMode={'contain'}
              style={{ width:'100%',marginTop:30 }}
          />,
              title: <SafeAreaView style={{ position:'absolute',flex:1,flexDirection:'column',alignItems:'flex-start',height:'100%',width:'100%' }}>
                        <Image  
                        style={{width:'60%',height:180,alignSelf:'center'}} resizeMode={'contain'} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png'}}/>
                <Text style={styles.onboardText}>Save time and do what you love</Text>
                </SafeAreaView>,
              subtitle: '',
            },
            {
              backgroundColor: `${colors.black}`,
              image: <Image 
                resizeMode="contain"
                style={{width:'100%',height:'100%',bottom:-50}} 
                source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/home.png'}} 
                />,
              title: <SafeAreaView style={{ position:'absolute',flex:1,flexDirection:'column',alignItems:'flex-start',height:'100%',width:'100%' }}>
                        <Image  
                        style={{width:'60%',height:180,alignSelf:'center'}} resizeMode={'contain'} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png'}}/>
                    <Text style={styles.onboardText}>Get a cleaner home</Text>
                    </SafeAreaView>,
              subtitle: '',
            },
          ]}
        />
    
    //   <View style={{ width:'100%',height:'100%' }}>
    // <ImageBackground 
    //     style={styles.image}
    //     resizeMode="contain"
    //     source={img}
    // >
    //     <Image style={styles.logo} source={require('../assets/Logo2.png')}/>
    //     <View style={styles.parentText}>
    //         <Text style={styles.smallText}>{smallText}</Text>
    //         <Text style={styles.text}>{text}</Text>
    //     </View>
    //     <TouchableOpacity style={{ bottom: -20 }} activeOpacity={.7} onPress={() => navigation.navigate(nextPage)}>
    //         <View style={styles.parentBtn}>
    //             <View style={styles.nextBtn}>
    //                 <View style={{ width:'70%',alignItems:'center' }}>
    //                     <View style={{ marginLeft:30, height:'100%',justifyContent:'center' }}>
    //                         <Text style={styles.textBtn}>{btnText}</Text>
    //                     </View>
    //                 </View>
    //                 <View style={{ height:'100%',justifyContent:'center' }}>
    //                     <AntDesign name="arrowright" size={44} color="black" />
    //                 </View>
    //             </View>
    //         </View>
    //     </TouchableOpacity>
    // </ImageBackground>
       
    // </View>
  )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        bottom: 100
    },
    logo: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        width: 200,
        height:200
    },
    nextBtn: {
        width: '80%',
        height: 50,
        borderRadius: 20,
        backgroundColor: colors.green,
        flexDirection: 'row',
        elevation: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    parentBtn: {
        // bottom: 50,
        width:'100%',
        flexDirection:'row', 
        justifyContent:'center',
    },
    parentText: {
        height: '60%',
        justifyContent:'center'
    },
    text: {
        width: '80%',
        color: colors.white,
        fontSize: 40,
        marginHorizontal: 25,
        fontFamily: 'viga'
    },
    smallText: {
        width: '70%',
        color:colors.white,
        fontSize: 24,
        marginHorizontal: 25,
        fontWeight: 'bold'
    },
    textBtn: {
        justifyContent: 'center',
        fontSize: 30,
        color: colors.white,
        fontFamily: 'viga'
    },
    onboardText:{
      color:colors.white,
      fontFamily:'viga',
      textAlign:'center',
      width:width,
      fontSize:20,
      position:'absolute',
      top:Platform.OS === 'android' ? height * 0.155 : height * 0.19
    }
});

