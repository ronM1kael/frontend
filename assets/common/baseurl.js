// import { Platform } from 'react-native'


// let baseURL = '';

// {Platform.OS == 'android'
// ? baseURL = 'http://192.168.68.117:8000/api/'
// : baseURL = 'http://192.168.68.117:8000/api/'
// }

// export const baseURL2 = 'http://192.168.68.117:8000'

// export default baseURL;

import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.68.113:8000/api/'
: baseURL = 'http://192.168.68.113:8000/api/'
}

export const baseURL2 = 'http://192.168.68.113:8000'

export default baseURL;

