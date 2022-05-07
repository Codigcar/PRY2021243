import Geolocation from '@react-native-community/geolocation';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from '../pages/LoadingScreen';
import {Button} from 'react-native-elements';
import ModalConnectNFC from '../pages/user/ModalConnectNFC';
import {Styles} from '../assets/css/Styles';

interface Props {
  markers?: Marker[];
}

export const Map = ({markers}: Props) => {
  const {hasLocation, initialPosition, getCurrentLocation} = useLocation();
  const [modalVisible, setModalVisible] = React.useState(false);

  const mapViewRef = useRef<MapView>();

  const modalScanNFC = () => {
    setModalVisible(true);
  };

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el!)}
        style={{flex: 1}}
        showsUserLocation
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {markers &&
          markers.length > 0 &&
          markers.map(
            (marker: any, key: any) =>
              // (marker.status == 0 ||
              // marker.status == 1) && 
              (
                <Marker
                  image={require('../assets/images/flag.png')}
                  key={key}
                  coordinate={{
                    latitude: Number(marker.latitude),
                    longitude: Number(marker.longitude),
                  }}
                  title={`Estado: ${
                    marker.status == 0
                      ? 'No atendido'
                      : marker.status == 1
                      ? 'En proceso'
                      : marker.status == 2
                      && 'Atendido'
                      // : 'Finalizado'
                  }`}
                  // title={`Estado: ${
                  //   marker.status 
                  // }`}
                  description={`Placa: ${marker.plate}`}
                />
              ),
          )}
      </MapView>
      <Button
        title="¡Mandar Alerta!"
        onPress={() => modalScanNFC()}
        containerStyle={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          marginHorizontal: 50,
          borderRadius: 10,
        }}
        buttonStyle={{backgroundColor: Styles.colors.primary}}
        titleStyle={{paddingVertical: 5}}
      />
      <ModalConnectNFC
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        latitude={initialPosition.latitude}
        longitude={initialPosition.longitude}
      />
    </>
  );
};
