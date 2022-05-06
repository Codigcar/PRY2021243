import React, {useContext, useEffect, useRef} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {Button} from 'react-native-elements';
import {io} from 'socket.io-client';
import {Styles} from '../../assets/css/Styles';
import { AuthContext } from '../../context/AuthContext';
import * as DEV from '../../utils/fetchCustom';

export interface IAccident {
  longitude: string;
  dateCreated: string;
  latitude: string;
  owner: string;
  phone: string;
  plate: string;
  user: string;
  address: string;
}

const ModalTakeAccident = ({modalVisible, setModalVisible, accident, navigation}: any) => {
  const socketRef = useRef<any>();
  const { authState } = useContext(AuthContext);
  socketRef.current = io(DEV.ENV.APP_API_SOCKET);

  const acceptedAccident = (id: string) => {
    socketRef.current.emit('accidents-taken', {id: accident.id, userPolice: authState.userId});
    navigation.navigate('AccidentDetailScreen', {accidentId: accident.id});
    setModalVisible(false);
  };

  const closeModel = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{fontWeight: 'bold', marginBottom: 9, fontSize: 17}}>
            ¿Quieres atender este accidente?
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              backgroundColor: 'transparent',
              alignItems: 'center',
            }}>
            <View style={{minWidth:'20%'}}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={{width: 120, height: 120, padding: 20}}
                resizeMode="contain"
              />
            </View>
            <View style={{flex:1}} >
              <Text style={styles.modalText}>{accident.owner}</Text>
              <Text style={styles.modalText}>{accident.address}</Text>
              <Text style={styles.modalText}>{accident.plate}</Text>
            </View>
          </View>
          <Button
            title="Aceptar"
            onPress={() => acceptedAccident(accident.id)}
            containerStyle={{
              borderRadius: 10,
              width: '100%',
              marginBottom: 10,
            }}
            buttonStyle={{backgroundColor: Styles.colors.primary}}
            titleStyle={{paddingVertical: 5}}
          />
          <Button
            title="Cancelar"
            onPress={() => closeModel()}
            containerStyle={{
              borderRadius: 10,
              width: '100%',
            }}
            buttonStyle={{backgroundColor: 'white'}}
            titleStyle={{paddingVertical: 5, color: Styles.colors.primary}}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '100%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Styles.colors.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default ModalTakeAccident;
