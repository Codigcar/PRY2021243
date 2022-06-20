import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useRef, useState} from 'react';

import {Button} from 'react-native-elements';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Styles} from '../assets/css/Styles';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from '../pages/LoadingScreen';
import {Image, Text, View, Animated, StyleSheet, Modal, Dimensions, useWindowDimensions} from 'react-native';
import ModalConnectNFC from '../pages/user/ModalConnectNFC';
import { MapScreen } from '../pages/police/MapScreen';
import { Map } from './Map';

interface Props {
  markers?: Marker[];
  user?: any;
}



const center = { lat: -12.18994612, lng: -76.99423495 }

export const MapUser = ({markers, user = 'admin'}: Props) => {
  const {hasLocation, initialPosition, getCurrentLocation} = useLocation();
  const mapViewRef = useRef<MapView>();
  const [modalVisible, setModalVisible] = React.useState(false);

  if (!hasLocation) {
    return <LoadingScreen />;
  }

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
        style={[styles.mapViewContainer, modalVisible && styles.opacity, styles.map]}
        showsUserLocation
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.1844,
          longitudeDelta: 0.0842,
        }}>
        {markers &&
          markers.length > 0 &&
          markers.map(
            (marker: any, key: any) =>
              // (marker.status==0 || marker.status==1) && 
              (
                <Marker
                  image={require("../assets/images/flag.png")}
                  style={styles.markerImage}
                  icon={{
                    scale: Dimensions.get('window').scale
                  }}
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

const styles = StyleSheet.create({
  mapViewContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  promptBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  prompt: {
    height: 1300,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 20,
    margin: 20,
    zIndex: 2,
  },
  opacity: {
    opacity: 0.3,
  },
  markerImage: {
    height: '100%', width: '100%'
  }
});
