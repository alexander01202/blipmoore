import { StyleSheet, Text, View,Image, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../colors/colors'
import { AllKeys } from '../../keys/AllKeys'
import cleaningTask from '../../task.json'

export default function Task({ navigation,route }) {
    const { letters,cleanerId,cleanerName } = route.params
    const [userImage, setImage] = useState(null)
    
    useEffect(() => {
        const fetchUserImage = async() => {
            // const encode = await fetch(`${AllKeys.ipAddress}/encode?string=${Constants.manifest.extra.eas.BACKBLAZE_APPLICATION_KEY_ID + ':' + Constants.manifest.extra.eas.BACKBLAZE_APPLICATION_KEY }`)
            const encode = await fetch(`${AllKeys.ipAddress}/encode?string=${'11198404582a:004a3ff84614f01fe5a6f17c78611128fd3016f631' }`)
            const encodeRes = await encode.text()
    
            const authBackBlaze = await fetch(`https://api.backblazeb2.com/b2api/v2/b2_authorize_account`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;charset=utf-8',
                    "Authorization": "Basic "+ encodeRes
                },
            })
            const { apiUrl,authorizationToken } = await authBackBlaze.json()
            var req = await fetch(`${apiUrl}/b2api/v2/b2_list_file_names`, {
                method: 'POST',
                headers: {
                    "Authorization": `${authorizationToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bucketId : "f1216149f884f0348518021a",
                    prefix: `avatar/${cleanerName}${cleanerId}`
                })
            })
            var res = await req.json()
            if (res.files.length > 0) {
              setImage(`https://f004.backblazeb2.com/file/${__DEV__ ? 'blipmooretest' : 'blipmoore'}/` + res.files[0].fileName)
            }
        }
        if (cleanerId && cleanerName) {
            fetchUserImage()   
        }
    }, [])
    
  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text style={styles.title}>{letters} Task</Text>
        </View>
        <View style={{ elevation:3,backgroundColor:colors.lightPurple,padding:20,justifyContent:'center',alignItems:'center',marginVertical:20,borderRadius:10 }}>
            <Text style={{ fontSize:18 }}>These are the task the {cleanerName ? cleanerName : 'cleaners'} are supposed to do.</Text>
        </View>
        <View>
            <View style={{ marginVertical:10 }}>
                <Text style={{ fontSize:20,letterSpacing:1 }}>Activities</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom:200 }}>
                {
                    cleaningTask && cleaningTask.filter(item => item.space === letters).sort((a, b) => parseFloat(a.id) - parseFloat(b.id)).map(task => (
                        <View key={task.id} style={{ marginVertical:10,flexDirection:'row',width:'100%',justifyContent:'space-between',backgroundColor:'rgba(0,0,0,0.1)',alignItems:'center' }}>
                            <View style={{ borderColor:colors.purple,borderLeftWidth:1,padding:20 }}>
                                <Text style={{ fontSize:12,color:colors.purple }}>{task.time}</Text>
                                <Text style={{ fontSize:16,fontWeight:'bold',marginTop:5 }}>{task.title}</Text>
                            </View>
                            <View style={{ borderRadius:100,width:50,height:50,overflow:'hidden',marginHorizontal:10 }}>
                                <Image style={{ width:'100%',height:'100%' }} resizeMode='contain' source={{ uri:userImage }} />
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    title:{
        fontFamily:'viga',
        fontSize:28,
        textTransform:'capitalize'
    }
})