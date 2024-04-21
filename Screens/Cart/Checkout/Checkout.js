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
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Select, Box } from "native-base";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import Checkbox from "expo-checkbox";
import axios from "axios";
import baseURL from "../../../assets/common/baseurl";
import Error from "../../../Shared/Error";
import AuthGlobal from "../../../Context/Store/AuthGlobal";

const DropdownForm = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { research_id } = route.params;

  const [showDropdown_advisors_turnitin_precheck, setShowDropdown_advisors_turnitin_precheck] = useState(false);
  const [selectedSubmission_advisors_turnitin_precheck, setSelectedSubmission_advisors_turnitin_precheck] = useState(null);
  const [selectedSubmission_thesis_type, setSelectedSubmission_thesis_type] = useState(null);
  const [selectedSubmission_requestor_type, setSelectedSubmission_requestor_type] = useState(null);
  const [error, setError] = useState();
  const context = useContext(AuthGlobal);
  const userProfile = context.stateUser.userProfile;

  const RequestOut = () => {
    const precheck = showDropdown_advisors_turnitin_precheck ? 'Yes' : 'No';
    const type = selectedSubmission_requestor_type;
    const thesistype = selectedSubmission_thesis_type;

    let request = {
      research_id,
      requestor_type: type,
      thesis_type: thesistype,
    };
    navigation.navigate("Researchers", { request: request });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
      <Image
          source={{ uri: "https://www.bootdey.com/image/500x500/808080/808080" }}
          // style={styles.background}
        />
        <View style={styles.formContainer}>
          <Text style={styles.title}>Requesting For Certification</Text>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type of Thesis</Text>
              <Box style={styles.selectBox}>
                {(userProfile.role === 'Staff' || userProfile.role === 'Faculty') ? (
                  <Select
                    minWidth="90%"
                    placeholder="Select Type of Thesis"
                    selectedValue={selectedSubmission_thesis_type}
                    onValueChange={(value) => setSelectedSubmission_thesis_type(value)}
                  >
                    <Select.Item label="Research Study" value="Research Study" />
                  </Select>
                ) : (
                  <Select
                    minWidth="90%"
                    placeholder="Select Type of Thesis"
                    selectedValue={selectedSubmission_thesis_type}
                    onValueChange={(value) => setSelectedSubmission_thesis_type(value)}
                  >
                    <Select.Item label="Thesis" value="Thesis" />
                    <Select.Item label="Capstone Project" value="Capstone Project" />
                    <Select.Item label="Project Study" value="Project Study" />
                    <Select.Item label="Special Research Project" value="Special Research Project" />
                    <Select.Item label="Feasibility Study" value="Feasibility Study" />
                  </Select>
                )}
              </Box>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Requestor Type</Text>
              <Box style={styles.selectBox}>
                {(userProfile.role === 'Staff' || userProfile.role === 'Faculty') ? (
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
                    <Select.Item label="Undergraduate Student" value="Undergraduate Student" />
                    <Select.Item label="Faculty" value="Faculty" />
                  </Select>
                )}
              </Box>
            </View>
            {error ? <Error message={error} /> : null}
            <TouchableOpacity style={styles.button} onPress={RequestOut}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

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
  selectBox: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
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
});

export default DropdownForm;