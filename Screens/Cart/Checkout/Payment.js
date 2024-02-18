import React, { useState, useEffect } from "react";
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
import baseURL from "../../../assets/common/baseurl";
import Error from "../../../Shared/Error";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ResearchersForm = (props) => {
  const request = props.route.params ? props.route.params.request : null;
  const navigation = useNavigation();

  const [researchers, setResearchers] = useState([
    { name: "", stateSetter: null },
  ]);
  const [error, setError] = useState();

  useEffect(() => {
    setResearchers((prevResearchers) => [
      ...prevResearchers,
      { name: "", stateSetter: null },
    ]);
  }, []);

  const handleInputChange = (text, index) => {
    const updatedResearchers = [...researchers];
    updatedResearchers[index].name = text;
    setResearchers(updatedResearchers);
  };

  const addTextBox = () => {
    setResearchers((prevResearchers) => [
      ...prevResearchers,
      { name: "", stateSetter: null },
    ]);
  };

  const removeTextBox = (index) => {
    setResearchers((prevResearchers) =>
      prevResearchers.filter((_, i) => i !== index)
    );
  };

  const SendRequest = () => {
    const researchersData = {};
    researchers.forEach((researcher, index) => {
      researchersData[`researchers_name${index + 1}`] = researcher.name;
    });
    const requestResearchers = {
      ...request,
      ...researchersData,
    };

    console.log(requestResearchers);
    navigation.navigate("Confirm", { request: requestResearchers });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: "https://www.bootdey.com/image/280x280/800000/800000" }}
          style={styles.background}
        />
        <View style={styles.formContainer}>
          <Text style={styles.title}>Requesting For Certification</Text>
          <View style={styles.card}>
            {researchers.map((researcher, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={`Researcher Name ${index + 1}`}
                  placeholderTextColor="#999"
                  onChangeText={(text) => handleInputChange(text, index)}
                />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeTextBox(index)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            {error ? <Error message={error} /> : null}
            <TouchableOpacity style={styles.buttons} onPress={addTextBox}>
              <Text style={styles.buttonTexts}>Add Researcher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={SendRequest}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10, // Padding to the right of the container
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "maroon",
    color: "#333",
    paddingLeft: 10,
    marginRight: 10, // Margin to the right of the input field
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "maroon",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#fff",
  },
  buttons: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff", // White background
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1, // Border width
    borderColor: "maroon", // Maroon border color
    marginBottom: 10,
  },
  buttonTexts: {
    color: "maroon", // Maroon text color
    fontSize: 16,
  },
};

export default ResearchersForm;