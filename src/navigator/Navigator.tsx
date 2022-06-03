import React, {useContext, useEffect, useRef, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LoadingScreen} from '../pages/LoadingScreen';
import {MapScreen} from '../pages/police/MapScreen';
import {PermissionsScreen} from '../pages/PermissionsScreen';
import {PermissionsContext} from '../context/PermissionsContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AccidentsNewsScreen} from '../pages/police/AccidentsNewsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AccidentsDetailScreen from '../pages/police/AccidentsDetailScreen';
import {AccidentsFinishedScreen} from '../pages/police/AccidentsFinishedScreen';
import {Styles} from '../assets/css/Styles';
import MapUserScreen from '../pages/user/MapUserScreen';
import {AccidentsNewsUserScreen} from '../pages/user/AccidentsNewsUserScreen';
import AccidentsDetailUserScreen from '../pages/user/AccidentsDetailUserScreen';
import {Avatar} from 'react-native-elements';
import {StartScreen} from '../pages/auth/StartScreen';
import {RegisterGeneralScreen} from '../pages/auth/RegisterGeneralScreen';
import {RegisterPoliceScreen} from '../pages/auth/RegisterPoliceScreen';
import {LoginScreen} from '../pages/auth/LoginScreen';
import {MainGeneralScreen} from '../pages/auth/MainGeneralScreen';
import {MainPoliceScreen} from '../pages/auth/MainPoliceScreen';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import { Text } from 'react-native';
import Button from '../components/Button';
import { EditProfilePoliceScreen } from '../pages/police/EditPoliceProfile';
import { EditGeneralProfileScreen } from '../pages/user/EditGeneralProfile';
import { DetailsScreen } from '../pages/DetailsScreen';
import { AuthContext } from '../context/AuthContext';
import fetchWithToken from '../utils/fetchCustom';


const StackAuth = createStackNavigator();
const Stack = createStackNavigator();
const StackV2 = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const UserTab = createMaterialBottomTabNavigator();

export const Navigator = () => {
  const {permissions } = useContext(PermissionsContext);

  if (permissions.locationStatus === 'unavailable') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Details"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {permissions.locationStatus === 'granted' ? (
        // <Stack.Screen
        //   name="PoliceBottomNavigator"
        //   component={PoliceBottomNavigator} />
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      ) : (
        // ? <Stack.Screen name="UserBottomNavigator" component={UserBottomNavigator} ></Stack.Screen>
        <Stack.Screen name="PermissionScreen" component={PermissionsScreen} />
      )}
    </Stack.Navigator>
  );
};

export const AuthNavigator = () => {
  return (
    <StackAuth.Navigator
      initialRouteName="Start"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <StackAuth.Screen name="Start" component={StartScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterGeneralScreen}></Stack.Screen>
      <Stack.Screen
        name="Registrar Policía"
        component={RegisterPoliceScreen}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      <Stack.Screen
        name="Inicio General"
        component={UserBottomNavigator}></Stack.Screen>
      <Stack.Screen
        name="Inicio Policía"
        component={PoliceBottomNavigator}></Stack.Screen>
      <Stack.Screen
        name="EditProfilePolice"
        component={EditProfilePoliceScreen}></Stack.Screen>
      <Stack.Screen
        name="EditProfileGeneral"
        component={EditGeneralProfileScreen}></Stack.Screen>
      <Stack.Screen
        name="Details"
        component={DetailsScreen}></Stack.Screen>
    </StackAuth.Navigator>
  );
};

export const PoliceBottomNavigator = () => {
  return (
    <Tab.Navigator
      // activeColor="#f0edf6"
      // inactiveColor="#3e2465"
      barStyle={{
        backgroundColor: Styles.colors.secondary,
      }}
      screenOptions={({route}: any) => ({
        // tabBarActiveTintColor: 'white',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarColor: 'red',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: () => {
          let iconName: string = '';
          switch (route.name) {
            case 'Home':
              iconName = 'navigate';
              break;
            case 'Accidents':
              iconName = 'car-outline';
              break;
            case 'Accidents2':
              iconName = 'list';
              break;
          }

          return (
            <Icon name={iconName} size={25} color={Styles.colors.primary} />
          );
        },
      })}
      sceneAnimationEnabled={true}>
      <Tab.Screen name="Home" options={{title: 'Mapa'}} component={MapScreen} />
      <Tab.Screen
        name="Accidents"
        options={{title: 'Recientes'}}
        component={PoliceStackNavigatorAccNews}
      />
      <Tab.Screen
        name="Accidents2"
        options={{title: 'Atendidos'}}
        component={PoliceStackNavigatorAccFinished}
      />
    </Tab.Navigator>
  );
};

