import React, { useState, useEffect } from "react"
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


const ResearchersForm = (props) => {

  const request = props.route.params ? props.route.params.request : null;
  // console.log(request);

  const [researchers_name1, setresearchers_name1] = useState("");
  const [researchers_name2, setresearchers_name2] = useState("");
  const [researchers_name3, setresearchers_name3] = useState("");
  const [researchers_name4, setresearchers_name4] = useState("");
  const [researchers_name5, setresearchers_name5] = useState("");
  const [researchers_name6, setresearchers_name6] = useState("");
  const [researchers_name7, setresearchers_name7] = useState("");
  const [researchers_name8, setresearchers_name8] = useState("");

  const [error, setError] = useState();

  const navigation = useNavigation()



  const SendRequest = () => {

    const researchers = {
      researchers_name1,
      researchers_name2,
      researchers_name3,
      researchers_name4,
      researchers_name5,
      researchers_name6,
      researchers_name7,
      researchers_name8
    }

    let requestResearchers = {
      ...request,
      ...researchers,
    }
    console.log("To Send Confirm");
    navigation.navigate("Confirm", { request: requestResearchers })

  }

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
              <Text style={styles.label}>Researcher Name 1</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 1"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name1(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 2</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 2"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name2(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 3</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 3"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name3(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 4</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 4"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name4(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 5</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 5"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name5(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 6</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 6"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name6(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 7</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 7"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name7(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Researcher Name 8</Text>
              <TextInput
                style={styles.input}
                placeholder="Input Researcher Name 8"
                placeholderTextColor="#999"
                onChangeText={(text) => setresearchers_name8(text)}
              />
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.button}
              onPress={() => SendRequest()}>

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


export default ResearchersForm;