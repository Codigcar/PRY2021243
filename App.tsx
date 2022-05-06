import 'react-native-gesture-handler';
import React, {useEffect, useRef} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/navigator/Navigator';
import {PermissionsProvider} from './src/context/PermissionsContext';
import {LogBox} from 'react-native';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/utils/toastConfig';
import NFCScreen from './src/pages/police/NFCScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthContext';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'Warning: ...',
  'Error: ...',
]);

const AppState = ({children}: any) => {
  return (
    <PermissionsProvider>
      <AuthProvider>{children}</AuthProvider>
    </PermissionsProvider>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

export default App;