export const PoliceStackNavigatorAccNews = ({navigation, route, params}: any) => {
  const [name, setName] = useState<any>({});
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const closeSession = () => navigation.navigate('Start');
  const EditProfilePolice = () => navigation.navigate('EditProfilePolice');
  const showMenu = () => setVisible(true);
  const {authState} = useContext(AuthContext);

  const fetchInitData = async () => {
    try{
    const resp = await fetchWithToken(`api/users/${authState.userId}`);
    const data = await resp.json();
    console.log({data});
    return data;
    } catch (error) {
      console.error({error})
    }
  }

  function InitialName() {
    const name = authState.username
    var valores = []
    const separador = " ";
    if (name == null){
      return name
    } else {
      const arraySubCadenas = name.split(separador)
      let Iname: any = {}
      for (var x = 0; x < arraySubCadenas.length; x++){
        const subArray = valores.push(arraySubCadenas[x].substring(0, 1));
        Iname = (subArray + " ")
      }
      var res = ""
      for (var i = 0; i <valores.length; i++){
        res += valores[i]
      }
      return res;
    }
  };

  useEffect(() =>{
    fetchInitData()
      .then((resp: any) =>{
          setName(resp);
          setName(resp.name)
      });
  }, [])
  
  return (
    <StackV2.Navigator
      initialRouteName="AccidentsScreen"
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerShown: true,
        title: 'Accidentes Recientes',
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 3,
          borderBottomColor: '#e6e6e6',
          backgroundColor: Styles.colors.secondary,
        },
        headerTitleStyle: {
          color: 'white',
        },
      }}>
      <StackV2.Screen
        options={{
          headerRight: () => (
            <Menu
              visible={visible}
              anchor={<Avatar
                rounded
                title= {InitialName()}
                overlayContainerStyle={{backgroundColor: Styles.colors.primary}}
                containerStyle={{marginRight: 10}}
                onPress={showMenu}
              />}
              onRequestClose={hideMenu}
            >
            <MenuItem onPress={EditProfilePolice} textStyle={{color:"black"}}>Editar perfil</MenuItem>
            <MenuItem onPress={closeSession} textStyle={{color:"black"}}>Cerrar sesión</MenuItem>
            </Menu>
          ),
        }}
        name="AccidentsScreen"
        component={AccidentsNewsScreen}
      />
      <StackV2.Screen
        name="AccidentDetailScreen"
        options={{
          headerShown: true,
          title: 'Detalle del Accidente',
          headerTitleAlign: 'center',
          headerTintColor: 'white',
          headerStyle: {
            elevation: 0,
            borderBottomWidth: 3,
            borderBottomColor: '#e6e6e6',
            backgroundColor: Styles.colors.secondary,
          },
        }}
        component={AccidentsDetailScreen}
      />
    </StackV2.Navigator>
  );
};

export const PoliceStackNavigatorAccFinished = ({ navigation, route }: any) => {
  const [visible, setVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const [name, setName] = useState<any>({});
  const {authState} = useContext(AuthContext);

  const hideMenu = () => setVisible(false);
  const closeSession = () => {
  
    logout();
    navigation.navigate('Start');
  }
  const EditProfilePolice = () => navigation.navigate('EditProfilePolice');
  const showMenu = () => setVisible(true);

  const fetchInitData = async () => {
    try{
    const resp = await fetchWithToken(`api/users/${authState.userId}`);
    const data = await resp.json();
    console.log({data});
    return data;
    } catch (error) {
      console.error({error})
    }
  }

  function InitialName() {
    const name = authState.username
    var valores = []
    const separador = " ";
    if (name == null){
      return name
    } else {
      const arraySubCadenas = name.split(separador)
      let Iname: any = {}
      for (var x = 0; x < arraySubCadenas.length; x++){
        const subArray = valores.push(arraySubCadenas[x].substring(0, 1));
        Iname = (subArray + " ")
      }
      var res = ""
      for (var i = 0; i <valores.length; i++){
        res += valores[i]
      }
      return res;
    }
  };

  useEffect(() =>{
    fetchInitData()
      .then((resp: any) =>{
          setName(resp);
          setName(resp.name)
      });
  }, [])
  
  return (
    <StackV2.Navigator
      initialRouteName="AccidentsFinishedScreen"
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerShown: true,
        title: 'Accidentes Atendidos',
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 3,
          borderBottomColor: '#e6e6e6',
          backgroundColor: Styles.colors.secondary,
        },
        headerTitleStyle: {
          color: 'white',
        },
      }}>
      <StackV2.Screen
        name="AccidentsFinishedScreen"
        component={AccidentsFinishedScreen}
        options={{
          headerRight: () => (
            <Menu
              visible={visible}
              anchor={<Avatar
                rounded
                title= {InitialName()}
                overlayContainerStyle={{backgroundColor: Styles.colors.primary}}
                containerStyle={{marginRight: 10}}
                onPress={showMenu}
              />}
              onRequestClose={hideMenu}
            >
            <MenuItem onPress={EditProfilePolice} textStyle={{color:"black"}}>Editar perfil</MenuItem>
            <MenuItem onPress={closeSession} textStyle={{color:"black"}}>Cerrar sesión</MenuItem>
            </Menu>
          ),
        }}
      />
      <StackV2.Screen
        name="AccidentDetailScreen"
        options={{
          headerShown: true,
          title: 'Detalle del Accidente',
          headerTitleAlign: 'center',
          headerTintColor: 'white',
          headerStyle: {
            elevation: 0,
            borderBottomWidth: 3,
            borderBottomColor: '#e6e6e6',
            backgroundColor: Styles.colors.secondary,
          },
        }}
        component={AccidentsDetailScreen}
      />
    </StackV2.Navigator>
  );
};

