import React, { useContext } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { check, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions';
import { PermissionsContext } from '../context/PermissionsContext';


export const PermissionsScreen = () => {

  const { permissions, askLocationPermission } = useContext(PermissionsContext);

  return (
    <View style={styles.container} >
      <Text>Permisos GPS</Text>
      <Button title='Permiso' onPress={askLocationPermission} />
      <Text>
        {JSON.stringify(permissions, null, 5)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
