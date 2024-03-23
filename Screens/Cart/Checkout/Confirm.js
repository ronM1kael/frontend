import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { Select, Box } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from "../../../assets/common/baseurl";
import Error from "../../../Shared/Error";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioButton } from 'react-native-paper';
import Checkbox from 'expo-checkbox';
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import * as actions from '../../../Context/Actions/cartActions';
import { useDispatch } from 'react-redux';

const ConfirmationForm = (props) => {
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const request = props.route.params ? props.route.params.request : null;

  const [selectedAdviser, setSelectedAdviser] = useState("");
  const [selectedSadviser, setSelectedSadviser] = useState("");
  const [advisers, setAdvisers] = useState([]);
  const [sadvisers, setSadvisers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState();
  const [college, setCollege] = useState("");

  const userProfilerole = context.stateUser.userProfile;

  useEffect(() => {
    fetchAdvisers();
  }, []);

  const fetchAdvisers = async () => {
    try {
      const response = await axios.get(`${baseURL}mobilecertification`);
      setAdvisers(response.data.advisers);
      setSadvisers(response.data.sadvisers);
    } catch (error) {
      console.error("Error fetching advisers:", error);
    }
  };

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
      const confirm = { isChecked: check };
      const formData = new FormData();
  
      const requestData = { ...confirm, ...props.route.params.request };
  
      Object.keys(requestData).forEach((key) => {
        formData.append(key, requestData[key]);
      });
  
      formData.append("user_id", userId);
      formData.append("college", college);
      formData.append("technicalAdviser_id", selectedAdviser);
      formData.append("subjectAdviser_id", selectedSadviser);
  
      let url = '';
      if (userProfile.role === 'Student') {
        url = `${baseURL}mobileapply_certification/${userProfile.id}`;
      } else {
        url = `${baseURL}mobilefacultyapply_certificationfinal/${userProfile.id}`;
      }
  
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      console.log("Request Sent Successfully", response.data);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Request Sent Successfully.",
        text2: "The Response is in process",
      });
      setTimeout(() => {
        dispatch(actions.clearCart());
        navigation.navigate("Home");
      }, 500);
  
    } catch (error) {
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
  

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://www.bootdey.com/image/280x280/800000/800000' }}
          // style={styles.background}
        />
        <View style={styles.formContainer}>
          <Text style={styles.title}>Requesting For Certification</Text>
          <View style={styles.card}>
            {userProfilerole.role === "Faculty" || userProfilerole.role === "Staff" ? (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>College</Text>
                <Box style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter College"
                    value={college}
                    onChangeText={(text) => setCollege(text)}
                  />
                </Box>
              </View>
            ) : (
              <React.Fragment>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Technical Adviser</Text>
                  <Box style={styles.inputBox}>
                    <Select
                      minWidth="90%"
                      placeholder="Select Technical Adviser"
                      selectedValue={selectedAdviser}
                      onValueChange={(value) => setSelectedAdviser(value)}
                    >
                      {advisers.map((adviser, index) => (
                        <Select.Item
                          key={index}
                          label={`${adviser.lname}, ${adviser.fname} ${adviser.mname} (${adviser.department_name})`}
                          value={adviser.id.toString()}
                        />
                      ))}
                    </Select>
                  </Box>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Subject Adviser</Text>
                  <Box style={styles.inputBox}>
                    <Select
                      minWidth="90%"
                      placeholder="Select Subject Adviser"
                      selectedValue={selectedSadviser}
                      onValueChange={(value) => setSelectedSadviser(value)}
                    >
                      {advisers.map((adviser, index) => (
                        <Select.Item
                          key={index}
                          label={`${adviser.lname}, ${adviser.fname} ${adviser.mname} (${adviser.department_name})`}
                          value={adviser.id.toString()}
                        />
                      ))}
                    </Select>
                  </Box>
                </View>
              </React.Fragment>
            )}

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? '#800000' : undefined} // Maroon color when checked
              />
              <Text style={styles.checkboxText}>I agree to the terms and conditions</Text>
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.button} onPress={() => SendRequest()}>
              <Text style={styles.buttonText}>Send Request</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    width: '80%',
    backgroundColor: 'lightgray',
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
  inputBox: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    minWidth: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    paddingLeft: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  checkboxText: {
    marginLeft: 8,
  },
});

export default ConfirmationForm;
