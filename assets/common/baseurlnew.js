import { Platform } from 'react-native'


let baseURL2 = '';

{Platform.OS == 'android'
? baseURL2 = 'http://192.168.68.116:8000'
: baseURL2 = 'http://192.168.68.116:8000'
}

export default baseURL2;