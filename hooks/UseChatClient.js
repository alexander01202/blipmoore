// // useChatClient.js
// import { useEffect, useState } from 'react';
// import { StreamChat } from 'stream-chat';
// import { chatApiKey } from '../includes/ChatConfig';
// import { AllKeys } from '../keys/AllKeys';
// import messaging from '@react-native-firebase/messaging';

// const chatClient = StreamChat.getInstance(chatApiKey);

// export const useChatClient = (id,displayName) => {
//   const [clientIsReady, setClientIsReady] = useState(false);

//   useEffect(() => {
//     const setupClient = async () => {
//       try {
//         const registerPushToken = async (id) => {
//             const token = await messaging().getToken();
//             await chatClient.addDevice(token, 'firebase', null, 'blipmoore_firebase');
      
//             unsubscribeTokenRefreshListener = messaging().onTokenRefresh(async newToken => {
//               console.log("token")
//               await chatClient.addDevice(newToken, 'firebase', null, 'blipmoore_firebase');
//               console.log("firebase")
//             });
//         };
//         const req = await fetch(`${AllKeys.ipAddress}/getUserToken?userid=${id}`)
//         const { token } = await req.json()
//         await chatClient.connectUser(
//             {
//                 id: `${id}`,
//                 name: `${displayName}`,
//                 image: `https://getstream.io/random_svg/?name=${displayName}`,
//             },
//            `${token}`,
//         );
//         await registerPushToken()
//         setClientIsReady(true);
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error(`An error occurred while connecting the user: ${error.message}`)
//         }
//       }
//     }
    
//     // If the chat client has a value in the field `userID`, a user is already connected
//     // and we can skip trying to connect the user again.
//     if (!chatClient.userID) {
//       setupClient();
//     }
//     return () => {
//         chatClient.disconnectUser()
//     }
//   }, []);

//   return {
//     clientIsReady,
//   }
// }
