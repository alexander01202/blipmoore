import React, { useState, useEffect }  from 'react';
import { View,StyleSheet,Text, Button, Pressable,Modal} from 'react-native'
import { colors } from '../colors/colors';

export default function MyModal({modalVisible,changeModal}) {
  return (
    <View style={styles.centeredView}>
    <Modal
    animationType="fade"
    transparent={true}
    style={{alignSelf:'center' }}
    visible={modalVisible.show}
    statusBarTranslucent={true}
    onRequestClose={() => {
      changeModal(!modalVisible.show,'');
    }}
  >
    <View style={{...styles.centeredView, backgroundColor:'rgba(0,0,0,0.5)'}}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{modalVisible.text}</Text>
        {modalVisible.banned ? null :
        <Pressable
          style={[styles.button]}
          onPress={() => changeModal(!modalVisible.show,'')}
        >
          <Text style={styles.textStyle}>Close</Text>
        </Pressable>
        }
      </View>
    </View>
  </Modal>
  </View>
  );
}
const styles = StyleSheet.create({
    centeredView: {
      position:'absolute',
      width:'100%',
      height:'100%',
      justifyContent: "center",
      alignItems: "center",
      // marginTop: 22,
    },
    modalBody: {
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        padding:20
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
      padding: 10,
      elevation: 2,
      backgroundColor:colors.yellow,
      borderRadius:20,
      width:100
    },
    textStyle: {
      color: "white",
      textAlign: "center",
      fontFamily:'viga'
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontFamily:'viga',
      letterSpacing:1
    }
});
