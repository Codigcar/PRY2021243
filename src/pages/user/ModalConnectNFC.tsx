import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Styles} from '../../assets/css/Styles';
import NfcManager, {
  Ndef,
  NfcTech,
} from 'react-native-nfc-manager';
import Toast from 'react-native-toast-message';
import Geocoder from 'react-native-geocoder';
import {io} from 'socket.io-client';
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
  soat: string;
}

const ModalConnectNFC = ({
  modalVisible,
  setModalVisible,
  latitude,
  longitude,
}: any) => {
  const socketRef = useRef<any>();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (modalVisible) {
      readNdef();
    }
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, [modalVisible]);

  async function readNdef() {
    try {
      // await NfcManager.requestTechnology([NfcTech.Ndef]);
      // const tag = await NfcManager.getTag();

      // const tagNombre: any = tag?.ndefMessage[0]?.payload;
      // const tagPlaca: any = tag?.ndefMessage[1]?.payload;
      // const tagCelular: any = tag?.ndefMessage[2]?.payload;
      // const tagSOAT : any = tag?.ndefMessage[3]?.payload;

      // let Nombre = Ndef.text.decodePayload(tagNombre);
      // let Placa = Ndef.text.decodePayload(tagPlaca);
      // let Celular = Ndef.text.decodePayload(tagCelular);
      // let SOAT = Ndef.text.decodePayload(tagSOAT);

      // let distric = '';
      // let address = '';

      // if (tag) {
      //   cancelNfcScan();
        showToast();

      //   var currentLocation = {
      //     lat: latitude,
      //     lng: longitude,
      //   };

      //   const respGeo = await Geocoder.geocodePosition(currentLocation);
      //   try {
      //     distric = await respGeo[1].locality;
      //     address = await respGeo[2].formattedAddress;
      //   } catch (error) {
      //     console.error(error);
      //   }

        const body: IAccident = {
          // latitude: latitude.toString(),
          // longitude: longitude.toString(),
          // dateCreated: new Date().toISOString(),
          // plate: Placa,
          // owner: Nombre,
          // phone: Celular,
          // user: authState.userId,
          // address: distric + ', ' + address,
          // soat: 'SOAT',

          latitude: '-12.156843815273826',
          longitude:  '-76.99931723000626',
          dateCreated: '12-12-1990',
          plate: 'ASU-381',
          owner: 'Fernanda',
          phone: '946600912',
          user: authState.userId,
          address: 'Av. Matellini' + ', ' + 'Chorrillos',
          soat: '1236548651',
        };

        socketRef.current = io(DEV.ENV.APP_API_SOCKET);
        socketRef.current.emit('accidents', body);

      // }
    } catch (ex) {
      console.warn('Oops!', JSON.stringify(ex));
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  function cancelNfcScan() {
    NfcManager.cancelTechnologyRequest();
    setModalVisible(false);
  }

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: '¡Alerta enviada!',
      text2: 'Un policia acudirá a ayudarte en unos minutos 👋',
    });
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
          <Image
            source={require('../../assets/images/parabrisas.png')}
            style={{width: 120, height: 120, padding: 20}}
            resizeMode="contain"
          />
          <Text style={styles.modalText}>Acerca tu teléfono al tag circular en la esquina inferior izquierda del parabrisas</Text>
          <Button
            title="Cancelar"
            onPress={() => cancelNfcScan()}
            containerStyle={{
              borderRadius: 10,
              width: '100%',
            }}
            buttonStyle={{backgroundColor: Styles.colors.primary}}
            titleStyle={{paddingVertical: 5}}
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
export default ModalConnectNFC;