export const UserBottomNavigator = () => {
  return (
    <UserTab.Navigator
      barStyle={{
        backgroundColor: Styles.colors.secondary,
      }}
      screenOptions={({route}: any) => ({
        tabBarActiveTintColor: 'white',
        tabBarStyle: {
          borderTopColor: 'red',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: () => {
          //icons
          let iconName: string = '';
          switch (route.name) {
            case 'Home':
              iconName = 'navigate';
              break;
            case 'Accidents':
              iconName = 'list';
              break;
            case 'Accidents2':
              iconName = 'list';
              break;
          }

          return (
            <Icon name={iconName} size={20} color={Styles.colors.primary} />
          );
        },
      })}
      sceneAnimationEnabled={true}>
      <UserTab.Screen
        name="Home"
        options={{title: 'Mapa'}}
        component={MapUserScreen}
      />
      <UserTab.Screen
        name="Accidents"
        options={{title: 'Accidentes'}}
        component={UserStackNavigatorAccNews}
      />
    </UserTab.Navigator>
  );
};

export const UserStackNavigatorAccNews = ({navigation, route}:any) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<any>({});
  const hideMenu = () => setVisible(false);
  const closeSession = () => navigation.navigate('Start');
  const EditProfileGeneral = () => navigation.navigate('EditProfileGeneral');
  const showMenu = () => setVisible(true);
  const {authState} = useContext(AuthContext);

  const fetchInitData = async () => {
    try{
    const resp = await fetchWithToken(`api/users/${authState.userId}`);
    const data = await resp.json();
    console.log({data});
    return data;
    } catch (error) {
      console.error({error})
    }
  }

  function InitialName() {
    const name = authState.username
    var valores = []
    const separador = " ";
    if (name == null){
      return name
    } else {
      const arraySubCadenas = name.split(separador)
      let Iname: any = {}
      for (var x = 0; x < arraySubCadenas.length; x++){
        const subArray = valores.push(arraySubCadenas[x].substring(0, 1));
        Iname = (subArray + " ")
      }
      var res = ""
      for (var i = 0; i <valores.length; i++){
        res += valores[i]
      }
      return res;
    }
  };

  useEffect(() =>{
    fetchInitData()
      .then((resp: any) =>{
          setName(resp);
          setName(resp.name)
      });
  }, [])
  
  return (
    <StackV2.Navigator
      initialRouteName="AccidentsUserScreen"
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerShown: true,
        title: 'Accidentes',
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 3,
          borderBottomColor: '#e6e6e6',
          backgroundColor: Styles.colors.secondary,
        },
        headerTitleStyle: {
          color: 'white',
        },
      }}>
      <StackV2.Screen
        name="AccidentsUserScreen"
        options={{
          headerRight: () => (
            <Menu
              visible={visible}
              anchor={<Avatar
                rounded
                title= {InitialName()}
                overlayContainerStyle={{backgroundColor: Styles.colors.primary}}
                containerStyle={{marginRight: 10}}
                onPress={showMenu}
              />}
              onRequestClose={hideMenu}
            >
            <MenuItem onPress={EditProfileGeneral} textStyle={{color:"black"}}>Editar perfil</MenuItem>
            <MenuItem onPress={closeSession} textStyle={{color:"black"}}>Cerrar sesión</MenuItem>
            </Menu>
          ),
        }}
        component={AccidentsNewsUserScreen}
      />
      <StackV2.Screen
        name="AccidentDetailUserScreen"
        options={{
          title: 'Detalle del Accidente',
          headerTintColor: 'white',
          headerRight: () => (
            <Menu
              visible={visible}
              anchor={<Avatar
                rounded
                title= {InitialName()}
                overlayContainerStyle={{backgroundColor: Styles.colors.primary}}
                containerStyle={{marginRight: 10}}
                onPress={showMenu}
              />}
              onRequestClose={hideMenu}
            >
            <MenuItem onPress={EditProfileGeneral} textStyle={{color:"black"}}>Editar perfil</MenuItem>
            <MenuItem onPress={closeSession} textStyle={{color:"black"}}>Cerrar sesión</MenuItem>
            </Menu>
          ),
        }}
        component={AccidentsDetailUserScreen}
      />
    </StackV2.Navigator>
  );
};
