import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'

import {io} from 'socket.io-client';
import * as DEV from '../../utils/fetchCustom';
import fetchWithToken from '../../utils/fetchCustom';
import { MapUser } from '../../components/MapUser';

const MapUserScreen = () => {
    const socketRef = useRef<any>();
    const [markers, setMarkers] = useState<any>([]);
  
    useEffect(() => {
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
    }, []);
  
    useEffect(() => {
      if (markers) {
        console.log({markers: markers});
      }
    }, [markers]);
  
    const fetchListAccidents = async () => {
      try {
        const resp = await fetchWithToken('api/accidents');
        const data = await resp.json();
        return data;
      } catch (error) {
        console.error({error});
      }
    };

    return (
        <View style={{ flex: 1 }}>
            <MapUser markers={markers} />
        </View>
    )
}

export default MapUserScreen