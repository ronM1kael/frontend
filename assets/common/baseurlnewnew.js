import { Platform } from 'react-native'


let baseURLfinal = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.68.117:8000/api/'
: baseURL = 'http://192.168.68.117:8000/api/'
}

export default baseURLfinal;