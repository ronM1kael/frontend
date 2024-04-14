import React, { useState, useContext } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import baseURL from '../../assets/common/baseurl';
import Toast from "react-native-toast-message";

const ExtensionProposalModal5 = ({ visible, closeModal, proposalId }) => {
  const [topics, setTopics] = useState('');
  const [subtopics, setSubtTopics] = useState(null); 
  const context = useContext(AuthGlobal);
  const [error, setError] = useState(null);

  const submitProposal = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      const userId = userProfile.id;
  
      const formData = new FormData();
      formData.append('proposalId', proposalId);
      formData.append('topics', topics);
      formData.append('subtopics', subtopics);
      formData.append("user_id", userId);
  
      const response = await axios.post(`${baseURL}mobileproposal5`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Topics and Subtopics Inputted;',
          text2: 'Schedule a consultation for Pre-Evaluation survey.',
        });
        console.log(response.data.message);
        closeModal();
      } else {
        setError('Proposal submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      setError('Error submitting proposal. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Extension Application</Text>
          <View style={styles.separator} />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Icon name="close" size={20} color="#333" />
          </TouchableOpacity>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Topics"
                value={topics}
                onChangeText={setTopics}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Sub Topics"
                value={subtopics}
                onChangeText={setSubtTopics}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.buttonContainer}>
              <Button title="Submit Proposal" onPress={submitProposal} color="#000" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff', // white background for the modal
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  formContainer: {
    width: '100%', // Full width
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  chooseFileButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center', // Center align items horizontally
    justifyContent: 'center', // Center align items vertically
    marginBottom: 10,
  },
  chooseFileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center align the button
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: 'maroon', // Maroon color for the separator
    marginBottom: 20, // Adjust spacing as needed
  },
  fileSelectionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  fileText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center', // Center align the text
  },
  fileButtonContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Align content in the center
  },
  memoText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center', // Center align the text
  },
});

export default ExtensionProposalModal5;