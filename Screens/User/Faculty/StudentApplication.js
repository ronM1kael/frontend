import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../../Context/Store/AuthGlobal';
import baseURL from '../../../assets/common/baseurl';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [technicalAdviserStatus, setTechnicalAdviserStatus] = useState('Choose....');
  const [technicalAdviserRemarks, setTechnicalAdviserRemarks] = useState('');
  const [showTechnicalAdviserRemarks, setShowTechnicalAdviserRemarks] = useState(false);
  const [subjectAdviserStatus, setSubjectAdviserStatus] = useState('Choose....');
  const [subjectAdviserRemarks, setSubjectAdviserRemarks] = useState('');
  const [showSubjectAdviserRemarks, setShowSubjectAdviserRemarks] = useState(false);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    fetchStudentApplications();
  }, [context.stateUser.isAuthenticated]);

  const fetchStudentApplications = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error('Invalid authentication state');
        return;
      }
      const response = await axios.get(`${baseURL}mobile/students/application/${userProfile.id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setApplications(response.data.application || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleTechnicalAdviserApproval = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const response = await axios.post(`${baseURL}mobile/sending/technicalAdviser/approval/${selectedApplication.id}`, {
        technicalAdviserStatus,
        technicalAdviserRemarks
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log('Technical adviser approval response:', response.data);
      // Handle success
    } catch (error) {
      console.error('Error in technical adviser approval:', error);
      // Handle error
    }
  };

  const handleSubjectAdviserApproval = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const response = await axios.post(`${baseURL}mobile/sending/subjectAdviser/approval/${selectedApplication.id}`, {
        subjectAdviserStatus,
        subjectAdviserRemarks
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log('Subject adviser approval response:', response.data);
      // Handle success
    } catch (error) {
      console.error('Error in subject adviser approval:', error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {applications.map(application => (
          <TouchableOpacity
            key={application.id}
            style={styles.applicationItem}
            onPress={() => setSelectedApplication(application)}
          >
            <Text>{application.research_title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={selectedApplication !== null}>
        <View style={styles.modalContainer}>
          <Text>Research Title: {selectedApplication?.research_title}</Text>

          {selectedApplication?.status === 'Pending Technical Adviser Approval' && (
            <View style={styles.inputContainer}>
              <Text>Technical Adviser Approval:</Text>
              <Picker
                selectedValue={technicalAdviserStatus}
                onValueChange={(itemValue, itemIndex) => {
                  setTechnicalAdviserStatus(itemValue);
                  setShowTechnicalAdviserRemarks(itemValue === 'Rejected By Technical Adviser');
                }}
              >
                <Picker.Item label="Choose...." value="Choose...." />
                <Picker.Item label="Approve" value="Pending Subject Adviser Approval" />
                <Picker.Item label="Reject" value="Rejected By Technical Adviser" />
              </Picker>
              {showTechnicalAdviserRemarks && (
                <TextInput
                  placeholder="Enter remarks"
                  value={technicalAdviserRemarks}
                  onChangeText={text => setTechnicalAdviserRemarks(text)}
                />
              )}
              <Button title="Send" onPress={handleTechnicalAdviserApproval} />
            </View>
          )}

          {selectedApplication?.status === 'Pending Subject Adviser Approval' && (
            <View style={styles.inputContainer}>
              <Text>Subject Adviser Approval:</Text>
              <Picker
                selectedValue={subjectAdviserStatus}
                onValueChange={(itemValue, itemIndex) => {
                  setSubjectAdviserStatus(itemValue);
                  setShowSubjectAdviserRemarks(itemValue === 'Rejected By Subject Adviser');
                }}
              >
                <Picker.Item label="Choose...." value="Choose...." />
                <Picker.Item label="Approve" value="Pending" />
                <Picker.Item label="Reject" value="Rejected By Subject Adviser" />
              </Picker>
              {showSubjectAdviserRemarks && (
                <TextInput
                  placeholder="Enter remarks"
                  value={subjectAdviserRemarks}
                  onChangeText={text => setSubjectAdviserRemarks(text)}
                />
              )}
              <Button title="Send" onPress={handleSubjectAdviserApproval} />
            </View>
          )}

          <TouchableOpacity onPress={() => setSelectedApplication(null)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 10,
  },
});

export default StudentApplications;