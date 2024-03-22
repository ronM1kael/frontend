import React, { useState, useContext } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios'; 
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import * as FileSystem from 'expo-file-system';

const ExtensionProposalModal = ({ visible, closeModal, proposalId }) => {
  const [beneficiary, setBeneficiary] = useState('');
  const [mouFile, setMouFile] = useState(null); 
  const context = useContext(AuthGlobal);
  const [error, setError] = useState(null);

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
  
      if (result.canceled) {
        console.log('Document picking canceled');
        return;
      } else if (result.assets && result.assets.length > 0) {
        const pickedAsset = result.assets[0];
  
        if (pickedAsset.uri) {
          const fileInfo = await FileSystem.getInfoAsync(pickedAsset.uri);
  
          if (fileInfo) {
            const newUri = FileSystem.documentDirectory + fileInfo.name;
  
            try {
              await FileSystem.copyAsync({
                from: pickedAsset.uri,
                to: newUri,
              });
  
              setMouFile({
                name: pickedAsset.name,
                uri: newUri,
              });
  
              setError(null); // Clear any previous errors
  
              console.log('Document picked:', result);
              return; // Exit the function after successful file picking
            } catch (copyError) {
              console.error('Error copying file:', copyError);
              setError('Error copying file. Please try again.'); // Set error state
            }
          } else {
            console.log('Error getting file info for the picked document');
            setError('Error getting file info. Please try again.'); // Set error state
          }
        } else {
          console.log('Invalid URI for the picked document');
          setError('Invalid URI for the picked document. Please try again.'); // Set error state
        }
      } else {
        console.log('Document picking failed with unexpected result:', result);
        setError('Document picking failed. Please try again.'); // Set error state
      }
    } catch (err) {
      console.error('Error picking document', err);
      setError('Error picking document. Please try again.'); // Set error state
    }
  };
  
  const submitProposal = async () => {
    try {
      if (!mouFile || !mouFile.uri) { // Check if mouFile or mouFile.uri exists
        setError('Please choose a MOU file'); // Set error state if no file selected
        return;
      }
  
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      const userId = userProfile.id;
  
      const formData = new FormData();
      formData.append('proposalId', proposalId);
      formData.append('beneficiary', beneficiary);
      formData.append('mou_file', {
        uri: mouFile.uri,
        name: mouFile.name,
        type: 'application/pdf',
      });
      formData.append("user_id", userId);
  
      const response = await axios.post(`${baseURL}mobileproposal1`, formData, {
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
            placeholder="Beneficiary"
            value={beneficiary}
            onChangeText={setBeneficiary}
          />
          <Button title="Choose MOU File" onPress={handleChooseFile} />
          {mouFile && <Text>Selected File: {mouFile.name}</Text>}
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
