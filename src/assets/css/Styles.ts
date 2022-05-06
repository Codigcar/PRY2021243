import { Platform } from "react-native";

const color_primary = '#C5023D';
const color_secundary = '#131E60';

export const Styles = {
    colors: {
        primary: color_primary,
        secondary: color_secundary,
    },
    
    estiloBarraBusqueda: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 0,
        ...Platform.select({
          ios: {},
          android: {
            marginLeft: 15,
            marginRight: 15,
            shadowOpacity: 0.39,
            shadowRadius: 13.97,
            elevation: 11,
          },
          default: {
            shadowColor: 'rgba(0,0,0, .2)',
            shadowOffset: {height: 0, width: 0},
            shadowOpacity: 1,
            shadowRadius: 1,
          },
        }),
      },
}