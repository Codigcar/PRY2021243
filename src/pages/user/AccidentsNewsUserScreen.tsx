import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import {Avatar, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {io} from 'socket.io-client';
import {Styles} from '../../assets/css/Styles';
import fetchWithToken from '../../utils/fetchCustom';
import {LoadingScreen} from '../LoadingScreen';
import {AuthContext} from '../../context/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import SearchAccidents from '../../components/SearchAccidents';
import * as DEV from '../../utils/fetchCustom';


interface Props extends StackScreenProps<any, any> {}

export const AccidentsNewsUserScreen = ({navigation}: Props) => {
  const socketRef = useRef<any>();
  const [accidents, setListAccidents] = useState<any>([]);
  const isActive = useRef<any>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [search, setSearch] = useState<any>('');
  const [filteredDataSource, setFilteredDataSource] = useState<any>('');
  const {authState} = useContext(AuthContext);
  const [phase, setPhase] = useState();

  const fetchListAccidents = async () => {
    setloading(true);
    try {
      const resp = await fetchWithToken(
        `api/accidents/user/${authState.userId}`,
      );
      const data = await resp.json();
      setloading(false);
      console.log({data});
      return data;
    } catch (error) {
      console.error({error});
      setloading(false);
    }
  };

  useEffect(() => {
    fetchListAccidents().then((resp: any) => setListAccidents(resp));
    socketRef.current = io(DEV.ENV.APP_API_SOCKET);
    socketRef.current.on('accidents', (data: any) => {
      setListAccidents((oldArray: any) => [data, ...oldArray]);
      setFilteredDataSource((oldArray: any) => [data, ...oldArray]);
    });

    socketRef.current.on('accidents-taken', (data: any) => {
      setListAccidents((array: any) =>
        array.filter((item: any) => item.id !== data.id),
      );
      setFilteredDataSource((array: any) =>
        array.filter((item: any) => item.id !== data.id),
      );
    });
    isActive.current = true;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const rendeItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('AccidentDetailUserScreen', {
            accidentId: item.id,
          })
        }>
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
            <Text>R: {item.owner}</Text>
            <Text>Ubicación: {item.address}</Text>
            <Text>Placa: {item.plate}</Text>
            <Text>DNI: {item.user.dni}</Text>
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
    );
  };

  const searchFilterFunction = (phaseValue: any, text: any) => {
    if (phaseValue || phaseValue == 0) {
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
            <Text style={styles.headerTitle}>Historial</Text>
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
