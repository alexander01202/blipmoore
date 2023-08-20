import React from 'react'
import { View,Text,StyleSheet,SafeAreaView, TouchableOpacity } from 'react-native'
import { colors } from '../../colors/colors'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Walkthrough({ navigation }) {
  const doneWithWalkthrough = async() => {
    await AsyncStorage.mergeItem('userData', JSON.stringify({
      walkthrough:'done'
    })
  )
  navigation.navigate('UserDashboard')
  }
  
  return (
    <SafeAreaView>
        <View>
          <Text style={{ fontFamily:'viga',textAlign:'center',textDecorationLine:'underline',fontSize:18,color:colors.yellow }}>A MUST READ!!!(A WALKTHROUGH)</Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            1) If you reach a customers home and the area designated to you to clean is larger than what the user initially set, the user has the option to change to the appropriate option.
          </Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            2) Ensure to always ask for a ratings/comment as this would help increase the amount of people you reach and you are more trusted by other people to enter their homes
          </Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            3) Any negative review from a customer can tremendiously affect your reputation/rating. So please be guided.
          </Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            4) Always contact the customer first before starting to reach to their various homes.
          </Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            4) Regular Cleaning only involves sweeping and moping. Deep Cleaning involves sweeping,mopping,dusting of surfaces,bed arrangements,window cleaning,environment arrangement. ENSURE TO LOOK AT EVERY REQUEST TO BE SURE WHICH TYPE OF CLEANING.
          </Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            5) After every Cleaning, a customer has the choice to hire you or not. Every hire you get increases your ratings significantly, this portrays that you are trustworthy and you performed well
          </Text>
        </View>
        <TouchableOpacity onPress={() => doneWithWalkthrough()}>
          <View style={styles.button}>
            <Text style={{ color:colors.white,fontFamily:'viga' }}>YES. I AM DONE READING</Text>
          </View>
        </TouchableOpacity>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    steps: {
      margin:10
    },
    text: {
      fontFamily:'viga',
      letterSpacing:1.1
    },
    button: {
      backgroundColor: colors.yellow,
      height: 50,
      bottom:-15,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 2, height: 2},
      shadowOpacity: 0.2,
      elevation: 3
    },
})
