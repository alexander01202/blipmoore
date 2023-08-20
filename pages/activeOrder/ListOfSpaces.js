import { StyleSheet, Text, TouchableNativeFeedback, View,ScrollView, TextInput,InteractionManager } from 'react-native'
import { MaterialIcons,MaterialCommunityIcons,FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Progress from 'react-native-progress';
import { colors } from '../../colors/colors'
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import { AllKeys } from '../../keys/AllKeys';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function ListOfSpaces({ navigation,route }) {
    const { id } = useSelector(state => state.login)
    const [space,setSpace] = useState({ bedroom:false,kitchen:false,balcony:false,toilet:false,walkway:false,store:false,closet:false })
    const isFocused = useIsFocused();
    const [instructions,setInstructions] = useState({ bedroom:[],closet:[],toilet:[],walkway:[],store:[],kitchen:[],balcony:[] })
    const [isPending,setIsPending] = useState(true)
    const [progress, setProgress] = useState({ bedroom:0,kitchen:0,balcony:0,toilet:0,walkway:0,store:0,closet:0 })
    const { subActiveOrder } = route.params
    const { places } = subActiveOrder

    useEffect(() => {
        InteractionManager.runAfterInteractions(async() => {
           await fetchInstr()
           await fetchProgress()
           setIsPending(false)
        })
    }, [isFocused])
    const fetchInstr = async() => {
        const req  = await fetch(`${AllKeys.ipAddress}/fetchInstructions?id=${id}`)
        const { rows,success } = await req.json()
        if (success) {
         var bedroom = []
         var closet = []
         var balcony = []
         var toilet = []
         var store = []
         var kitchen = []
         var walkway = []
         for (let i = 0; i < rows.length; i++) {
              if (rows[i].space === 'bedroom') {
                 bedroom.push(rows[i].instruction)
              }else if (rows[i].space === 'closet') {
                 closet.push(rows[i].instruction)
              }else if (rows[i].space === 'balcony') {
                 balcony.push(rows[i].instruction)
              }else if (rows[i].space.includes('toilet')) {
                 toilet.push(rows[i].instruction)
              }else if (rows[i].space === 'store') {
                 store.push(rows[i].instruction)
              }else if (rows[i].space === 'kitchen') {
                 kitchen.push(rows[i].instruction)
              }else if (rows[i].space === 'walkway') {
                 walkway.push(rows[i].instruction)
              }
         }
         setInstructions(preEvents => {
            return {...preEvents, 
                bedroom:[...bedroom],
                closet:[...closet],
                balcony:[...balcony],
                toilet:[...toilet],
                store:[...store],
                kitchen:[...kitchen],
                walkway:[...walkway]
            }
         })
        }
    }
    const fetchProgress = async() => {
        var time = moment().startOf('day') 
        const request = await fetch(`${AllKeys.ipAddress}/fetchSpaceProgress?sub_id=${route.params.subActiveOrder.id}&time=${time}`)
        const res =  await request.json()
        if (res.success) {
            var bedroom = 0
            var closet = 0
            var balcony = 0
            var toilet = 0
            var store = 0
            var kitchen = 0
            var walkway = 0
            for (let i = 0; i < res.rows.length; i++) {
                if (res.rows[i].place === 'bedroom') {
                    bedroom += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'closet') {
                    closet += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'balcony') {
                    balcony += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place.includes('toilet')) {
                    toilet += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'store') {
                    store += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'kitchen') {
                    kitchen += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'walkway') {
                    walkway += Number(res.rows[i].progress_bar)
                }
            }
            setProgress(preEvents => {
                return {...preEvents,bedroom,closet,balcony,store,walkway,kitchen,toilet}
            })
        }
    }
    const showInput = (letters) => {
        if (letters === 'bedroom') {
            setSpace(preEvents => {
                return {...preEvents, bedroom:!space.bedroom}
            })
        }else if (letters === 'kitchen') {
            setSpace(preEvents => {
                return {...preEvents, kitchen:!space.kitchen}
            })
        }else if (letters === 'balcony') {
            setSpace(preEvents => {
                return {...preEvents, balcony:!space.balcony}
            })
        }else if (letters.includes('toilet')) {
            setSpace(preEvents => {
                return {...preEvents, toilet:!space.toilet}
            })
        }else if (letters === 'walkway') {
            setSpace(preEvents => {
                return {...preEvents, walkway:!space.walkway}
            })
        }else if (letters === 'store') {
            setSpace(preEvents => {
                return {...preEvents, store:!space.store}
            })
        }else if (letters === 'closet') {
            setSpace(preEvents => {
                return {...preEvents, closet:!space.closet}
            })
        }
    }
    const updateInstructions = (val,letters) => {
        if (letters === 'bedroom') {
           setInstructions(preEvents => {
                return {...preEvents, bedroom:[...instructions.bedroom,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, bedroom:!space.bedroom}
            })
        }else if (letters === 'kitchen') {
            setInstructions(preEvents => {
                return {...preEvents, kitchen:[...instructions.kitchen,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, kitchen:!space.kitchen}
            })
        }else if (letters === 'balcony') {
            setInstructions(preEvents => {
                return {...preEvents, balcony:[...instructions.balcony,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, balcony:!space.balcony}
            })
        }else if (letters.includes('toilet')) {
            setInstructions(preEvents => {
                return {...preEvents, toilet:[...instructions.toilet,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, toilet:!space.toilet}
            })
        }else if (letters === 'walkway') {
            setInstructions(preEvents => {
                return {...preEvents, walkway:[...instructions.walkway,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, walkway:!space.walkway}
            })
        }else if (letters === 'store') {
            setInstructions(preEvents => {
                return {...preEvents, store:[...instructions.store,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, store:!space.store}
            })
        }else if (letters === 'closet') {
            setInstructions(preEvents => {
                return {...preEvents, closet:[...instructions.closet,val]}
            })
            setSpace(preEvents => {
                return {...preEvents, closet:!space.closet}
            })
        }
        fetch(`${AllKeys.ipAddress}/updateInstructions?space=${letters}&instruction=${val}&id=${id}`)
    }
    const deleteInstruction = (instr,letters) => {
        if (letters === 'bedroom') {
            setInstructions(preEvents => {
                var newInstr = instructions.bedroom.filter(e => e !== instr)
                return {...preEvents, bedroom:[...newInstr]}
            })
        }else if (letters === 'kitchen') {
            setInstructions(preEvents => {
                var newInstr = instructions.kitchen.filter(e => e !== instr)
                return {...preEvents, kitchen:[...newInstr]}
            })
        }else if (letters === 'balcony') {
            setInstructions(preEvents => {
                var newInstr = instructions.balcony.filter(e => e !== instr)
                return {...preEvents, balcony:[...newInstr]}
            })
        }else if (letters.includes('toilet')) {
            setInstructions(preEvents => {
                var newInstr = instructions.toilet.filter(e => e !== instr)
                return {...preEvents, toilet:[...newInstr]}
            })
        }else if (letters === 'walkway') {
            setInstructions(preEvents => {
                var newInstr = instructions.walkway.filter(e => e !== instr)
                return {...preEvents, walkway:[...newInstr]}
            })
        }else if (letters === 'store') {
            setInstructions(preEvents => {
                var newInstr = instructions.store.filter(e => e !== instr)
                return {...preEvents, store:[...newInstr]}
            })
        }else if (letters === 'closet') {
            setInstructions(preEvents => {
                var newInstr = instructions.closet.filter(e => e !== instr)
                return {...preEvents, closet:[...newInstr]}
            })
        }
        fetch(`${AllKeys.ipAddress}/deleteInstruction?space=${letters}&instruction=${instr}&id=${id}`)
    }
    const editInstruction = () => {

    }
  return (
    <SafeAreaView style={styles.container}>
        <AnimatedLoader 
          visible={isPending}
          source={require('../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <ScrollView>
            {
              places.split(',').map(place => {
                var letters = place.replace(/[^a-z]/g, '')
                var number = place.replace(/[^0-9]/g, '')
                return (
                  <View style={styles.placeContainer} key={place}>
                      <TouchableNativeFeedback onPress={() => navigation.navigate('Space', {letters,number,subActiveOrder})}>
                            <View style={styles.place}>
                                <Text style={{ fontWeight:'bold',letterSpacing:1 }}>{number} {letters}</Text>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                            </View>
                      </TouchableNativeFeedback>
                      <View style={{ marginVertical:10 }}>
                        <Progress.Bar color={colors.purple} progress={
                            letters === 'bedroom' ? 
                            progress.bedroom / number :
                            letters === 'closet' ? 
                            progress.closet / number :
                            letters === 'balcony' ? 
                            progress.balcony / number :
                            letters.includes('toilet') ? 
                            progress.toilet / number :
                            letters === 'wallway' ? 
                            progress.walkway / number :
                            letters === 'store' ? 
                            progress.store / number :
                            letters === 'kitchen' ? 
                            progress.kitchen / number :
                            0
                        } width={null} borderWidth={1} />
                      </View>
                      <TouchableNativeFeedback onPress={() => showInput(letters)}>
                        <View style={styles.instruction}>
                            <Text>Give instructions on {letters}</Text>
                            <MaterialCommunityIcons name="arrow-down-drop-circle-outline" size={24} color="black" />
                        </View>
                      </TouchableNativeFeedback>
                      {
                        letters === 'bedroom' && instructions.bedroom.length > 0 &&
                            <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.bedroom.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'kitchen' && instructions.kitchen.length > 0 &&
                            <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.kitchen.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'closet' && instructions.closet.length > 0 &&
                            <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.closet.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'balcony' && instructions.balcony.length > 0 &&
                             <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.balcony.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters.includes('toilet') && instructions.toilet.length > 0 &&
                            <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.toilet.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'walkway' && instructions.walkway.length > 0 &&
                             <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.walkway.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'store' && instructions.store.length > 0 &&
                            <>
                                <View>
                                    <Text style={{ fontFamily:'viga' }}>Instructions</Text>
                                </View>
                                {
                                    instructions.store.map(instr => (
                                        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                          <TouchableNativeFeedback onPress={() => editInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'85%'}}>
                                                <Text>{instr}</Text>
                                            </View>
                                          </TouchableNativeFeedback>
                                          <TouchableNativeFeedback onPress={() => deleteInstruction(instr,letters)}>
                                            <View style={{...styles.instruction,width:'10%'}}>
                                                <FontAwesome name="trash-o" size={24} color="red" />
                                            </View>
                                          </TouchableNativeFeedback>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'bedroom' && space.bedroom
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        letters === 'kitchen' && space.kitchen
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        letters === 'closet' && space.closet
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        letters === 'toiletbathroom' && space.toilet
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        letters === 'balcony' && space.balcony
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        letters === 'walkway' && space.walkway
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        letters === 'store' && space.store
                        ?
                        <View style={styles.instruction}>
                            <TextInput autoFocus={true} onSubmitEditing={(event) => updateInstructions(event.nativeEvent.text,letters)} />
                        </View>
                        :
                        null
                      }
                  </View>
                )
              })
            }
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    placeContainer:{
        backgroundColor:'#dcdcdc',
        marginVertical:10,
        padding:10,
        borderRadius:5
    },
    place:{
        padding:5,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    instruction:{
        backgroundColor:'#FAF9F6',
        borderWidth:1,
        borderColor:'#c4c4c4',
        borderRadius:5,
        padding:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5
    },
    lottie:{
        height:100,
        width:100
    }
})