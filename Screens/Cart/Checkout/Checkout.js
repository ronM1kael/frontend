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
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import mime from "mime";

import { RadioButton } from 'react-native-paper'; // Import RadioButton from a UI library
import { Select, Box } from 'native-base';

import Checkbox from 'expo-checkbox';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Payment from "./Payment";

// import { useRoute } from "@react-navigation/native"

import AuthGlobal from "../../../Context/Store/AuthGlobal"


const DropdownForm = (props) => {

  const navigation = useNavigation();

  const route = useRoute();

  const { research_id } = route.params;

  console.log(research_id);

  const [showDropdown_advisors_turnitin_precheck, setShowDropdown_advisors_turnitin_precheck] = useState(false);

  const [selectedSubmission_advisors_turnitin_precheck, setSelectedSubmission_advisors_turnitin_precheck] = useState(null);

  const [selectedSubmission_thesis_type, setSelectedSubmission_thesis_type] = useState(null);

  const [selectedSubmission_requestor_type, setSelectedSubmission_requestor_type] = useState(null);

  const [initial_simmilarity_percentage, setInitial_simmilarity_percentage] = useState(null);

  const [error, setError] = useState();

  const context = useContext(AuthGlobal);

  const userProfile = context.stateUser.userProfile;

  // console.log(props.route.params)

  // const research_id = props.route.params ? props.route.params.research_id : null;
  // console.log(props.route.params);

  const RequestOut = () => {

    const precheck = showDropdown_advisors_turnitin_precheck === true ? 'Yes' : 'No';

    const type = selectedSubmission_requestor_type;

    const thesistype = selectedSubmission_thesis_type;

    const frequency = selectedSubmission_advisors_turnitin_precheck
    // const adviserprecheck = selectedSubmission_advisors_turnitin_precheck === false ? 'Yes' : 'No';

    let request = {
      research_id,
      // advisors_turnitin_precheck: precheck,
      // initial_simmilarity_percentage,
      requestor_type: type,
      thesis_type: thesistype,
      // submission_frequency: frequency,
    }
    console.log("request", request)
    navigation.navigate("Researchers", { request: request })
  }
  // console.log(requestItems)

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <View style={styles.container}>

        <Image
          source={{ uri: 'https://www.bootdey.com/image/280x280/800000/800000' }}
          style={styles.background}
        />

        <View style={styles.formContainer}>

          <Text style={styles.title}>Requesting For Certification</Text>

          <View style={styles.card}>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Type of Thesis
              </Text>
              <Box style={{ borderColor: 'maroon', borderWidth: 1, borderRadius: 5, padding: 3 }}>
                {/* Check if the user is Staff or Faculty */}
                {(userProfile.role === 'Staff' || userProfile.role === 'Faculty') ? (
                  // If the user is Staff or Faculty, render a predefined value
                  <Select
                    minWidth="90%"
                    placeholder="Select Type of Thesis"
                    selectedValue={selectedSubmission_thesis_type}
                    onValueChange={(value) => setSelectedSubmission_thesis_type(value)}
                  >
                    <Select.Item label="Research Study" value="Research Study" />
                  </Select>
                ) : (
                  // If the user is not Staff or Faculty, allow selection from options
                  <Select
                    minWidth="90%"
                    placeholder="Select Type of Thesis"
                    selectedValue={selectedSubmission_thesis_type}
                    onValueChange={(value) => setSelectedSubmission_thesis_type(value)}
                  >
                    <Select.Item label="Undergraduate Thesis" value="Undergraduate Thesis" />
                    <Select.Item label="Capstone" value="Capstone" />
                    <Select.Item label="Special Project" value="Special Project" />
                    <Select.Item label="Masters's Thesis" value="Masters's Thesis" />
                    <Select.Item label="Doctoral Dissertation" value="Doctoral Dissertation" />
                  </Select>
                )}
              </Box>
              {selectedSubmission_thesis_type && (
                // Render content based on the selected submission, e.g., additional fields or components
                <View>
                  {/* Add your additional content here */}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Requestor Type
              </Text>

              <Box style={{ borderColor: 'maroon', borderWidth: 1, borderRadius: 5, padding: 3 }} >
              {(userProfile.role === 'Staff' || userProfile.role === 'Faculty') ? (
                  // If the user is Staff or Faculty, render a predefined value
                  <Select
                  minWidth="90%"
                  placeholder="Select Requestor Type"
                  selectedValue={selectedSubmission_requestor_type}
                  onValueChange={(value) => setSelectedSubmission_requestor_type(value)}
                >
                  <Select.Item label="Faculty" value="Faculty" />
                </Select>
                ) : (
                <Select
                  minWidth="90%"
                  placeholder="Select Requestor Type"
                  selectedValue={selectedSubmission_requestor_type}
                  onValueChange={(value) => setSelectedSubmission_requestor_type(value)}
                >
                  <Select.Item label="Graduate Student" value="Graduate Student" />
                  <Select.Item label="Undergraduate Student" value="Undergraduate Student" />
                  <Select.Item label="Faculty" value="Faculty" />
                </Select>
                )}
              </Box>

              {selectedSubmission_requestor_type && (
                // Render content based on the selected submission, e.g., additional fields or components
                <View>
                  {/* Add your additional content here */}
                </View>
              )}
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.button}
              onPress={() => RequestOut()}>

              <Text style={styles.buttonText}>Next</Text>

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
    borderRadius: 60,
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'maroon',
    color: '#333',
    paddingLeft: 10,
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


export default DropdownForm;