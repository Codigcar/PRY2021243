import React, { useContext, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../utils/theme'
import { Card, Divider } from 'react-native-elements'
import { CardImage } from '@react-native-elements/base/dist/Card/Card.Image'
import { fieldValidator } from '../helpers/fieldValidator'

export const DetailsScreen = ({ navigation }: any) => {
  const [deceased, setDeceased] = useState({ value: '', error: '' })
  const [wounded, setWounded] = useState({ value: '', error: '' })
  const [cars, setCars] = useState({ value: '', error: '' })

  const sendPressed = async () => {
    const deceasedError = fieldValidator(deceased.value)
    const woundedError = fieldValidator(wounded.value)
    const carsError = fieldValidator(cars.value)
    if (deceasedError || woundedError || carsError) {
      setDeceased({ ...deceased, error: deceasedError })
      setWounded({ ...wounded, error: woundedError })
      setCars({ ...cars, error: carsError })
      return
    }
    const data: any = {
      "deceased": deceased.value,
      "wounded": wounded.value,
      "cars": cars.value
    }
    try {
      console.log(data)
    } catch (error) {
      console.log({error});
    }
  }

  return (
    <Background>
      <Card wrapperStyle={{width:300, alignItems:"center"}} containerStyle={{borderRadius:30}}>
        <CardImage source={require('../assets/images/car.png')} style={{width:100, height:100, alignContent:"center"}}></CardImage>
        <CardImage source={require('../assets/images/texto.png')} style={{width:300, height:100, resizeMode:"contain"}}></CardImage>
        <Text style={{alignSelf:"center", textAlign:"center"}}>Si no estás seguro de alguna de estas preguntas completar con un -</Text>
        <Divider style={{height:20}}></Divider>
        <Text style={{alignSelf:"flex-start", fontWeight:"bold"}}>¿Cuántos posibles muertos hay en el accidente?</Text>
        <TextInput
          label="N° de muertos"
          returnKeyType="next"
          value={deceased.value}
          onChangeText={(text: any) => setDeceased({ value: text, error: '' })}
          error={!!deceased.error}
          errorText={deceased.error}
        />
        <Text style={{alignSelf:"flex-start", fontWeight:"bold"}}>¿Cuántos posibles heridos hay en el accidente?</Text>
        <TextInput
          label="N° de heridos"
          returnKeyType="next"
          value={wounded.value}
          onChangeText={(text: any) => setWounded({ value: text, error: '' })}
          error={!!wounded.error}
          errorText={wounded.error}
        />
        <Text style={{alignSelf:"flex-start", fontWeight:"bold"}}>¿Cuántos carros están involucrados en el accidente?</Text>
        <TextInput
          label="N° de carros"
          returnKeyType="done"
          value={cars.value}
          onChangeText={(text: any) => setCars({ value: text, error: '' })}
          error={!!cars.error}
          errorText={cars.error}
        />
        <Divider style={{height:20}}></Divider>
        <Button
          mode="contained"
          onPress={sendPressed}
          style={{marginTop:-10, backgroundColor:'#C8013C'}}
        >
          ENVIAR
        </Button>
      </Card>
      <Divider style={{height:20}}></Divider>
    </Background>
  )
}