import { StyleSheet,View,Image,Text,Dimensions,TouchableWithoutFeedback,Animated, TouchableOpacity, StatusBar, Platform } from 'react-native';
import FlashMessage from "react-native-flash-message";
import Firstpage from './pages/firstpage';
import SignUpForm from './pages/SignUpForm';
import OrderCleaner from './pages/OrderCleaner';
import HireAgent from './pages/hireAgent/HireAgent';
import StartUpScreen from './screens/StartUpScreen';
import AuthReducer from './redux/reducer/AuthReducer'

import { createStore,combineReducers,applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import * as Application from 'expo-application';

import ReduxThunk from 'redux-thunk'

import FastImage from 'react-native-fast-image'
import 'react-native-gesture-handler';
import * as React from 'react';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// import AppLoading from 'expo-app-loading';
import * as Animatable from 'react-native-animatable';
import { CometChat } from '@cometchat-pro/react-native-chat'

import { Feather,MaterialIcons,AntDesign,Entypo,Ionicons,MaterialCommunityIcons,FontAwesome } from '@expo/vector-icons';

import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';

import * as Notifications from 'expo-notifications'

import { useAssets,Asset } from 'expo-asset'
import { useState,useEffect,useRef,forwardRef } from 'react';
import { colors } from './colors/colors';
import LocationReducer from './redux/reducer/Location';

import HomeHeader from './components/headerComp/HomeHeader';
import Settings from './pages/Settings';
import BecomeCleaner from './pages/BecomeCleaner';
import Dashboard from './pages/cleanerPages/Dashboard';
import RequestPage from './pages/cleanerPages/RequestPage';
import CleanerMapPreview from './pages/cleanerPages/CleanerMapPreview';
import Walkthrough from './pages/cleanerPages/Walkthrough';
// import TimerPage from './pages/cleanerPages/components/TimerModal';
import OrderReducer from './redux/reducer/OrderReducer';
import HireCleanerPage from './pages/HireCleanerPage';
import Subscriptions from './pages/Subscriptions';
import RegisterAgent from './pages/AgentPages/RegisterAgent';
import AgentDashboard from './pages/AgentPages/AgentDashboard';
import AgentProfile from './pages/hireAgent/AgentProfile';
import HireAgentPage from './pages/hireAgent/HireAgentPage';
import ListOfChats from './pages/UserChats/ListOfChats';
import ChatPage from './pages/UserChats/ChatPage';
import CleanerOrderReducer from './redux/reducer/CleanerOrder';
import CompanyAccountPage from './pages/CompanyAccountPage';
import Support from './pages/support';
import HomePage from './pages/HomePage';
import Login from './pages/AuthPages/Login';
import Signup from './pages/AuthPages/Signup';
import ChatHeader from './components/headerComp/chatHeader';
import Subscription from './pages/subscribe/Subscription';
import Address from './pages/profilePages/Address';
import Enterprise from './pages/subscribe/Enterprise';
import PaymentOnboarding from './pages/subscribe/PaymentOnboarding';
import OrderOverview from './pages/ordersPages/orderOverview';
import Pricing from './pages/Pricing';
import HomeSubscription from './pages/subscribe/HomeSubscription';
import AfterPayment from './pages/subscribe/AfterPayment';
import CancelSuccess from './pages/ordersPages/CancelSuccess';
import UpdateAppModal from "./pages/component/UpdateAppModal"
import { AllKeys } from './keys/AllKeys';
import { StreamChat } from 'stream-chat';
import ListOfSpaces from './pages/activeOrder/ListOfSpaces';
import EachSpace from './pages/activeOrder/EachSpace';
import Task from './pages/activeOrder/Task';
import { mixpanel } from './components/MixPanel';
import Summary from './pages/subscribe/Summary';

import moment from 'moment';
import * as Sentry from 'sentry-expo';
import { AllKey } from "@env"
import ForgottenPwd from './pages/AuthPages/ForgottenPwd';
Sentry.init({
  dsn: 'https://670da5cb0a784375a636300d46ca104a@o4503954165530624.ingest.sentry.io/4503954217828352',
  enableInExpoDevelopment: true,
  enableNative: false,
  debug: __DEV__ ? true : false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});
mixpanel.init();
mixpanel.track('Opened app');
mixpanel.getPeople().increment(`${moment().format('YYY')} ${moment().format('MMMM')} visit`, 1);
mixpanel.getPeople().increment(`${moment().format('YYY')} visit`, 1);

const client = StreamChat.getInstance('449vt742ex2f');
Notifications.setNotificationHandler({
  handleNotification: async() => {
    return {
      shouldShowAlert: true,
      shouldPlaySound:true,
      shouldSetBadge:true
    }
  }
})


const persistConfig = {
  key: 'root',
  storage:AsyncStorage,
}
const rootReducers = combineReducers({
  login:AuthReducer,
  location: LocationReducer,
  Order:OrderReducer,
  cleanerOrder:CleanerOrderReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducers)
const AllReducers = createStore(persistedReducer,applyMiddleware(ReduxThunk))
let persistor = persistStore(AllReducers)

const {width, height } = Dimensions.get('window')

// const MyTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: '#353839'
//   },
// };

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady,setIsReady] = useState(false)
  const [assets, error] = useAssets(['https://f004.backblazeb2.com/file/blipmoore/app+images/ordernow.png'])
  const [getAuth,setAuth] = useState(null)
  const [checkOrder, setCheckOrder] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [userDets, setUserDets] = useState(null)
  const [role,setRole] = useState('customer')
  const [cleanerWalkthrough,setCleanerWalkthrough] = useState('incompleted')
  const [streamChatConnected, setStreamChatConnected] = useState(false)
  const [initialChannelId, setInitialChannelId] = useState(null)
  const [updateApp, setUpdateApp] = useState(false)
  const nav = useRef()

  useEffect(() => {
    const _loadAssetsAsync = async() => {
      const imageUrls = [
        'ordernow.png',
        'reading.png',
        'confused.png',
        'home.png',
        'logo/logo.png',
        'signup-page.png',
        'splash.png',
        'signuponboarding.png',
        'login_background_purple.png',
        'login_background2_purple.png',
        'login_background3_purple.png',
        'cleaner.png',
    ];
    
    const baseUrl = 'https://f004.backblazeb2.com/file/blipmoore/app+images/';
    const headers = { Authorization: 'someAuthToken' };
    
    const imagePreloadData = imageUrls.map(url => ({ uri: baseUrl + url, headers }));
    
    FastImage.preload(imagePreloadData);    
      const imageAssets = cacheImages([imageUrls.map(url => ({ uri: baseUrl + url }))]);
  
      function cacheImages(images) {
        return images.map(image => {
          if (typeof image === 'string') {
            return Image.prefetch(image);
          } else {
            return Asset.fromModule(image).downloadAsync();
          }
        });
      }
      function cacheFonts(fonts) {
        return fonts.map(font => Font.loadAsync(font));
      }
      const fontAssets = cacheFonts([FontAwesome.font,Ionicons.font,Entypo.font,MaterialCommunityIcons.font,Feather.font,AntDesign.font]);
    
      await Promise.all([...imageAssets,...fontAssets])
      const req = await fetch(`${AllKeys.ipAddress}/checkVersion?version=${Application.nativeApplicationVersion}`)
      const { success } = await req.json()
      if (!success) {
        setUpdateApp(true)
      }else{
        setUpdateApp(false)
      }
      setIsReady(true)
      SplashScreen.hideAsync();
    }
    _loadAssetsAsync()
    
  }, [])
  
  // useEffect(() => {
  //   const compareVersion = async() => {
  //     const req = await fetch(`${AllKeys.ipAddress}/checkVersion?version=${Application.nativeApplicationVersion}`)
  //     const { success } = await req.json()
  //     console.log(success)
  //     if (!success) {
  //       setUpdateApp(true)
  //     }else{
  //       setUpdateApp(false)
  //     }
  //   }
  //   compareVersion()
  // }, [])
  
  useEffect(() => {
    if (nav.current) {
      bootstrap()
      if(Platform.OS == 'ios'){
      const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
        // Notification caused app to open from background state on iOS
        const channelId = remoteMessage.data?.channel_id;
        // The navigation logic, to navigate to relevant channel screen.
        if (channelId) {
          nav.current?.navigate('MainScreens', {screen:'Chat', params:{channelId} });
        }
      });
      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // Notification caused app to open from quit state on iOS
          const channelId = remoteMessage.data?.channel_id;
          // Start the app with the relevant channel screen.
          setInitialChannelId(channelId)
        }
      });
      }else{
        notifee.onBackgroundEvent(async ({ detail, type }) => {
          if (type === EventType.PRESS) {
            // user press on notification detected while app was on background on Android
            const channelId = detail.notification?.data?.channel_id;
            if (channelId) {
              nav.current?.navigate('MainScreens', {screen:'Chat', params:{channelId} });
            }
            await Promise.resolve();
          }
        });
      
        notifee.getInitialNotification().then(initialNotification => {
          if (initialNotification) {
            // Notification caused app to open from quit state on Android
            const channelId = initialNotification.notification.data?.channel_id;
            // Start the app with the relevant channel screen.
            setInitialChannelId(channelId)
          }
        });
      }
    }
  }, [nav.current]);
   // Bootstrap sequence function
   async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      nav.current.navigate('ActiveJobs')
      console.log('Notification caused application to open', initialNotification.notification);
      console.log('Press action used to open the app', initialNotification.pressAction);
    }
  }
  useEffect(() => {
    const getActiveOrder = async() => {
      var date = moment().startOf('day').valueOf()
      const req = await fetch(`${AllKeys.ipAddress}/userSubActiveOrder?id=${userDets.id}&date=${date}`)
      const { rows,success } = await req.json()
      if (success) {
        var arr = []
        setIsActive(moment(rows.next_cleaning_order).isSame(new Date(), 'hour'))
        for (let i = 0; i < rows.length; i++) {
          const request = await fetch(`${AllKeys.ipAddress}/fetchPlanInfo?sub_id=${rows[i].id}`)
          const { success,row } = await request.json()
          if (success) {
            var obj = { planName:row[0].plan_name,planDesc:row[0].plan_desc }
            arr.push({...rows[i],...obj})
          } 
        }
        setCurrentOrder(arr) 
      }
      setTimeout(() => {
        setCheckOrder(true) 
      }, 1000);
    }
    const checkUserExist = async(id) => {
      const res = await fetch(`${AllKeys.ipAddress}/GetId?id=${id}`)
      const { success } = await res.json()
      if (success) {
        return
      }else{
        CometChat.logout().then(
          () => {
            console.log("Logout completed successfully");
          },error=>{
            console.log("Logout failed with exception:",{error});
          }
        );
        AsyncStorage.removeItem('userData')
        setAuth(false)
        setUserDets(false)
      }
    }
    // userDets && !checkOrder
    if (userDets) {
      // getActiveOrder() 
      checkUserExist(userDets.id)
      var UID = userDets.id;
      var authKey = AllKeys.COMET_AUTH_KEY;
      CometChat.getLoggedinUser().then(
      	user => {
        	if(!user){
      			CometChat.login(UID, authKey).then(
              user => {
                console.log("Login Successful:", { user });
              }, error => {
                console.log("Login failed with exception:", { error });
              }
            );
          }
      	}, error => {
      		console.log("Something went wrong", error);
      	}
      );
    }
  }, [userDets])
  useEffect(() => {
    let unsubscribeTokenRefreshListener;
    // Register FCM token with stream chat server.
    const fetchUserChatToken = async() => {
      // const { id,displayName } = userDets
      // const req = await fetch(`${AllKeys.ipAddress}/getUserToken?userid=${id}`)
      // const { token } = await req.json()
      // await client.connectUser(
      //     {
      //         id: `${id}`,
      //         name: `${displayName}`,
      //         image: `https://getstream.io/random_svg/?name=${displayName}`,
      //     },
      //    `${token}`,
      // );
      await requestPermission();
      // await registerPushToken(id);
    }
    if (userDets && !streamChatConnected) {
      fetchUserChatToken() 
      setStreamChatConnected(true)
    }
    return async() => {
      await client.disconnectUser()
      unsubscribeTokenRefreshListener?.()
    }
  }, [userDets,streamChatConnected])
   // Request Push Notification permission from device.
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
  
  const unsubscribe = AllReducers.subscribe(() => {
    // console.log(AllReducers.getState().login)
    var newAuth = AllReducers.getState().login
    if (getAuth != newAuth.AuthIsReady) {
        setRole(newAuth.role)
        setUserDets(newAuth)
        setAuth(newAuth.AuthIsReady)
    }
    if (role !== newAuth.role) {
        setRole(newAuth.role)
    }
  })


  // const Tab = createMaterialTopTabNavigator();
  const Tab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ justifyContent:'center',alignItems:'center' }}>
          <Image style={{ width:'60%',height:100 }} resizeMode={'contain'} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png'}}/>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }
  
  const AllHomePages = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown:false }} initialRouteName='OrderCleaner'>
        <Stack.Screen initialParams={{mixpanel:mixpanel}} name="OrderCleaner">
          {props => (
            <HomePage {...props} updateApp={updateApp} isActive={isActive} mixpanel={mixpanel} activeOrder={currentOrder} />
          )}
        </Stack.Screen>
        <Stack.Screen name='Pricing' component={Pricing} />
        <Stack.Screen options={{
            header: () => (
              <View style={{ backgroundColor:colors.black,justifyContent:'center',alignItems:'center' }}>
                <Image style={{ width:'40%',height:80 }} resizeMode={'contain'} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png'}}/>
                <Text style={{ bottom:10,fontFamily:'viga',color:colors.white,fontSize:13 }}>STOP HAVING TO DEAL WITH HIRING CLEANERS</Text>
              </View>
            )
          }} name="Enterprise" component={Enterprise}/>
        <Stack.Screen
          options={{
            header: () => (
              <View style={{ backgroundColor:colors.black,justifyContent:'center',alignItems:'center' }}>
                <Image style={{ width:'40%',height:80 }} resizeMode={'contain'} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png'}}/>
                <Text style={{ bottom:10,fontFamily:'viga',color:colors.white }}>NO MORE CLEANING! YOU DESERVE THIS</Text>
              </View>
            )
          }}
          name="Subscription" component={Subscription}
        />
        <Stack.Screen name='Summary' component={Summary} />
        <Stack.Screen options={{ cardStyleInterpolator:forSlide, headerShown:true,headerTitle:'Selected Spaces' }} name="ListOfSpaces" component={ListOfSpaces}/>
        <Stack.Screen
        options={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }} name="Space" component={EachSpace}/>
        <Stack.Screen
        options={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }} name="Task" component={Task}/>
        <Stack.Screen name="HomeSubscription" component={HomeSubscription}/>
        <Stack.Screen  name='AfterPayment' component={AfterPayment} />
        <Stack.Screen options={{ headerShown:false }}  name='ThankYouPage' component={PaymentOnboarding} />
      </Stack.Navigator>
    )
  }

  const AgentsHirePages = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="HireAgent" component={HireAgent}/>
        <Stack.Screen options={{ headerShown: false}} name="AgentProfile" component={AgentProfile}/>
        <Stack.Screen options={{ headerShown: false}} name="HireAgentPage" component={HireAgentPage}/>
      </Stack.Navigator>
    )
  }

  // const allHomeComp = (props) => {
  //   return (
  //   <>
  //   <Tab.Navigator screenOptions={{ tabBarIndicatorStyle:{ backgroundColor:colors.black },tabBarShowIcon:true }} >
  //     <Tab.Screen options={{ tabBarLabel: 'Order A Cleaner' }} name="OrderHireCleaner" component={OrderHireCleaner}/>
  //     <Tab.Screen options={{ tabBarLabel: 'Hire An Agent' }} name="AgentsHirePages" component={AgentsHirePages}/>
  //   </Tab.Navigator>
  //   </>
  //   )
  // }
  const forSlide = ({ current, next, inverted,index, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        : 0
    );
  
    return {
      cardStyle: {
        transform: [
          {
            scaleY: Animated.multiply(
              progress.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [
                  0, // Focused, but offscreen in the beginning
                  1, // Fully focused
                  1, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
    };
  };

  const checkWalkthrough = async() => {
  const userData = await AsyncStorage.getItem('userData')
    if (userData) {
      const transformedData = JSON.parse(userData)
      const { walkthrough } = transformedData
      setCleanerWalkthrough(walkthrough)
    }
  }
  checkWalkthrough()
  const UserDashboard = (props) => {
    return(
      <Stack.Navigator>
        {cleanerWalkthrough !== 'done' || !cleanerWalkthrough ? 
        <Stack.Screen options={{ headerShown: false}} name="Walkthrough" component={Walkthrough} />
        : <></>
        }
        <Stack.Screen options={{ headerShown: false}} name="UserDashboard" component={Dashboard} />
        <Stack.Screen options={{ headerShown: false}} name="CleanerMapPreview" component={CleanerMapPreview} />
        {/* <Stack.Screen options={{ headerShown: false}} name="TimerPage" component={TimerPage} /> */}
        <Stack.Screen options={{ headerShown: false}} name="CompanyAccountPage" component={CompanyAccountPage} />
      </Stack.Navigator> 
    )
  }
  const UserChats = () => {
    return(
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} ChannelId={initialChannelId} name="ListOfChats" component={ListOfChats} />
        <Stack.Screen options={{ headerShown: false}} name="ChatPage" component={ChatPage} />
      </Stack.Navigator> 
    )
  }
  const OrdersPages = () => {
    return(
      <Stack.Navigator initialRouteName='Subscriptions'>
        <Stack.Screen initialParams={{mixpanel:mixpanel}} name="Subscriptions" component={Subscriptions} />
        <Stack.Screen options={{ headerTitle:'Cancelled Order' }} name="CancelSuccess" component={CancelSuccess} />
        <Stack.Screen options={{ cardStyleInterpolator:forSlide, headerShown:false }} name="OrderOverview" component={OrderOverview} />
      </Stack.Navigator> 
    )
  }
  const ProfilePages = () => {
    return(
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="Settings" component={Settings} />
        <Stack.Screen options={{ headerTitle:'Update Your address' }} name="Updateaddress" component={Address} />
      </Stack.Navigator> 
    )
  }
const TabButton = (props) => {
  const {item, onPress, accessibilityState,focusIcon,icon} = props
  const focused = accessibilityState.selected
  const viewRef = useRef(null)

  useEffect(() => {
    if (focused) {
      viewRef.current.bounceIn(1000)
    }
  }, [focused])
  
  return (
    <TouchableOpacity onPress={onPress} style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
      <Animatable.View duration={200} ref={viewRef} animation={'zoomIn'}>
        <Ionicons name={focused ? focusIcon : icon} size={24} color={colors.black} />
      </Animatable.View>
    </TouchableOpacity>
  )
}
const BottomTabsNav = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown:false,
      tabBarShowLabel:false,
      tabBarStyle:{
        position:'relative',
        bottom:20,
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginHorizontal:10,
        paddingBottom:0,
        paddingHorizontal:10,
        borderRadius:10,
      }
    }}
  >
    <Tab.Screen options={{ 
      tabBarIcon: ({ size,focused }) => (
        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={colors.black} /> 
      ),
      tabBarButton: (props) => <TabButton {...props} focusIcon={'home'} icon={'home-outline'} />
    }} name="Home" component={AllHomePages} />
    <Tab.Screen
    options={{
      tabBarIcon: ({ size,focused }) => (
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
       ),
      tabBarButton: (props) => <TabButton {...props} focusIcon={'chatbubble-ellipses'} icon={'chatbubble-ellipses-outline'} />
     }} name="Chats"  component={UserChats} />
     <Tab.Screen
        options={{
        tabBarButton: (props) => <TabButton {...props} focusIcon={'md-card'} icon={'md-card-outline'}/>
      }} name="OrdersPages" component={OrdersPages} />
     <Tab.Screen
     options={{
      tabBarButton: (props) => <TabButton {...props} focusIcon={'person'} icon={"person-outline"}/>
    }} name="Profile" component={ProfilePages} />
  </Tab.Navigator>
)
  let [fontsLoaded] = useFonts({
    'Itim': require('./Fonts/Itim-Regular.ttf'),
    'viga': require('./Fonts/Viga-Regular.ttf'),
    'Murecho': require('./Fonts/Murecho-SemiBold.ttf'),
    'LilitaOne': require('./Fonts/LilitaOne-Regular.ttf'),
    'Lalezar': require('./Fonts/Lalezar-Regular.ttf'),
    'UnicaOne': require('./Fonts/UnicaOne-Regular.ttf'),
    'Funzi': require('./Fonts/Funzi.ttf'),
    'Magison': require('./Fonts/Magison.ttf'),
  });
  if(!fontsLoaded || !isReady || !assets ){
    return null
  }else{
    return (
      <Provider store={AllReducers}>
        <PersistGate loading={null} persistor={persistor}>
        {
          getAuth === null
          ?
          <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{
                headerShown: false,
              }}
            >
            <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
            </Stack.Navigator>
         </NavigationContainer>
         :
         getAuth ?
         <>
         {/* <StatusBar backgroundColor={colors.white} animated={true} /> */}
         <UpdateAppModal UpdateApp={updateApp} />
         <NavigationContainer ref={nav}>
           <Drawer.Navigator
              initialRouteName='MainScreens' 
              screenOptions={{drawerLabelStyle:{color:colors.white,fontFamily:'viga'},
              drawerActiveTintColor:`${colors.purple}`,
              drawerType:'back',
              // swipeEnabled: false, 
              drawerStyle:{backgroundColor:colors.black} }} drawerContent={(props) => <CustomDrawerContent {...props} />}>
              <Drawer.Screen
                options={{
                drawerLabel:'Home',
                headerShown:false,
                drawerIcon: ({ size,focused }) => (
                  <Feather name="home" size={size} color={focused ? colors.yellow : colors.white} />
                ),
             }}
             name="MainScreens" component={BottomTabsNav} />
              <Drawer.Screen
                options={{
                drawerLabel:'Support',
                headerShown:false,
                drawerIcon: ({ size,focused }) => (
                  <MaterialIcons name="support-agent" size={size} color={focused ? colors.yellow : colors.white} />
                ),
             }}
             name="Support" component={Support} />
             {
               role !== 'worker' ?
                 <Drawer.Screen 
                  options={{
                   drawerIcon: ({ size,focused }) => (
                     <MaterialIcons name="work-outline" size={size} color={focused ? colors.yellow : colors.white} />
                   ),
                 }}
                 name="Work for blipmoore" component={BecomeCleaner} />
             :
                 null
             }
             {/* {
               role !== 'agent' ?
               <Drawer.Screen 
                options={{
                  drawerIcon: ({ size,focused }) => (
                    <AntDesign name="team" size={size} color={focused ? colors.yellow : colors.white} />
                  ),
                }}
                name="Register as an Agent" component={RegisterAgent} />
              :
              null
             } */}
           </Drawer.Navigator>
          </NavigationContainer>
          </>
        :
        <>
          <UpdateAppModal UpdateApp={updateApp} />
          <NavigationContainer>
          <Stack.Navigator 
              screenOptions={ Platform.OS === 'android' ? {
                headerShown: false,
                gestureEnabled: false,
                gestureDirection: 'horizontal',
                ...TransitionPresets.SlideFromRightIOS,
              } : {headerShown:false}}
            >
            <Stack.Screen name="firstPage" component={Firstpage} />
            <Stack.Screen name="SignUpForm" component={SignUpForm} />
            <Stack.Screen name="LoginPage" component={Login} />
            <Stack.Screen name="SignupPage" component={Signup} />
            <Stack.Screen name="ForgottenPwd" component={ForgottenPwd} />
          </Stack.Navigator>
          </NavigationContainer>
        </>
        }
        <FlashMessage position='bottom' />
        </PersistGate>
      </Provider>
    );
  }
}
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#353839',
  },
});