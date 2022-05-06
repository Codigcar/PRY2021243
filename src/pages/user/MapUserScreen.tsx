import React from 'react'
import { View } from 'react-native'
import { Map } from '../../components/Map'
import { MapUser } from '../../components/MapUser'

const MapUserScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <MapUser markers={[]} />
        </View>
    )
}

export default MapUserScreen