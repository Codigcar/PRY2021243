import React, { useContext, useEffect, useState } from 'react'
import {  Alert, Image, ScrollView, TouchableOpacity,   ImageProps as DefaultImageProps,
  ImageURISource, } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { Card, Divider } from 'react-native-elements'
import { CardImage } from '@react-native-elements/base/dist/Card/Card.Image'
import { fieldValidator } from '../helpers/fieldValidator'
import fetchWithToken from '../utils/fetchCustom'
import { useForm } from 'react-hook-form'
import { StackScreenProps } from '@react-navigation/stack'
import { AuthContext } from '../context/AuthContext'
import { LoadingScreen } from './LoadingScreen'
import { launchCamera } from 'react-native-image-picker';
import CryptoJS from 'crypto-js'
import ImagePicker from 'react-native-image-picker';

interface Props extends StackScreenProps<any, any> {
  route: any;
}

//https://img.icons8.com/fluency/48/000000/photos.png

export const DetailsScreen = ({route: {params}, navigation}: Props) => {
  const [deceased, setDeceased] = useState({ value: '', error: '' })
  const [wounded, setWounded] = useState({ value: '', error: '' })
  const [cars, setCars] = useState({ value: '', error: '' })
  const [imageData, setImageData] = useState({value: '', error: ''});
  const [accidentDetail, setAccidentDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitData, setLoadingInitData] = useState<boolean>(false);
  const {authState} = useContext(AuthContext);
  const [image, setimage] = useState("https://img.icons8.com/fluency/48/000000/photos.png");
  //const [url, seturl] = useState();
  const {
    setValue,
  } = useForm();

  useEffect(() => {
    setLoadingInitData(true);
    fetchInitData()
      .then((resp: any) => {
        setAccidentDetail(resp);
        setValue('description', resp.description);
        setLoadingInitData(false);
      })
      .catch(err => {
        setLoadingInitData(false);
        console.error({err});
        console.log(params)
        Alert.alert('Error', 'Intentelo en unos minutos por favor');
      });
  }, []);

  const fetchInitData = async () => {
    setLoading(true);
    try {
      const resp = await fetchWithToken(`api/accidents/${params.accidentId}`);
      const data = await resp.json();
      console.log({params})
      console.log({data});
      setLoading(false);
      return data;
    } catch (error) {
      console.error({error});
      setLoading(false);
    }
  };

//Cloudinary
const [picture ,setPicture] = useState<any>({})
const [modal ,setModal] = useState(false)

const handleUpdata = (photo: any) => {
  const data = new FormData()
  data.append('file',photo)
  data.append("upload_preset","carwash")
  data.append("cloud_name","dgkoatylm")
  fetch("https://api.cloudinary.com/v1_1/dgkoatylm/image/upload",{
      method:'POST',
      body:data,
      headers:{
          'Accept':'application/json',
          'Content-Type':'multipart/form-data'
      }
  }).then(res => res.json())
  .then(data => {
      setPicture(data.url)
      setModal(false)
      console.log(data)
  }).catch(err => {
      Alert.alert("Error While Uploading")
  })
  //imageData.value = data as unknown as string
  console.log(imageData)

}


  const TakePhoto =  () => {

    const options = {
      title : 'Select Image',
      storageOptions: {
          skipBackup: true,
          path:'Image_Italy_'
      },
      mediaType: 'photo' as const,
      url: 'url' as const,
      includeBase64: true
    }

    launchCamera(options, (response) => {
      console.log('Response=',response);
      if (response.didCancel){
        console.log("User cancelled image picker");
      } else if (response.errorMessage){
        console.log("Image Picker Error",response.errorMessage);
      }
      else if (response.assets){
        const uri = response.assets[0].uri
        const type = "image/jpg"
        const name = response.assets[0].fileName
        const source = {uri,type,name}
        console.log(source)
        handleUpdata(source)

      }
      /*else if (response.assets){
        let uri = response.assets[0].uri
        if (uri == null) {
          uri = 'https://fcmabogados.com.ar/wp-content/uploads/2020/06/iconos-servicios-abogados-fcm-12.png'
        }
        imageData.value = uri
        console.log(uri)
        console.log(imageData)
        setimage(uri)
      }*/
    })
    
  }

  const sendPressed = async (data: any) => {
    data.persist()
    setLoading(true);
    console.log('[onSubmit]: ', data);
    console.log({authState});
    const deceasedError = fieldValidator(deceased.value)
    const woundedError = fieldValidator(wounded.value)
    const carsError = fieldValidator(cars.value)
    const imageError = fieldValidator(imageData.value)
    let body: any = {};
    if (deceasedError || woundedError || carsError) {
      setDeceased({ ...deceased, error: deceasedError })
      setWounded({ ...wounded, error: woundedError })
      setCars({ ...cars, error: carsError })
      setImageData({...imageData, error: imageError})
      return
    }

    body = {
      description: "Número de fallecidos: " + deceased.value + '\n' +
      "Número de heridos: " + wounded.value + '\n' +
      "Número de carros: " + cars.value + '\n' +
      "Image: " + imageData.value
    };

      console.log('[Body enviado al editar]: ', body);
      try {
        const datares = await fetchWithToken(
          `api/accidents/${accidentDetail.id}`,
          body,
          'PUT',
        );
        const resp = await datares.json();
        console.log(datares),
        console.log(data),
        setValue('description', resp);
        setLoading(true);
        navigation.navigate("AccidentsUserScreen")
      } catch (error) {
        console.log({error});
        setLoading(false);
      }
    }

    if(loadingInitData){
      <LoadingScreen />
    }

  return (
    <ScrollView style={{ backgroundColor: 'white'}}>
            {loading ? (
        <LoadingScreen />
      ) : (    <Background>
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
          <Button
            onPress={TakePhoto}
            mode="contained"
            style={{marginTop:-10, backgroundColor:'#C8013C'}}>
          </Button>

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
      </Background>)}
    </ScrollView>
  );
};