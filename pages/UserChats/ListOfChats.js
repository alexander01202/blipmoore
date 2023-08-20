import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View,StyleSheet,Dimensions, TouchableOpacity,BackHandler, TouchableNativeFeedback, ScrollView } from 'react-native'
import { useEffect,useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo,Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors/colors';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import MyModal from '../../components/modal';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';
import { StreamChat } from 'stream-chat';
import { ChannelList, Chat,OverlayProvider,Channel,MessageInput, MessageList,ChannelAvatar } from 'stream-chat-expo';
import { AllKeys } from '../../keys/AllKeys';
// import { useChatClient } from '../../hooks/UseChatClient';
import { CometChat } from '@cometchat-pro/react-native-chat'
import FastImage from 'react-native-fast-image';

const client = StreamChat.getInstance('449vt742ex2f');
const { width,height } = Dimensions.get('window')
export default function ListOfChats({ navigation,channelId }) {
    const [chats, setChats] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const { id,displayName } = useSelector(state => state.login)
    // const { clientIsReady } = useChatClient(id,displayName);
    const [channel, setChannel] = useState(null)
    const [conversationList, setConversationList] = useState([])
    const isFocused = useIsFocused();
    // let conv = {
    //   conversationId:1,
    //   conversationType:'user',
    //   lastMessage:'I miss alex. Where is he??? OMG',
    //   conversationWith:{
    //     name:'Zikora',
    //     avatar:'https://f004.backblazeb2.com/file/blipmoore/web+images/logo/transparent_white_logo.png',
    //     uid:31
    //   },
    //   unreadMessageCount:20
    // }
    useEffect(() => {
      async function getConvo(){
        if (channelId) {
          setChannel(channelId)
          return 
        }
        var arr = []
        let limit = 30;
        let conversationsRequest = new CometChat.ConversationsRequestBuilder()
                                    .setLimit(limit)
                                    .build();
        conversationsRequest.fetchNext().then(
          conversationList => {
            // console.log("new Conversations list received:", conversationList[0].getLastMessage());
            conversationList.map(list => {
              arr.push(
                {
                  conversationId:list.getConversationId(),
                  conversationType:list.getConversationType(),
                  conversationWith:list.getConversationWith(),
                  lastMessage:list.getLastMessage().text,
                  unreadMessageCount:list.getUnreadMessageCount()
                }
              )
            })
            setConversationList(arr)
            setIsLoading(false)
            // var arr = []
            // arr.push(conversationList[0])
            // setConversationList([conversationList[0]])
          }, error => {
            setIsLoading(false)
            console.log("Conversations list fetching failed with error:", error);
          }
        );
        const req = await fetch(`${AllKeys.ipAddress}/fetchHiredCleaners?userid=${id}`)
        // const getSuperviosrJobs = await fetch(`${AllKeys.ipAddress}/fetchSupervisorJobs?cleanerId=${id}`)
        // const res = await getSuperviosrJobs.json()
        const { rows,success } = await req.json()
        var arr = []
        var homeArr = []
      }
      getConvo()
    }, [isFocused])
    useEffect(() => {
      const unsubscribe = BackHandler.addEventListener('hardwareBackPress', (e) => {
        if (channel) {
          setChannel(null)
          return true 
        }
      });
    
      return () => {
        unsubscribe.remove()
      }
    }, [channel])
    const emptyStateIndicator = () => (
      <View style={{ width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}>
          <Entypo name="chat" size={154} color="#c4c4c4" />
          <Text style={{ fontFamily:'viga',fontSize:16 }}>No Chats Yet</Text>
      </View>
    )  
    const PreviewAvatar = ({ channel }) => (
      <ChannelAvatar channel={channel} />
      // <View style={styles.avatar}>
      //     <Text style={{ fontFamily:'Funzi',fontSize:24,color:colors.whitishBlue }}>{item.name_of_business.slice(0,1)}</Text>
      // </View>
    )
  return (
    <>
    {
      isLoading ?
    <AnimatedLoader 
      visible={isLoading}
      overlayColor="rgba(225,225,225,1)"
      source={require('../../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    :
    <SafeAreaView style={{flex: 1}}>
     {
      conversationList.length > 0
      ?
      <ScrollView style={{flex: 1}}>
        {
          conversationList.map(conv => (
            <TouchableNativeFeedback key={conv.conversationId}>
            <View style={styles.chatList}>
              <View style={{ marginHorizontal:5,flexDirection:'row',alignItems:'center' }}>
                <Ionicons name="person-circle-sharp" size={54} color="black" />
                {/* <FastImage source={{ uri:conv.conversationWith.avatar,priority:FastImage.priority.normal }} resizeMode={FastImage.resizeMode.contain} style={{ width:'80%' }} /> */}
                <View style={{ flexDirection:'column',marginHorizontal:5,width:'70%' }}>
                  <View>
                    <Text style={{ fontFamily:'viga',letterSpacing:1.2,fontSize:16,color:colors.black }}>{conv.conversationWith.name}</Text>
                  </View>
                  <View>
                    <Text numberOfLines={1} style={{ fontSize:14,color:colors.black,opacity:0.5 }}>{conv.lastMessage}</Text>
                  </View>
                </View>
                {
                Number(conv.unreadMessageCount) > 0 &&
                  <View style={{ justifyContent:'flex-end',alignItems:'flex-end',height:40 }}>
                    <View style={{ backgroundColor:colors.purple,borderRadius:100,padding:5,width:25 }}>
                      <Text style={{ color:colors.white,fontFamily:'viga',fontSize:12,textAlign:'center' }}>{conv.unreadMessageCount}</Text>
                    </View>
                  </View>
                }
              </View>
            </View>
          </TouchableNativeFeedback>
          ))
        }
      </ScrollView>
      :
      <View style={{ width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}>
          <Entypo name="chat" size={154} color="#c4c4c4" />
          <Text style={{ fontFamily:'viga',fontSize:16 }}>No Chats Yet</Text>
      </View>
     }
    </SafeAreaView>
      // <OverlayProvider>
      //   <Chat client={client}>
      //     {
      //       channel ?
      //       <View style={{ flex:1 }}>
      //         <Channel channel={channel}>
      //         <View style={styles.header}>
      //           <TouchableOpacity onPress={() => setChannel(null)}>
      //             <AntDesign name="arrowleft" size={28} color="black" />
      //           </TouchableOpacity>
      //           <Text style={{ fontFamily:'viga',fontSize:24,marginLeft:30 }}>Chats</Text>
      //         </View>
      //           <MessageList />
      //           <MessageInput />
      //         </Channel>
      //       </View>
      //       :
      //       <View style={{ flex:1 }}>
      //         <View style={styles.header}>
      //           <TouchableOpacity onPress={() => navigation.navigate('MainScreens',{ screen:'Home' })}>
      //             <AntDesign name="arrowleft" size={28} color="black" />
      //           </TouchableOpacity>
      //           <Text style={{ fontFamily:'viga',fontSize:24,marginLeft:30 }}>Chats</Text>
      //         </View>
      //         <ChannelList PreviewAvatar={PreviewAvatar} numberOfSkeletons={10} onSelect={(channel) => setChannel(channel)} EmptyStateIndicator={emptyStateIndicator} />
      //       </View>
      //     }
      //   </Chat>
      // </OverlayProvider> 
      }
    </>
  )
}
const styles = StyleSheet.create({
  header:{
    width:'100%',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'white',
    padding:10,
    paddingVertical:15
  },
  chatList:{
    backgroundColor:colors.grey,
    margin:20,
    borderRadius:10,
    paddingHorizontal:5,
    paddingVertical:10,
    flexDirection:'row',
    overflow:'hidden',
    alignItems:'center'
  },
  lottie:{
    height:100,
    width:100
  }
})