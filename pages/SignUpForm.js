import React,{useEffect,useState,useRef} from 'react';
import { StyleSheet, View,Text,Image,Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '../colors/colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import AnimatedLottieView from 'lottie-react-native';

const {width,height} = Dimensions.get('window')
export default function SignUpForm({ navigation }) {
  const [activeSlide,setActiveSlide ] = useState(0)
  const carouselRef = useRef(null)
  var entries = [
    { id:1, text:'You come back from work tired. You see your house is in choas, built up dirt due to procastination or lack of spare time, you get overwhelmed and your mood instantly changes.',bold:'Imagine this...'},
    { id:2, text:'You instruct them on where to clean. You are feeling a bit free now and looking for a nap.',bold:'Then you hire a cleaning service/maid...'},
    { id:2, text:'Your feel more productive and inspired. Only to check on what was cleaned and you still see cobwebs and some hidden dirts and dust.',bold:'You wake up...'},
    { id:2, text:'You look around, only for an item to be missing. Your in shock. You start searching around profusely for what else might have been stolen',bold:'Thats not all...'},
    { id:5, text:'Sign up and we email you the full thing for free obviously.', bold:"We can't finish the story here..."}
    // { id:2, text:'Get depressed again, anxious and the cycle continues...',bold:"You blame yourself"},
    // { id:2, text:'The item, your peace and not only trust cleaning services but trust in your own self.',bold:"But this time, you lost three things..."},
    // { id:2, text:'We could talk and talk about this till tomorrow but first off...',bold:"So what are we trying to say?"},
    // { id:2, text:'Yes. We do not understand what is regular cleans or deep clean. Our default is any of the two(regular clean/deep clean) required to conquer the task. We get the job done and done right.',bold:"WE SEE DIRT, WE CLEAN."},
    // { id:2, text:'Look the main reasons why cleaners/maids have the guts to steal is either because there are no consequences or they are not monitored.',bold:"Thieves? We think not."},
    // { id:2, text:'You can pay someone a very high amount and they would still remain thieves. You should understand that in this Nigeria.',bold:"Here's more"},
  ]
  const renderItem = ({item, index}) => {
    return (
      <View style={{ width:'100%',padding:15,alignItems:'center' }}>
        <Text style={{ textAlign:'center',fontSize:15,color:'#696969' }}><Text style={{ fontWeight:'bold',color:colors.black }}>{item.bold}</Text>{item.text}</Text>
      </View>
    );
  }
  const Pagnation = () => {
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ alignSelf:'center' }}
        dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 4,
            backgroundColor:colors.purple
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
  );
  }
  return (
  <View style={styles.container}>
    <View style={{ height:height / 1.8,backgroundColor:colors.black,borderRadius:30,justifyContent:'center',top:-25 }}>
      {/* <Image resizeMode='contain' style={{ height:'100%',width:'100%' }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/signuponboarding.png'}} /> */}
      <AnimatedLottieView 
        source={require('../lottie/stressed-person.json')}
        autoPlay={true}
        loop={true}
        resizeMode={'contain'}
        style={{ alignSelf:'center',transform:[ {scale:1.25} ] }}
      />
    </View>
      <View style={{ padding:10 }}>
        <Text style={{ fontFamily:'viga',fontSize:28,textAlign:'center' }}>Too much to get done</Text>
      </View>
      <Carousel
        ref={carouselRef}
        data={entries}
        layout={'default'}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={(index) => setActiveSlide(index) }
      />
      <Pagnation />
      <View style={{ padding:10 }}>
      <View style={{ width:'100%',backgroundColor:colors.white,flexDirection:'row',justifyContent:'space-between',marginVertical:20,borderRadius:10 }}>
        <TouchableNativeFeedback onPress={() => navigation.navigate('SignupPage')}>
          <View style={styles.button}>
            <Text style={{ color:colors.white,fontWeight:'bold',fontSize:18 }}>Sign Up</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => navigation.navigate('LoginPage')}>
          <View style={{ ...styles.button, backgroundColor:colors.white }}>
            <Text style={{ color:colors.black,fontWeight:'bold',fontSize:18 }}>Login</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
    {/* <Image style={styles.logo } resizeMode={'contain'} source={require('../assets/logo/BlipmooreLogo(light).png')}/> */}
  </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:'100%',  
    backgroundColor: '#fff',
  },
  logoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end'
  },
  logo: {
      position: 'absolute',
      top: 70,
      alignSelf: 'center',
      width: '60%',
      height:200
  },
  button: {
    width:'50%',
    backgroundColor:colors.black,
    height:'100%',
    padding:width > 375 ? 20 : 15,
    alignItems:'center',
    borderRadius:10
  }
});
