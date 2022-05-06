import { useEffect, useState, useRef } from 'react';

import Geolocation from '@react-native-community/geolocation';
import { Location } from '../interfaces/appInterfaces';

export const useLocation = () => {

    const [hasLocation, setHasLocation] = useState(false);

    const [initialPosition, setInitialPosition] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    }, [])

    useEffect(() => {

        getCurrentLocation()
            .then( location => {
                setInitialPosition(location);
                setHasLocation(true);
            });

    }, []);

    const getCurrentLocation = (): Promise<Location> => {
        return new Promise( (resolve, reject) => {
            Geolocation.getCurrentPosition(
                ({ coords }) => {
                    
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    });
                },
                (err) => reject({ err }), { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        });
    }


    return {
        hasLocation,
        initialPosition,
        getCurrentLocation
    }
}
