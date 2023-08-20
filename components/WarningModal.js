import { View, Text,Modal,TouchableNativeFeedback, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { colors } from '../colors/colors'

export default function WarningModal({ showModal,declineFunction,acceptFunction,positive,negative,title }) {
  return (
    <Modal
        visible={showModal}
        animationType='fade'
        onRequestClose={declineFunction}
        transparent={true}
        statusBarTranslucent={true}
    >
        <View style={{ backgroundColor:'rgba(0,0,0,0.7)',flex:1,justifyContent:'center',alignItems:'center' }}>
          <View style={{ backgroundColor:'white',padding:20,width:'80%',justifyContent:'center',alignItems:'center',borderRadius:10 }}>
            <View style={{ width:'50%',height:'40%',position:'absolute',top:-50 }}>
                <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore-cleaner/warning.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:'100%',height:'100%' }} />
            </View>
            <View style={{marginVertical:20}}>
                <Text style={{ textAlign:'center',marginVertical:5,letterSpacing:1 }}>{title}</Text>
            </View>
            <TouchableNativeFeedback onPress={acceptFunction}>
              <View style={{ backgroundColor:colors.purple,padding:10,width:'80%',alignSelf:'center',marginVertical:5,borderRadius:10 }}>
                <Text style={{ textAlign:'center',fontWeight:'bold',letterSpacing:1,color:'white' }}>{positive}</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={declineFunction}>
              <View style={{ padding:10,width:'80%',alignSelf:'center',marginVertical:5,borderRadius:20 }}>
                <Text style={{ textAlign:'center',letterSpacing:1,color:colors.black }}>{negative}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
    </Modal>
  )
}