import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {Styles} from '../../assets/css/Styles';
import CModal from '../../components/CModal';
import fetchWithToken from '../../utils/fetchCustom';
import { LoadingScreen } from '../LoadingScreen';

const AccidentsDetailUserScreen = ({route: {params}}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [accidentDetail, setAccidentDetail] = useState<any>({});
  // const [userObject, setUserObject] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchInitData()
      .then((resp: any) => {
        console.log({resp});
        // setAccidentDetail(params.user);
        setAccidentDetail(resp);
        // setDescription(resp.description);
        // setConclusion(resp.conclusion);
        // setUserObject(resp.user);
      })
      .catch(err => {
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

  if(loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <ScrollView>
      <View style={[styles.card, modalVisible && styles.opacity]}>
        <View style={styles.flexRow}>
          <View style={styles.avatar}>
            <Avatar
              rounded
              size={55}
              source={{
                uri: 'https://larepublica.pe/resizer/gXrOo4NDeFnbosiPWezeTjL4wlk=/480x282/top/smart/arc-anglerfish-arc2-prod-gruporepublica.s3.amazonaws.com/public/VDMYQ2DXORG3PISSWOPVDQDBWE.jpg',
              }}
            />
          </View>
          <View style={styles.info}>
            <Text>R: {accidentDetail?.owner} </Text>
            <Text>Ubicación: {accidentDetail?.address}</Text>
            <Text>Placa: {accidentDetail?.plate}</Text>
            {accidentDetail.status == 0 && <Text>Fase: No atendido</Text>}
            {accidentDetail.status == 1 && <Text>Fase: En proceso</Text>}
            {accidentDetail.status == 2 && <Text>Fase: Finalizado</Text>}
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.titleInput}>Descripción</Text>
          <TextInput
            multiline={true}
            numberOfLines={7}
            style={{
              borderWidth: 1,
              borderColor: Styles.colors.primary,
              borderRadius: 20,
            }}
            editable={false}
            value={
              accidentDetail.description !== null
                ? accidentDetail.description
                : 'Descripción aún no registrado...'
            }
          />
          <Text style={styles.titleInput}>Conclusión</Text>
          <TextInput
            multiline={true}
            numberOfLines={7}
            style={{
              borderWidth: 1,
              borderColor: Styles.colors.primary,
              borderRadius: 20,
            }}
            editable={false}
            value={
              accidentDetail.conclusion !== null
                ? accidentDetail.conclusion
                : 'Conclusión aún no registrado...'
            }
          />
        </View>
      </View>
      <CModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
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
});

export default AccidentsDetailUserScreen;
