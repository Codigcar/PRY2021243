import React, {createContext, useReducer} from 'react';
import { generaNuevoEstado, ILoginPayload } from './authReducer';

export interface IAuthState {
    isLoggedIn: boolean;
    username?: string;
    userId: string;
}

// data inicial
export const authInitialState: IAuthState = {
    isLoggedIn: false,
    username: undefined,
    userId: '',
}

//------------
export interface AuthContextProps {
    authState: IAuthState;
    signIn: (payload: ILoginPayload) => void;
}

// creando el contexto
export const AuthContext = createContext({} as AuthContextProps);


// creando el provider y los métodos pasables
export const AuthProvider = ({children}: any ) => {

    const [authReducer, dispatch] = useReducer(generaNuevoEstado, authInitialState);

    const signIn = (payload: ILoginPayload) => {
        dispatch({type: 'LOGIN', payload});
    }

    return (
        <AuthContext.Provider value={{
            authState: authReducer,
            signIn: signIn
        }}>
            {children}
        </AuthContext.Provider>

    )
}