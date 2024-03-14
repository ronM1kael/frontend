import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Button, FlatList, Modal, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../../Context/Store/AuthGlobal';
import baseURL from '../../../assets/common/baseurl';
import Toast from "react-native-toast-message";
import { Picker } from '@react-native-picker/picker';

import Icon from "react-native-vector-icons/FontAwesome";

import baseURL2 from '../../../assets/common/baseurlnew';

import { WebView } from 'react-native-webview';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [technicalAdviserStatus, setTechnicalAdviserStatus] = useState('Choose....');
  const [technicalAdviserRemarks, setTechnicalAdviserRemarks] = useState('');
  const [showTechnicalAdviserRemarks, setShowTechnicalAdviserRemarks] = useState(false);
  const [subjectAdviserStatus, setSubjectAdviserStatus] = useState('Choose....');
  const [subjectAdviserRemarks, setSubjectAdviserRemarks] = useState('');
  const [showSubjectAdviserRemarks, setShowSubjectAdviserRemarks] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const context = useContext(AuthGlobal);

  const [showPDF, setShowPDF] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');

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
      console.log(response.data.application)
      setApplications(response.data.application);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchStudentApplications();
  }, [context.stateUser.isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStudentApplications();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
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
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Processed successfully.",
        text2: "Technical Adviser Approval",
      });
      console.log('Technical adviser approval response:', response.data);
      setIsModalVisible(false); // Close the modal
      onRefresh(); // Refresh data using onRefresh function
    } catch (error) {
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Processed successfully.",
        text2: "Technical Adviser Approval",
      });
      setIsModalVisible(false); // Close the modal even if there's an error
      onRefresh(); // Refresh data using onRefresh function even if there's an error
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
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Processed successfully.",
        text2: "subject Adviser Approval",
      });
      console.log('Subject adviser approval response:', response.data);
      setIsModalVisible(false); // Close the modal
      onRefresh(); // Refresh data using onRefresh function
    } catch (error) {
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Processed successfully.",
        text2: "subject Adviser Approval",
      });
      setIsModalVisible(false); // Close the modal even if there's an error
      onRefresh(); // Refresh data using onRefresh function even if there's an error
    }
  };
  

  const Viewpdf = async () => {
    try {
      const uri = `${baseURL2}/uploads/pdf/${selectedApplication.research_file}`;
      setPdfFileName(uri);
      setShowPDF(true);
      console.log(uri);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleClosePDF = () => {
    setShowPDF(false);
    setPdfFileName('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.userList}
        columnWrapperStyle={styles.listContainer}
        data={applications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedApplication(item);
              setIsModalVisible(true);
            }}
          >
            <Image style={styles.image} source={{ uri: item.image }} />
            <View style={{ alignItems: 'center' }}>
              <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={styles.additionalContent}>
                    <Text style={styles.description}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={Viewpdf}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={styles.download}>Download </Text>
                      <Icon name="download" size={20} color="maroon" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => {
                    setSelectedApplication(item);
                    setIsModalVisible(true);
                  }}
                >
                  <Text style={styles.followButtonText}>{item.research_title}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#800000"]} // Maroon color for the refresh indicator
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={applications.length > 0} // Disable scroll when no data
      />

      <Modal visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedApplication?.status === 'Pending Technical Adviser Approval'
                ? 'Technical Adviser Approval'
                : selectedApplication?.status === 'Pending Subject Adviser Approval'
                  ? 'Subject Adviser Approval'
                  : `Research Title: ${selectedApplication?.research_title}`}
            </Text>

            {selectedApplication?.status === 'Pending Technical Adviser Approval' && (
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={technicalAdviserStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setTechnicalAdviserStatus(itemValue);
                    setShowTechnicalAdviserRemarks(itemValue === 'Rejected By Technical Adviser');
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Status: Choose...." value="Choose...." />
                  <Picker.Item label="Status: Approve" value="Pending Subject Adviser Approval" />
                  <Picker.Item label="Status: Reject" value="Rejected By Technical Adviser" />
                </Picker>
                {showTechnicalAdviserRemarks && (
                  <TextInput
                    placeholder="Enter remarks"
                    value={technicalAdviserRemarks}
                    onChangeText={text => setTechnicalAdviserRemarks(text)}
                    style={styles.textInput}
                  />
                )}
                <Button title="Send" onPress={handleTechnicalAdviserApproval} color="#800000" />
              </View>
            )}

            {selectedApplication?.status === 'Pending Subject Adviser Approval' && (
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={subjectAdviserStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setSubjectAdviserStatus(itemValue);
                    setShowSubjectAdviserRemarks(itemValue === 'Rejected By Subject Adviser');
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Status: Choose...." value="Choose...." />
                  <Picker.Item label="Status: Approve" value="Pending" />
                  <Picker.Item label="Status: Reject" value="Rejected By Subject Adviser" />
                </Picker>
                {showSubjectAdviserRemarks && (
                  <TextInput
                    placeholder="Enter remarks"
                    value={subjectAdviserRemarks}
                    onChangeText={text => setSubjectAdviserRemarks(text)}
                    style={styles.textInput}
                  />
                )}
                <Button title="Send" onPress={handleSubjectAdviserApproval} color="#800000" />
              </View>
            )}

          </ScrollView>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.btnClose}>
              <Text style={styles.btnCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPDF}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePDF}
      >
        <View style={styles.centeredViews}>
          <View style={[styles.modalViews, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity onPress={handleClosePDF} style={styles.closeButtons}>
              <Icon name="close" size={20} />
            </TouchableOpacity>
            <WebView source={{ uri: pdfFileName }} />
            <View style={{ alignItems: 'center' }}>
              <Icon name="check-circle" size={100} color="green" />
              <Text style={[styles.successTexts, { marginLeft: 10 }]}>The file has been successfully downloaded.</Text>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  userList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 10
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF', // White card background
    flexDirection: 'row',
    borderColor: 'maroon', // Add border color maroon
    borderWidth: 2, // Add border width
    borderRadius: 10, // Add border radius
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: '#000000', // Black color
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    alignSelf: 'center',
    color: '#696969', // Dark gray color
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#800000', // Maroon color
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 40,
    borderRadius: 10,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  picker: {
    marginBottom: 10,
    color: '#000000', // Black color
  },
  textInput: {
    height: 40,
    borderColor: '#CCCCCC', // Light gray border
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC', // Light gray border
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnClose: {
    backgroundColor: '#FFFFFF', // White background
    borderWidth: 1,
    borderColor: '#800000', // Maroon border
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  btnCloseText: {
    color: '#800000', // Maroon color
    fontWeight: 'bold',
  },
  centeredViews: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalViews: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  successTexts: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
});

export default StudentApplications;