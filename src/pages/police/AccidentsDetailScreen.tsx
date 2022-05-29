import React, {useContext, useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {Styles} from '../../assets/css/Styles';
import {Button} from 'react-native-elements';
import CModal from '../../components/CModal';
import fetchWithToken from '../../utils/fetchCustom';
import {validateAll} from 'indicative/validator';
import {LoadingScreen} from '../LoadingScreen';
import {Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, useController} from 'react-hook-form';
import {AuthContext} from '../../context/AuthContext';

interface Props extends StackScreenProps<any, any> {
  route: any;
}

const AccidentsDetailScreen = ({route: {params}, navigation}: Props) => {
  const [accidentDetail, setAccidentDetail] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitData, setLoadingInitData] = useState<boolean>(false);
  const {authState} = useContext(AuthContext);
  const {
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm();

  useEffect(() => {
    setLoadingInitData(true);
    fetchInitData()
      .then((resp: any) => {
        setAccidentDetail(resp);
        setValue('description', resp.description);
        setValue('conclusion', resp.conclusion);
        setLoadingInitData(false);
      })
      .catch(err => {
        setLoadingInitData(false);
        console.error({err});
        Alert.alert('Error', 'Intentelo en unos minutos por favor');
      });
  }, []);

  const fetchInitData = async () => {
    setLoading(true);
    try {
      const resp = await fetchWithToken(`api/accidents/${params.accidentId}`);
      const data = await resp.json();
      console.log({data});
      setLoading(false);
      return data;
    } catch (error) {
      console.error({error});
      setLoading(false);
    }
  };

  const CInput = ({name, control}: any) => {
    const {field} = useController({
      control,
      defaultValue: '',
      name,
    });
    return (
      <TextInput
        multiline={true}
        numberOfLines={7}
        style={{
          borderWidth: 1,
          borderColor: Styles.colors.primary,
          borderRadius: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Escriba una descripción"
        value={field.value}
        onChangeText={field.onChange}
      />
    );
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log('[onSubmit]: ', data);
    console.log({authState});
    
    let body: any = {};
    if (data.conclusion || data.conclusion?.trim().length > 0 ) {
      
      body = {
        status: 2,
        description: data.description,
        conclusion: data.conclusion,
        userPolice: authState.userId,
      };
    } else {
      body = {
        status: 1,
        description: data.description,
        conclusion: data.conclusion,
        userPolice: authState.userId,
      };
    }
    console.log('[Body enviado al editar]: ', body);
    
    try {
      const datares = await fetchWithToken(
        `api/accidents/${accidentDetail.id}`,
        body,
        'PUT',
      );
      const resp = await datares.json();
      setValue('description', "");
      setValue('conclusion', "");
      setLoading(false);
      navigation.popToTop();
    } catch (error) {
      console.error({error});
      setLoading(false);
    }
  };

  if(loadingInitData){
    <LoadingScreen />
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView>
          <View style={[styles.card, modalVisible && styles.opacity]}>
            <View style={styles.flexRow}>
              <View style={styles.avatar}>
                <Avatar
                  rounded
                  size={55}
                  source={{
                    uri: 'https://fcmabogados.com.ar/wp-content/uploads/2020/06/iconos-servicios-abogados-fcm-12.png'
                  }}
                />
              </View>
              <View style={styles.info}>
                <Text>R: {accidentDetail.user?.name} </Text>
                <Text>Ubicación: {accidentDetail?.address}</Text>
                <Text>Placa: {accidentDetail?.plate}</Text>
                <Text>Dueño: {accidentDetail?.owner} </Text>
                <Text>Telefono: {accidentDetail?.phone}</Text>
                {accidentDetail.status == 0 && <Text>Fase: No atendido</Text>}
                {accidentDetail.status == 1 && <Text>Fase: En proceso</Text>}
                {accidentDetail.status == 2 && <Text>Fase: Finalizado</Text>}
              </View>
            </View>
            <View style={styles.body}>
              <Text style={styles.titleInput}>Descripción</Text>
              <CInput name="description" control={control} />
              {/* {SignUpErrors && (
                <Text style={styles.errorStyle}>
                  {SignUpErrors.description}
                </Text>
              )} */}
              <Text style={styles.titleInput}>Conclusión</Text>
              <CInput name="conclusion" control={control} />
              {/*  {SignUpErrors && (
                <Text style={styles.errorStyle}>{SignUpErrors.conclusion}</Text>
              )} */}
              <Button
                title="Guardar registro"
                onPress={handleSubmit(onSubmit)}
                containerStyle={{
                  borderRadius: 10,
                  width: '100%',
                  marginBottom: 10,
                  marginTop: 40,
                }}
                buttonStyle={{backgroundColor: Styles.colors.primary}}
                titleStyle={{paddingVertical: 5}}
              />
            </View>
          </View>
          <CModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '25%',
  },
  info: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  body: {
    marginHorizontal: 20,
  },
  titleInput: {
    marginVertical: 15,
    fontWeight: 'bold',
    fontSize: 15,
  },
  opacity: {
    opacity: 0.4,
  },
  errorStyle: {
    color: '#ff0000',
    textAlign: 'right',
    paddingRight: 2,
  },
});

export default AccidentsDetailScreen;
