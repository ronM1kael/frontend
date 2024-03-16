import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, SafeAreaView } from 'react-native'; // Import SafeAreaView
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"
import baseURL from "../../assets/common/baseurl";
import baseURL2 from '../../assets/common/baseurlnew';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import COLORS from '../../Constants/color';

import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const [student, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    fname: '',
    lname: '',
    mname: '',
    tup_id: '',
    college: '',
    course: '',
    gender: '',
    phone: '',
    address: '',
    birthdate: new Date(),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  // Function to check authentication
  const checkAuthentication = async () => {
    // Fetch JWT token from AsyncStorage
    const jwtToken = await AsyncStorage.getItem('jwt');

    if (!jwtToken || !context.stateUser.isAuthenticated) {
      navigation.navigate('Login');
    } else {
      try {
        const userProfile = context.stateUser.userProfile;

        if (!userProfile || !userProfile.id) {
          console.error("User profile or user ID is undefined");
          return;
        }

        // Fetch user profile data from the server
        const response = await axios.get(
          `${baseURL}profile/${userProfile.id}`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Use focus effect to check authentication on component focus
  useFocusEffect(
    useCallback(() => {
      checkAuthentication();

      return () => {
        setProfileData(null);
      };
    }, [navigation])
  );

  // Function to handle logout
  const handleLogout = async () => {
    logoutUser(context.dispatch, navigation)
  };

  // Function to handle avatar change
  const handleChangeAvatar = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        uploadAvatar(result.uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  // Function to upload avatar
  const uploadAvatar = async (uri) => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
  
      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.email) {
        console.error("User authentication or profile information is missing");
        return;
      }
  
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
  
      const response = await axios.post(
        `${baseURL}mobilechangeavatar/${userProfile.email}`, // Pass email instead of id
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log(response.data.message);
  
      checkAuthentication();
  
      setProfileData(prevProfile => ({
        ...prevProfile,
        avatar: response.data.avatar
      }));
  
    } catch (error) {
      console.error('Error changing avatar:', error);
    }
  };
  

  // Function to handle input change
  const handleInputChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Function to handle profile edit
  const handleEditProfile = () => {
    setIsModalVisible(true);
    setFormData({
      student_id: student.student_id,
      fname: student.fname,
      lname: student.lname,
      mname: student.mname,
      tup_id: student.tup_id,
      college: student.college,
      course: student.course,
      gender: student.gender,
      phone: student.phone,
      address: student.address,
      birthdate: student.birthdate ? new Date(student.birthdate) : new Date(),
    });
  };

  // Function to format date for database
  const formatDateForDatabase = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  // Function to handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.birthdate;
    setFormData(prevData => ({
      ...prevData,
      birthdate: currentDate
    }));
    setIsDateTimePickerVisible(false);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error("User authentication or profile information is missing");
        return;
      }

      const email = userProfile.email;

      // Create a new object to hold the updated profile data
      const updatedProfileData = {
        fname: formData.fname,
        lname: formData.lname,
        mname: formData.mname,
        college: formData.college,
        course: formData.course,
        tup_id: formData.tup_id,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        birthdate: formatDateForDatabase(formData.birthdate || new Date()),
      };

      // Send a PUT request to update the profile data
      const response = await axios.put(
        `${baseURL}studentedit/profile/${email}`,
        updatedProfileData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update the local profile data after a successful update
      setProfileData(response.data.student);
      setIsModalVisible(false);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Student Profile",
        text2: "Profile Updated Successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatBirthdate = (birthdate) => {
    if (!birthdate) return ''; // Handle case where birthdate is not available

    const date = new Date(birthdate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Adjust locale as needed
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={[styles.avatarContainer, { backgroundColor: 'maroon' }]}>
          <View style={{ marginVertical: 10 }}>
            <Image
              source={{
                uri: student && student.avatar ? `${baseURL2}/storage/${student.avatar}` : 'https://www.bootdey.com/img/Content/avatar/avatar1.png'
              }}
              onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleChangeAvatar}>
            <Text style={styles.clearButtonText}>Change Avatar</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 10 }}>
            <Text style={[styles.name, styles.textWithShadow]}>{student ? `${student.fname} ${student.mname} ${student.lname}` : ''}</Text>
            <TouchableOpacity style={styles.logoutButton}>
              <Icon name="sign-out" type="material" size={24} color="maroon" />
              <Text style={styles.logoutButtonText} onPress={handleLogout}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.content}>
          {/* Profile Info */}
          {student && (
            <View style={styles.profileInfo}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>First Name:</Text>
                <Text style={styles.infoValue}>{student.fname}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Last Name:</Text>
                <Text style={styles.infoValue}>{student.lname}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Middle Name:</Text>
                <Text style={styles.infoValue}>{student.mname}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>TUP ID:</Text>
                <Text style={styles.infoValue}>{student.tup_id}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>EMAIL:</Text>
                <Text style={styles.infoValue}>{student.email}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>COLLEGE:</Text>
                <Text style={styles.infoValue}>{student.college}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>COURSE:</Text>
                <Text style={styles.infoValue}>{student.course}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>GENDER:</Text>
                <Text style={styles.infoValue}>{student.gender}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>PHONE:</Text>
                <Text style={styles.infoValue}>{student.phone}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>ADDRESS:</Text>
                <Text style={styles.infoValue}>{student.address}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Birthdate:</Text>
                <Text style={styles.infoValue}>{formatBirthdate(student.birthdate)}</Text>
              </View>
              {/* Add other profile info here */}
            </View>
          )}
          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Icon name="edit" type="material" size={24} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* Modal for editing profile */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                {/* Profile Edit Form */}
                {/* Input fields */}
                <TextInput
                  style={styles.inputField}
                  value={formData.fname}
                  onChangeText={(text) => handleInputChange('fname', text)}
                  placeholder="First Name"
                />
                <TextInput
                  style={styles.inputField}
                  value={formData.lname}
                  onChangeText={(text) => handleInputChange('lname', text)}
                  placeholder="Last Name"
                />
                <TextInput
                  style={styles.inputField}
                  value={formData.mname}
                  onChangeText={(text) => handleInputChange('mname', text)}
                  placeholder="Middle Name"
                />
                <TextInput
                  style={styles.inputField}
                  value={formData.tup_id}
                  onChangeText={(text) => handleInputChange('tup_id', text)}
                  placeholder="TUP ID"
                />
                <TextInput
                  style={styles.inputField}
                  value={formData.college}
                  onChangeText={(text) => handleInputChange('college', text)}
                  placeholder="College"
                />
                <TextInput
                  style={styles.inputField}
                  value={formData.course}
                  onChangeText={(text) => handleInputChange('course', text)}
                  placeholder="Course"
                />
                <View style={styles.inputField}>
                  <Picker
                    selectedValue={formData.gender}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      handleInputChange('gender', itemValue)
                    }
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                  </Picker>
                </View>
                <TextInput
                  style={styles.inputField}
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  placeholder="Phone"
                  keyboardType="numeric" // Set keyboardType to 'numeric'
                />
                {/* Editable Address */}
                <TextInput
                  style={[styles.inputField, styles.addressInput]} // Adjust the styles as needed
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  placeholder="Enter Address"
                  multiline={true}
                  numberOfLines={4}
                />
                <View style={styles.inputContainer}>
                  {/* Birthdate Text Input */}
                  <TextInput
                    style={[styles.inputField, styles.birthdateInput]}
                    value={formatBirthdate(formData.birthdate)}
                    editable={false} // Prevent manual editing
                    placeholder="Select Birthdate"
                  />

                  {/* Date Picker */}
                  <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={styles.datePicker}>
                    <Icon name="calendar" size={20} color="black" />
                  </TouchableOpacity>

                  {/* DateTimePicker */}
                  {isDateTimePickerVisible && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={formData.birthdate || new Date()}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      style={styles.dateTimePicker}
                    />
                  )}
                </View>
                {/* Add other input fields */}
                {/* Save Changes button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePicker: {
    padding: 10,
  },
  birthdateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    textAlign: 'right',
  },
  dateTimePicker: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white'
  },
  content: {
    marginTop: 20,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'maroon',
    marginTop: 20,
    width: 100,
  },
  logoutButtonText: {
    marginLeft: 10,
    color: 'maroon',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Aligns label and value
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black', // Example label color
  },
  infoValue: {
    flex: 1,
    textAlign: 'right', // Aligns value to the right
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'maroon',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'maroon',
    marginTop: 20,
    width: 300,
    justifyContent: 'center',
  },
  editButtonText: {
    marginLeft: 10,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'maroon',
    textAlign: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'maroon',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;