import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Map} from '../../components/Map';

import {io} from 'socket.io-client';
import fetchWithToken from '../../utils/fetchCustom';
import * as DEV from '../../utils/fetchCustom';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingScreen } from '../LoadingScreen';


export const MapScreen = () => {
  const socketRef = useRef<any>();
  const [markers, setMarkers] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  // console.log('MapScreen');
  
//

  const isMounted = useRef(true);

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      fetchListAccidents().then((resp: any) => setMarkers(resp));

      socketRef.current = io(DEV.ENV.APP_API_SOCKET);
      socketRef.current.on('accidents', (data: any) => {
        setMarkers((oldArray: any) => [...oldArray, data]);
        console.log({data});
      });
  
      socketRef.current.on('accidents-taken', (data: any) => {
        console.error('accidents-taken: ', data);
        setMarkers((array: any) =>
          array.filter((item: any) => item.id !== data.id),
        );
      });
      return () => {
        console.log('Des-montado [MapScreenPolice]');
        isMounted.current = false;
      };
    }, []),
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  //
  // useEffect(() => {
  //   fetchListAccidents().then((resp: any) => setMarkers(resp));

  //   socketRef.current = io(DEV.ENV.APP_API_SOCKET);
  //   socketRef.current.on('accidents', (data: any) => {
  //     setMarkers((oldArray: any) => [...oldArray, data]);
  //     console.log({data});
  //   });

  //   socketRef.current.on('accidents-taken', (data: any) => {
  //     console.error('accidents-taken: ', data);
  //     setMarkers((array: any) =>
  //       array.filter((item: any) => item.id !== data.id),
  //     );
  //   });
  // }, []);

  // useEffect(() => {
  //   if (markers) {
  //     console.log({markers: markers});
  //   }
  // }, [markers]);

  const fetchListAccidents = async () => {
    setLoading(true);
    try {
      const resp = await fetchWithToken('api/accidents');
      const data = await resp.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error({error});
    }
  };

  if(loading) {
    return <LoadingScreen />
  }

  return (
    <View style={{flex: 1}}>
      <Map markers={markers} />
      <Text>holaa</Text>
    </View>
  );
};

const styleSheet = StyleSheet.create({
  icon: {
    position: 'relative',
  },
});
