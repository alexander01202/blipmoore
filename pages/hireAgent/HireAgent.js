import { StyleSheet, View,Text,Image,Dimensions,TouchableOpacity,TouchableWithoutFeedback,FlatList, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import React,{useEffect,useState} from 'react';
import { Entypo,AntDesign } from '@expo/vector-icons';
import { colors } from '../../colors/colors'

export default function HireAgent({ navigation }) {
  const { width,height } = Dimensions.get('window')
  const [agents,setAgents] = useState(null)
  const [isPending,setIsPending] = useState(true)
  const star = []
    for (let i = 0; i < 4; i++) {
        star.push(i)
    }
    useEffect( async() => {
      const fetchAllAgent = await fetch(`http://192.168.100.12:19002/fetchAllAgent`)
      const { success,rows } = await fetchAllAgent.json()
    
      if (success) {
        setAgents(rows) 
      }
      setIsPending(false)
    }, [])
  return (
    <View>
      <View style={{ padding:10 }}>
        {
          isPending ? <ActivityIndicator size={'large'} color={colors.yellow} /> :
          agents &&
          <>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('HomePage')}>
            <View style={styles.backIcon}>
              <AntDesign name="arrowleft" style={{ top:Dimensions.get('window').height < 596 ? 10 : 0,shadowColor:'black' }} size={24} color="black" />
            </View>
          </TouchableWithoutFeedback>
        <FlatList 
          // onRefresh={fetchSomeOrders}
          // refreshing={isRefreshing}
          keyExtractor={(item) => item.result.id}
          data={agents}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('AgentProfile',{ agentId:item.result.id,agentName:item.result.company_name,agentBio:item.result.bio })}>
            <View style={{...styles.orders,height:height / 11}}>
              <View style={{ flexDirection:'row' }}>
                <View style={{ height:'100%',width:'16%', justifyContent:'flex-start' }}>
                  {/* <Image style={{width:width > 598 ? '70%' : '100%',height:'100%',borderRadius:50,borderWidth:3,borderColor:colors.yellow}} source={require('../../assets/icon.png')} /> */}
                </View>
                <View style={{ flex:1,alignItems:'flex-end' }}>
                  <Text style={{...styles.text,fontSize:width > 598 ? 20 : 16 }}>{item.result.company_name}</Text>
                  <View style={{ flexDirection:'row',flex:1,alignItems:'center' }}>
                      <Text style={{ color:'gold',fontSize:width > 598 ? 14 : 10,letterSpacing:1,marginHorizontal:width > 598 ? 10 : 5 }}>{item.count} (ratings)</Text>
                        {
                         star.map(item => (
                            <Entypo name="star" size={width > 598 ? 18 : 14} color="black" style={{ color:'gold',letterSpacing:4 }} key={item.toString()} />
                         ))   
                        }      
                    </View>
                    <View style={{ width:'80%',alignItems:'flex-end',justifyContent:'flex-end',flex:1 }}>
                      <Text style={{ color:'white',fontSize:width > 598 ? 14 : 12 }} numberOfLines={1}>{item.result.bio}</Text>
                    </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          )}
        />
        </>
      }
      </View>  
    </View>
  );
}
const styles = StyleSheet.create({
  orders: {
    backgroundColor:colors.black,
    width:'100%',
    height:60,
    alignSelf:'center',
    elevation:5,
    padding:10,
    marginVertical:5
  },
  text: {
    fontFamily:'viga',
    color:colors.white
  },
  backIcon:{
    shadowOpacity:0.2,
    shadowOffset:{ width:5,height:5 },
    shadowColor:colors.black,
    borderRadius:20,
    height:30,
    width:30,
    backgroundColor:colors.white,
    justifyContent:'center',
    alignItems:'center',
    elevation:3,
    marginVertical:10
  },
})