import React,{useEffect,useState} from 'react';
import { StyleSheet, View,Text,Image,Dimensions,TouchableOpacity,TouchableWithoutFeedback, ImageBackground, ScrollView, TextInput, Button,Animated } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors/colors'
import { useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export function AgentProfileLoading() {
    const { width,height } = Dimensions.get('window')
    const nameX = useRef(new Animated.Value(-300)).current
    // const avatarX = useRef(new Animated.Value(-280)).current
    const featuresX = useRef(new Animated.Value(-100)).current
    const star = []
    for (let i = 0; i < 5; i++) {
        star.push(i)
    }
    useEffect(() => {
        if (width < 598) {
            Animated.loop(
                Animated.timing(featuresX, {
                  toValue:600,
                  useNativeDriver:true,
                  duration:3000
                })
            ).start()
            Animated.loop(
                Animated.timing(nameX, {
                  toValue:500,
                  useNativeDriver:true,
                  duration:3000
                }),
            ).start()   
        }
        //   Animated.loop(
        //       Animated.timing(avatarX, {
        //       toValue:500,
        //       useNativeDriver:true,
        //       duration:3000
        //       }),
        //   ).start()
    }, [])
    
    return(
        <ScrollView style={{ backgroundColor:colors.black }}>
            <View style={{ width:'100%',height:height / 4,marginBottom:100 }}>
                    <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                        <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'120%',left:30,position:'absolute' }} />
                    </Animated.View>
                    <View style={{ width:'100%',maxWidth:'100%',height:'100%',backgroundColor:'#c4c4c4' }}>
                        <View style={{ flex:1,justifyContent:'flex-end',alignItems:'center',transform:[{ translateY:80 }] }}>
                            <View style={{ width:70,height:70, borderRadius:50,borderWidth:3,backgroundColor:'#c4c4c4' }} >
                            {/* <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:avatarX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:30,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View> */}
                            </View>
                                <View style={{...styles.textLoader,marginVertical:5,width:120}} />
                            <View style={{ flexDirection:'row' }}>
                                <View style={{...styles.textLoader,height:15,width:50}} />
                                {
                                star.map((item,index) => (
                                    <Entypo name="star" size={14} color="#c4c4c4" key={index} />
                                ))   
                                }      
                            </View>
                        </View>
                    </View>
            </View>
            <View style={{ flex:1, flexDirection:'row',paddingTop:10,justifyContent:'center',alignItems:'center' }}>
                <TouchableWithoutFeedback>
                    <View style={{ flex:1,flexDirection:'row',alignItems:'center', justifyContent:'center',width:'50%',height:'100%' }}>
                        <Ionicons name="chatbubble-ellipses" size={20} color="#c4c4c4" />
                        <View style={styles.textLoader} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:50,left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={{ flex:1,marginLeft:30 ,justifyContent:'center',width:'50%',height:'100%'}}>
                        <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <View style={{ backgroundColor:'#c4c4c4',borderRadius:50,width:20,height:20,justifyContent:'center',alignItems:'center' }}>
                                <FontAwesome style={{ color:'#c4c4c4' }} name="phone" size={15} color="white" />
                            </View>
                            <View style={styles.textLoader} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:nameX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                            </View>
                        </View>
                    </View> 
                </TouchableWithoutFeedback>
            </View>
            <View style={{ flex:1,alignItems:'center',marginVertical:20 }}>
                <View style={{ ...styles.bio }}>
                    <View style={{...styles.textLoader,marginVertical:2}} >
                        <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                            <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'100%',left:30,position:'absolute' }} />
                        </Animated.View>
                    </View>
                    {/* <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                        <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'100%',left:30,position:'absolute' }} />
                    </Animated.View> */}
                    <View style={{ width:'100%',borderWidth:1,borderColor:'#c4c4c4',marginBottom:10 }}></View>
                    <View style={{ flex:1,justifyContent:'center' }}>
                        <Text style={{ fontStyle:'italic' }}></Text>
                    </View>
                </View>
            </View>
            <View style={{ flex:1,alignItems:'center',marginVertical:10 }}>
                <View style={{ ...styles.bio }}>
                    <View style={{ flexDirection:'row',flex:1 }}>
                        <View style={styles.textLoader} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                            <View style={{ flex:1,alignItems:'flex-end',marginBottom:5 }}>
                                <View style={styles.textLoader} >
                                <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:nameX }],position:'absolute',zIndex:1 }} >
                                    <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'100%',left:30,position:'absolute' }} />
                                </Animated.View>
                                </View>
                            </View>  
                    </View>
                    <View style={{ width:'100%',borderWidth:1,borderColor:colors.yellow,marginBottom:10 }}></View>
                    <View>
                        <View style={{...styles.textLoader,marginVertical:5,width:'80%'}} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:30,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                        <View style={{...styles.textLoader,marginVertical:5,width:'80%'}} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:30,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                        <View style={{...styles.textLoader,marginVertical:5,width:'80%'}} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:30,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                        <View style={{...styles.textLoader,marginVertical:5,width:'80%'}} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:30,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                        <View style={{...styles.textLoader,marginVertical:5,width:'80%'}} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:30,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                    </View>
                    <Text style={{ marginVertical:10,fontStyle:'italic',color:colors.yellow }}>Note that Deep Cleaning is an additional fee to each Area/Rooms.</Text>
                </View>
            </View>
            <View style={{ padding:20 }}>
                <View style={{...styles.textLoader,marginVertical:5,height:15}} />
                <View style={{ width:'100%',borderWidth:1,borderColor:'#c4c4c4',marginBottom:10 }}></View>
                    <View>
                        <View style={{ minHeight:80,marginVertical:5,backgroundColor:'#c4c4c4' }} >
                            <Animated.View style={{ width:'100%',height:'100%',transform:[{ translateX:featuresX }],position:'absolute',zIndex:1 }} >
                                <LinearGradient colors={['transparent','rgba(27,29,36,0.5)', 'transparent']}  start={{ x:1,y:1 }} style={{width:50,height:'100%',left:30,position:'absolute' }} />
                            </Animated.View>
                        </View>
                        <View style={{ flexDirection:'row',marginVertical:10 }}>
                            {
                            star.map((item,index) => (
                                <TouchableWithoutFeedback key={index}>
                                    <Entypo name="star" size={24} style={{ color:'#c4c4c4',letterSpacing:4 }} key={item.toString()} />
                                </TouchableWithoutFeedback>
                            ))   
                            }      
                        </View>
                        <Button title='Post' color={'#c4c4c4'} /> 
                    </View>
                <View>
            </View>
        </View>
    </ScrollView>
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
        backgroundColor:'#c4c4c4',
        opacity:0.4,
        minHeight:100,
        padding:10,
    },
    textLoader: {
        backgroundColor:'#c4c4c4',
        width:100,
        height:20,
        marginHorizontal:5,
        borderRadius:20 
    }
})
