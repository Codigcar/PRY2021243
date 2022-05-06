import React, { useContext, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import { theme } from '../../utils/theme'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { Card, Divider } from 'react-native-elements'
import { CardImage } from '@react-native-elements/base/dist/Card/Card.Image'
import fetchWithToken from '../../utils/fetchCustom'
import jwt_decode from "jwt-decode";
import { AuthContext } from '../../context/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const { signIn, authState } = useContext(AuthContext);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    const data: any = {
      "email": email.value,
      "password": password.value,
    }
    try {
      const token = await fetchWithToken('api/users/login', data, 'POST');
      const resp = await token.json();
      const decoded:any = jwt_decode(resp.token);
      if(decoded.role === "USER"){
        signIn({
          username: decoded.name,
          userId: decoded.id,
        });
        navigation.navigate('Inicio General');
      }
      else{
        signIn({
          username: decoded.name,
          userId: decoded.id,
        });
        navigation.navigate('Inicio Policía')
      }
    } catch (error) {
      console.log({error});
    }
  }

  return (
    <Background>
      <Card wrapperStyle={{width:300, alignItems:"center"}} containerStyle={{borderRadius:30}}>
        <CardImage source={require('../../assets/images/car.png')} style={{width:100, height:100}}></CardImage>
        <CardImage source={require('../../assets/images/texto.png')} style={{width:300, height:100, resizeMode:"contain"}}></CardImage>
        <TextInput
          label="Correo Electronico"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text: any) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Contraseña"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text: any) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPasswordScreen')}
          >
            <Text style={styles.forgot}>Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        <Button
          mode="contained"
          onPress={onLoginPressed}
          style={{marginTop:-10, backgroundColor:'#131E60'}}
        >
          INGRESAR
        </Button>
      </Card>
      <Divider style={{height:20}}></Divider>
      <Text>Todavía no tienes una cuenta?</Text>
      <Button
          mode="contained"
          onPress={
            () =>
            Alert.alert(
              "¿Eres policia?",
              "Si eres policia selecciona sí",
              [
                {text: 'Sí', onPress: () => navigation.replace('Registrar Policía')},
                {text: 'Usuario General', onPress: () => navigation.replace('Register')},
              ],
              { 
                cancelable: true 
              }
            )
          }
          style={{marginTop:10, backgroundColor:'#C8013C'}}
          >
          REGISTRARSE
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})