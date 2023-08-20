import React,{ useRef,useState } from 'react';
import { StyleSheet,TextInput,Text,TouchableOpacity,Dimensions,Keyboard, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { TapGestureHandler,State } from 'react-native-gesture-handler';
import { colors } from '../../colors/colors';
import { useEffect } from 'react';

export default function Username({ lastname,firstname,changeFirstName,changeLastName,displayEmailPwdComponent,errors,increaseHeight }) {
  const input = useRef(null);
  const secondInput = useRef(null)
  const gestureState = useRef(new Animated.Value(State.UNDETERMINED))
  const [expanded,setExpanded] = useState(true)
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        input.current.blur()
        secondInput.current.blur()
        setExpanded(false)
      }
    );
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (!expanded) {
          setExpanded(true); // or some other action 
        }
      }
    );
      // console.log(input.current)
    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [input.current,secondInput.current])
  return (
    <View style={ expanded ? { top:100 } : null}>
        <TapGestureHandler onBegan={increaseHeight} onEnded={() => input.current.focus()}>
          <Animated.View>
            <Animated.View pointerEvents={'none'}>
              <TextInput 
                ref={input}
                placeholder='First Name'
                style={{...styles.textInput, marginTop: Dimensions.get('window').height < 596 ? 40: 0}}
                placeholderTextColor='black'
                onChangeText={(val) => changeFirstName(val)}
                value={firstname}
                autoFocus={true}
              />
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
        <TapGestureHandler onBegan={increaseHeight} onEnded={() => secondInput.current.focus()}>
          <Animated.View>
            <Animated.View pointerEvents={'none'}>
              <TextInput 
                ref={secondInput}
                placeholder='Last Name'
                style={styles.textInput}
                placeholderTextColor='black'
                onChangeText={(val) => changeLastName(val)}
                value={lastname}
              />
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
        {errors && <Text style={styles.error}>{errors}</Text>}
        <TouchableOpacity onPress={displayEmailPwdComponent}>
            <Animated.View style={styles.button}>
                <Text style={{ fontSize:20,fontWeight:'bold' }}>NEXT</Text>
            </Animated.View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    error: {
        width: '70%',
        position: 'absolute',
        top: -100,
        right:0,
        alignSelf: 'center',
        backgroundColor: 'pink',
        padding: 8,
        fontSize: 15,
        color: 'red',
        margin: 10,
        borderRadius: 4
    },
    textInput: {
        height: Dimensions.get('window').height < 596 ? 40 : 60,
        borderRadius: 10,
        alignItems:'center',
        borderWidth: 0.5,
        marginHorizontal: 30,
        paddingLeft: 20,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
      },
      button: {
        backgroundColor: '#fff',
        height: Dimensions.get('window').height < 596 ? 40 :50,
        margin: Dimensions.get('window').height < 596 ? 10 : 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
});
