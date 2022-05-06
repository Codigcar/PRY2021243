import { IAuthState } from "./AuthContext";

export interface ILoginPayload {
    username: string;
    userId: string;
}

type TAuthAction = {type:'LOGIN', payload:ILoginPayload} | {type:'LOGOUT'};

// es una funcion
export const generaNuevoEstado = (state: IAuthState, action:TAuthAction ): IAuthState => {
   
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                username:action.payload.username,
                userId: action.payload.userId
            }
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                username: undefined,
                userId: ''
            }
        default:
            return state;
    }

}