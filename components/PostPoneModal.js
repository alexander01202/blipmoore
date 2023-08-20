import moment from 'moment'
import { View, Text,Modal,TouchableNativeFeedback, Image } from 'react-native'
import { colors } from '../colors/colors'
import FastImage from 'react-native-fast-image'

export default function PostPoneModal({ showPostponeModal,changePostponeModal,acceptPostone,date,positive,negative,title }) {
  return (
    <Modal
        visible={showPostponeModal}
        animationType='fade'
        onRequestClose={changePostponeModal}
        transparent={true}
        statusBarTranslucent={true}
    >
        <View style={{ backgroundColor:'rgba(0,0,0,0.7)',flex:1,justifyContent:'center',alignItems:'center' }}>
          <View style={{ backgroundColor:'white',padding:20,width:'80%',justifyContent:'center',alignItems:'center',borderRadius:10 }}>
            <View style={{ width:'50%',height:'40%',position:'absolute',top:-50 }}>
                <FastImage source={{priority: FastImage.priority.normal,uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/warning.png'}} resizeMode={FastImage.resizeMode.contain} style={{ width:'100%',height:'100%' }} />
            </View>
            <View style={{marginVertical:20}}>
                <Text style={{ textAlign:'center',marginVertical:5,letterSpacing:1 }}>{title}</Text>
                {
                  date &&
                  <Text style={{ textAlign:'center',marginVertical:5,letterSpacing:1,fontFamily:'viga' }}>Till {moment(date).add(7,'days').format('DD')} {moment(date).add(7,'days').format('MMM')} {moment(date).add(7,'days').format('YYYY')}</Text>
                }
            </View>
            <TouchableNativeFeedback onPress={acceptPostone}>
              <View style={{ backgroundColor:colors.purple,padding:10,width:'80%',alignSelf:'center',marginVertical:10,borderRadius:20 }}>
                <Text style={{ textAlign:'center',fontWeight:'bold',letterSpacing:1,color:'white' }}>{positive}</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={changePostponeModal}>
              <View style={{ borderColor:colors.purple,borderWidth:1,padding:10,width:'80%',alignSelf:'center',marginVertical:10,borderRadius:20 }}>
                <Text style={{ textAlign:'center',letterSpacing:1,color:colors.black }}>{negative}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
    </Modal>
  )
}