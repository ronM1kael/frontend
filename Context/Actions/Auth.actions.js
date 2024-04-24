import jwt_decode from "jwt-decode"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import baseURL from "../../assets/common/baseurl"

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = async (email, password, navigation, dispatch) => {
  try {
    const response = await fetch(`${baseURL}login-mobile`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status === 200) {
      const token = data.token;

      // Save the token in AsyncStorage
      await AsyncStorage.setItem('jwt', token);
      // console.log(token);
      // Decode the token
      const decoded = jwt_decode(token);

      // Assuming user role is available in data.user.role
      const user = {
        email: data.user.email,
        password: data.user.password,
        fname: data.user.fname,
        mname: data.user.mname,
        lname: data.user.lname,
        id: data.user.id,
        role: data.user.role,
      };

      dispatch(setCurrentUser(decoded, user));

      Toast.show({
        topOffset: 60,
        type: 'success',
        text1: 'Logged In Successfully',
        text2: 'Welcome!',
      });

      // Check user role and navigate accordingly
      if (user.role === 'Student') {
        navigation.navigate('User Profile');
      } else if (user.role === 'Faculty') {
        navigation.navigate('Faculty Profile');
      } else {
        navigation.navigate('Not Verified');
      }
    } else {
      // Handle login failure
      throw new Error(data.errors);
    }
  } catch (error) {
    // Handle other errors (e.g., network issues)
    console.error('Login failed:', error);

    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: 'An error occurred while logging in. Please try again.',
    });
  }
};

export const getUserProfile = (id) => {
  fetch(`${baseURL}users/${id}`, {
    method: "GET",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

export const logoutUser = (dispatch, navigation) => {
  try {
    AsyncStorage.removeItem("jwt");
    dispatch(setCurrentUser({}));
    Toast.show({
      topOffset: 60,
      type: 'success',
      text1: 'Logged Out Successfully',
      text2: 'Goodbye!',
    });
    // Navigate to the Login screen
    navigation.navigate('Login');
  } catch (error) {
    console.error('Logout failed:', error);
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'An error occurred while logging out. Please try again.',
    });
  }
}

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user
  }
}