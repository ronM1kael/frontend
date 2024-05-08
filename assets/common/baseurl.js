// import { Platform } from 'react-native'


// let baseURL = '';

// {Platform.OS == 'android'
// ? baseURL = 'http://172.20.10.2:8000/api/'
// : baseURL = 'http://172.20.10.2:8000/api/'
// }

// export const baseURL2 = 'http://172.20.10.2:8000'

// export default baseURL;

import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'https://reachtupt.online/api/'
: baseURL = 'https://reachtupt.online/api/'
}

export const baseURL2 = 'https://reachtupt.online'

export default baseURL;
