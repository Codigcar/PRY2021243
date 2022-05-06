import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Avatar, Divider, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import fetchWithToken from '../../utils/fetchCustom';
import {io} from 'socket.io-client';
import {Styles} from '../../assets/css/Styles';
import Toast from 'react-native-toast-message';
import ModalTakeAccident from './ModalTakeAccident';
import {LoadingScreen} from '../LoadingScreen';
import CSearchBar from '../../components/CSearchBar';

import {Picker} from '@react-native-picker/picker';
import SearchAccidents from '../../components/SearchAccidents';

import * as DEV from '../../utils/fetchCustom';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';


interface Props extends StackScreenProps<any, any> {}

export const AccidentsNewsScreen = ({navigation}: Props) => {
  const socketRef = useRef<any>();
  const [accidents, setListAccidents] = useState<any>([]);
  const isActive = useRef<any>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [accidentSelected, setaccidentSelected] = useState('');

  const [search, setSearch] = useState<any>('');
  const [filteredDataSource, setFilteredDataSource] = useState<any>('');

  const [phase, setPhase] = useState();

  const isMounted = useRef(true);


  // useEffect(() => {
  //   fetchListAccidents().then((resp: any) => {
  //     setListAccidents(resp);
  //   });
  //   socketRef.current = io(DEV.ENV.APP_API_SOCKET);
  //   socketRef.current.on('accidents', (data: any) => {
  //     console.log({data});
  //     showToast();
  //     setListAccidents((oldArray: any) => [data, ...oldArray]);
  //   });

  //   socketRef.current.on('accidents-taken', (data: any) => {
  //     setListAccidents((array: any) =>
  //       array.filter((item: any) => item.id !== data.id),
  //     );
  //   });
  //   isActive.current = true;
  // }, []);
//----------------------
  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      fetchListAccidents().then((resp: any) => {
          if (isMounted.current) {
            setListAccidents(resp);
          }
        })
        .catch(err => {
          console.error({err});
          Alert.alert('Error', 'Intentelo en unos minutos por favor');
        });
      socketRef.current = io( DEV.ENV.APP_API_SOCKET );
      socketRef.current.on('accidents', (data: any) => {
        console.log({data});
        showToast();
        setListAccidents((oldArray: any) => [data, ...oldArray]);
      });

      socketRef.current.on('accidents-taken', (data: any) => {
        setListAccidents((array: any) =>
          array.filter((item: any) => item.id !== data.id),
        );
      });
      isActive.current = true;
      return () => {
        console.log('Des-montado');
        isMounted.current = false;
      };
    }, []),
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchListAccidents = async () => {
    setLoading(true);
    try {
      const resp = await fetchWithToken(`api/accidents/no-active`);
      const data = await resp.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error({error});
    }
  };


  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: '¡Nuevo Accidente!',
      text2: 'En Av. Las Palmeras 321 👋',
    });
  };

  const openModal = (item: any) => {
    setaccidentSelected(item);
    setModalVisible(true);
  };

  const rendeItem = ({item}: any) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            openModal(item);
          }}>
          <View style={styles.flexRow}>
            <View style={styles.avatar}>
              <Avatar
                rounded
                size={55}
                source={{
                  uri: 'https://cdn2.salud180.com/sites/default/files/styles/medium/public/field/image/2020/11/mujer-22-anos-se-opera-para-no-tener-hijos.jpg',
                }}
              />
            </View>
            <View style={styles.info}>
              <Text>R: {item.owner}</Text>
              <Text>Ubicación: {item.address}</Text>
              <Text>Placa: {item.plate}</Text>
              <Text>DNI: {item.user?.dni}</Text>
              <Text>Telefono: {item.phone}</Text>
              {item.status == 0 && <Text>Fase: No atendido</Text>}
              {item.status == 1 && <Text>Fase: En proceso</Text>}
              {item.status == 2 && <Text>Fase: Finalizado</Text>}
            </View>
            <View style={styles.arrow}>
              <Icon
                name="chevron-forward-outline"
                size={30}
                color={Styles.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
        <ModalTakeAccident
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          accident={accidentSelected}
          navigation={navigation}
        />
      </View>
    );
  };

  const searchFilterFunction = (phaseValue: any, text: any) => {
    if (phaseValue) {
      const newData = accidents.filter((a: any) => a.status == phaseValue);
      setFilteredDataSource(newData);
      setPhase(text);
    } else {
      setFilteredDataSource(accidents);
      setPhase(text);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Recientes</Text>
            <Picker
              selectedValue={phase}
              onValueChange={(value, index) => searchFilterFunction(Number(value), value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item label="Fase"/>
              <Picker.Item label="No atendido" value="0" />
              <Picker.Item label="En proceso" value="1" />
              <Picker.Item label="Finalizado" value="2" />
            </Picker>
          </View>
          <Divider style={styles.dividerTitleLineRed} />
          <SearchAccidents
            accidents={accidents}
            search={search}
            setSearch={setSearch}
            filteredDataSource={filteredDataSource}
            setFilteredDataSource={setFilteredDataSource}
            rendeItem={rendeItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
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
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerContainer: {
    backgroundColor: '#FFF',
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    height: 70,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
    borderColor: Styles.colors.primary,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
  },
  dividerTitleLineRed: {
    borderColor: Styles.colors.primary,
    backgroundColor: '#d41c1c',
    borderWidth: 2,
    marginLeft: 20,
    width: 50,
  },
  picker: {
    marginVertical: 30,
    width: 170,
    padding: 10,
    borderWidth: 3,
    borderColor: "#000000",
  },
});