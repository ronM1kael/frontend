import { Platform } from 'react-native'


let baseURL2 = '';

{Platform.OS == 'android'
? baseURL2 = 'http://192.168.1.172:8000'
: baseURL2 = 'http://192.168.1.172:8000'
}

export default baseURL2;

// import { Platform } from 'react-native'


// let baseURL2 = '';

// {Platform.OS == 'android'
// ? baseURL2 = 'http://reachtupt.online'
// : baseURL2 = 'http://reachtupt.online'
// }

// export default baseURL2;