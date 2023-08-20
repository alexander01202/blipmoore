import React from 'react'
import { colors } from '../../../colors/colors';
import { useState } from 'react';
import { View,StyleSheet,Text,Image, TouchableWithoutFeedback,Modal, Button, ScrollView } from 'react-native';

export default function TypeOfCleaningModal({ text,type,changeExplanationModal,showExplanation }) {
  return (
        <Modal
            animationType="fade"
            visible={showExplanation}
        >
            <View style={{ flex:1 }}>
                <View>
                {
                    type === 'regular' ? 
                    <Text style={{ fontSize:20,fontFamily:'viga',textAlign:'center' }}>Regular Cleaning</Text> 
                    :
                    <Text style={{ fontSize:20,fontFamily:'viga',textAlign:'center' }}>Deep Cleaning</Text> 
                }
                </View>
                <View style={{ padding:15 }}>
                    <Text style={{ letterSpacing:1.1 }}>{text}</Text>
                </View>
                <Button title='Close' onPress={() => changeExplanationModal()} />
            </View>
        </Modal>
    )
}
