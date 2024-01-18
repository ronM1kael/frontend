import React, { useState, useEffect, useContext } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput
} from "react-native"
// import { Item, Picker, Select, Box } from "native-base"
// import FormContainer from "../../Shared/Form/FormContainer"
// import Input from "../../Shared/Form/Input"
// import EasyButton from "../../Shared/StyledComponents/EasyButton"

import Icon from "react-native-vector-icons/FontAwesome"
import Toast from "react-native-toast-message"
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from "../../../assets/common/baseurl"
import Error from "../../../Shared/Error"
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import mime from "mime";

import { RadioButton } from 'react-native-paper'; // Import RadioButton from a UI library
import { Select, Box } from 'native-base';

import Checkbox from 'expo-checkbox';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AuthGlobal from "../../../Context/Store/AuthGlobal"

import * as actions from '../../../Context/Actions/cartActions'


const ConfirmationForm = (props) => {

    const context = useContext(AuthGlobal);

    const navigation = useNavigation();

    const request = props.route.params ? props.route.params.request : null ;
    // console.log(request);

    // const SendRequest = () => {

    //   const check = isChecked === true ? 'Yes' : 'No';
      
    //   const confirm = {
    //     purpose,
    //     research_specialist,
    //     research_staff,
    //     adviser_name,
    //     adviser_email,
    //     college,
    //     course,
    //     isChecked : check
    //   }

    //   let requestConfirm = {
    //       ...request,
    //       ...confirm
    //   }
    //   console.log("Final", requestConfirm);
    //   // navigation.navigate("Home", { request: requestConfirm })

    // }

    const SendRequest = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwt');
        const userProfile = context.stateUser.userProfile;
        const check = isChecked === true ? 'Yes' : 'No';

        if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
          setError("User authentication or profile information is missing");
          return;
        }

        const userId = userProfile.id;
    
        const confirm = {
          purpose,
          research_specialist,
          research_staff,
          adviser_name,
          adviser_email,
          college,
          course,
          isChecked: check,
        };

        // const formData = new FormData();
        const formData = new FormData();

        // Append fields from request and confirm objects
        Object.keys(request).forEach((key) => {
          formData.append(key, request[key]);
        });

        Object.keys(confirm).forEach((key) => {
          formData.append(key, confirm[key]);
        });

        // Append additional fields such as userId
        formData.append("user_id", userId);
    
        // Make an HTTP POST request to your backend endpoint
        // const response = await axios.post(`${baseURL}apply-certification`, requestConfirm);

        const response = await axios.post(`${baseURL}apply-certification`, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        
        // Handle the response here if needed
        // console.log('Response from backend:', response.data);
        console.log("Request Sent Successfuly", response.data);
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Request Sent Successfuly.",
          text2: "The Response is in process",
        });
        setTimeout(() => {
          dispatch(actions.clearCart())
          navigation.navigate("Home");
        }, 500);
    
        // Assuming you have navigation defined somewhere (e.g., useNavigation)
        // navigation.navigate("Home", { request: requestConfirm });
      } catch (error) {
        // Handle error states here, maybe set the error state for display
        console.error('Error sending request:', error);
        setError('Error sending request');
        Toast.show({
          position: 'bottom',
          bottomOffset: 20,
          type: "error",
          text1: "Error uploading file.",
          text2: "Please try again.",
        });
      }
    };
    

    const [purpose, setPurpose] = useState("");
    const [research_specialist, setResearch_specialist] = useState("");
    const [research_staff, setResearch_staff] = useState("");
    const [adviser_name, setAdviser_name] = useState("");
    const [adviser_email, setAdviser_email] = useState("");
    const [college, setCollege] = useState("");
    const [course, setCourse] = useState("");

    const [isChecked, setIsChecked] = useState(false);
    
    const [error, setError] = useState();

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <View style={styles.container}>

                <Image
                    source={{uri: 'https://www.bootdey.com/image/280x280/800000/800000'}}
                    style={styles.background}
                />

                <View style={styles.formContainer}>

                <Text style={styles.title}>Requesting For Certification</Text>

                <View style={styles.card}>

                <View style={styles.inputContainer}>
            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Purpose"
              placeholderTextColor="#999"
              onChangeText={(text) => setPurpose(text)}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>(Research Specialist) Who initially processed your paper</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Research Specialist"
              placeholderTextColor="#999"
              onChangeText={(text) => setResearch_specialist(text)}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Research Staff Incharge</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Research Staff Incharge"
              placeholderTextColor="#999"
              onChangeText={(text) => setResearch_staff(text)}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Name of Adviser</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Name of Adviser"
              placeholderTextColor="#999"
              onChangeText={(text) => setAdviser_name(text)}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Adviser Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Adviser Email"
              placeholderTextColor="#999"
              onChangeText={(text) => setAdviser_email(text)}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>College</Text>
            <TextInput
              style={styles.input}
              placeholder="Input College"
              placeholderTextColor="#999"
              onChangeText={(text) => setCollege(text)}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Course</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Course"
              placeholderTextColor="#999"
              onChangeText={(text) => setCourse(text)}
            />
            </View>

            <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#800000' : undefined} // Maroon color when checked
                    />

                    <Text>I agree to the terms and conditions</Text>
            </View>     

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.button}
                              onPress={() => SendRequest()}>
                
                <Text style={styles.buttonText}>Send Request</Text>
                
            </TouchableOpacity>
                
                </View>

                </View>

            </View>
        </KeyboardAwareScrollView>
    )
}


const styles = {
    container: {
      flex: 1,
    },
    background: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 120,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius:60,
      resizeMode: 'contain',
    },
  
      formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
        marginTop: 20,
      },
      card: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 20,
        marginBottom: 20,
      },
      inputContainer: {
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        color: '#333',
      },
      input: {
        height: 40,
        borderRadius:6,
        borderWidth: 1,
        borderColor: 'maroon',
        color: '#333',
        paddingLeft:10,
      },
      button: {
        width: '100%',
        height: 40,
        backgroundColor: 'maroon',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
    };


export default ConfirmationForm;