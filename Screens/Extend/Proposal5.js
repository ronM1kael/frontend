import React, { useState, useContext } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios'; 
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const ExtensionProposalModal = ({ visible, closeModal, proposalId }) => {
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Submission of Proposal</Text>
          <TextInput
            style={styles.input}
            placeholder="Topics"
            value={topics}
            onChangeText={setTopics}
          />
          <TextInput
            style={styles.input}
            placeholder="SubTopics"
            value={subtopics}
            onChangeText={setSubtTopics}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button title="Submit Proposal" onPress={submitProposal} />
          <Button title="Close" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ExtensionProposalModal;
