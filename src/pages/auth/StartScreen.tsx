import React from 'react'
import Button from './../../components/Button'
import { Alert, Dimensions, ImageBackground, StyleSheet, View, Image } from 'react-native'
import { Divider, Text } from 'react-native-elements';
import Paragraph from './../../components/Paragraph';

export const StartScreen = ({ navigation }: any) => {
  return (
  <View style={{flex: 1  }}>
    <ImageBackground
      source={require('../../assets/images/BackgrundInicio.png')}
      style={{height:'100%' }}
    >
      <View style={{flex:1,alignItems:"center", justifyContent:'center'}}>
        <Image source={require('../../assets/images/car.png')} style={{width:100, height:100, borderRadius:50 }}/>
        <Image source={require('../../assets/images/texto.png')} style={{width:300, height:100, resizeMode:"contain"}}/>
      <Paragraph>
        Reporta accidentes en tiempo real
        Ayuda a la Policía Nacional Perú a atender
        accidentes de tránsito de forma eficiente
      </Paragraph>
      <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={{marginTop:10, backgroundColor:'#131E60', width:350, alignSelf:"center"}}
          >
          INGRESAR
      </Button>
      <Button
          mode="contained"
          onPress={
            () =>
            Alert.alert(
              "¿Eres policia?",
              "Si eres policia selecciona sí",
              [
                {text: 'Sí', onPress: () => navigation.navigate('Registrar Policía')},
                {text: 'Usuario General', onPress: () => navigation.navigate('Register')},
              ],
              { 
                cancelable: true 
              }
            )
          }
          style={{marginTop:10, backgroundColor:'#C8013C', width:350, alignSelf:"center"}}
          >
          REGISTRARSE
      </Button>
      </View>

    </ImageBackground>
  </View>
  )
};