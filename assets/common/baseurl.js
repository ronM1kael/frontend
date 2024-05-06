import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.1.172:8000/api/'
: baseURL = 'http://192.168.1.172:8000/api/'
}

export const baseURL2 = 'http://192.168.1.172:8000'

export default baseURL;

// import { Platform } from 'react-native'


// let baseURL = '';

// {Platform.OS == 'android'
// ? baseURL = 'http://reachtupt.online/api/'
// : baseURL = 'http://reachtupt.online/api/'
// }

// export const baseURL2 = 'http://reachtupt.online'

// export default baseURL;
