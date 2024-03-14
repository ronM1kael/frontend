import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
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

import * as actions from "../../Context/Actions/cartActions"

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

  const checkAuthentication = async () => {
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

  useFocusEffect(
    useCallback(() => {
      checkAuthentication();

      return () => {
        setProfileData(null);
      };
    }, [navigation])
  );

  const handleLogout = async () => {
    logoutUser(context.dispatch, navigation)
  };

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

  const uploadAvatar = async (uri) => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
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
        `${baseURL}mobilechangeavatar/${userProfile.id}`,
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error("User authentication or profile information is missing");
        return;
      }

      const student_id = student ? student.student_id : "";

      console.log(student_id);

      const response = await axios.get(
        `${baseURL}student/profile/${student_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setProfileData(response.data.student);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

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

  const formatDateForDatabase = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.birthdate;
    setFormData(prevData => ({
      ...prevData,
      birthdate: currentDate
    }));
    setIsDateTimePickerVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error("User authentication or profile information is missing");
        return;
      }

      const user_id = userProfile.id;
      const student_id = student.student_id;

      const formattedBirthdate = formatDateForDatabase(formData.birthdate || new Date());

      console.log(student_id)

      const formDataToSend = new FormData();
      formDataToSend.append("fname", formData.fname);
      formDataToSend.append("user_id", user_id);
      
      formDataToSend.append("birthdate", formattedBirthdate)

      console.log(response);

      

      const response = await axios.put(
        `${baseURL}student/profile/${student_id}`,
          formDataToSend, // Send form data directly
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProfileData(response.data.student);
      setIsModalVisible(false);

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
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
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Student ID:</Text>
          <Text style={styles.infoValue}>{student ? student.student_id : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>First Name:</Text>
          <Text style={styles.infoValue}>{student ? student.fname : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Last Name:</Text>
          <Text style={styles.infoValue}>{student ? student.lname : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Middle Name:</Text>
          <Text style={styles.infoValue}>{student ? student.mname : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>TUP ID:</Text>
          <Text style={styles.infoValue}>{student ? student.tup_id : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{student ? student.email : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>College:</Text>
          <Text style={styles.infoValue}>{student ? student.college : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Course:</Text>
          <Text style={styles.infoValue}>{student ? student.course : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{student ? student.gender : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{student ? student.phone : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{student ? student.address : ""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Birthdate:</Text>
          <Text style={styles.infoValue}>{student ? student.birthdate : ""}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButtons}>
          <Icon name="edit" type="material" size={24} color="white" />
          <Text style={styles.logoutButtonTexts}
            onPress={handleEditProfile}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            {/* Profile Edit Form */}

            <View style={{ marginBottom: 12 }}>
              <Image
                style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
              />
              <Text style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8
              }}>First Name</Text>

              <View style={{
                width: "100%",
                height: 48,
                borderColor: '#800000',
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22
              }}>
                <TextInput
                  placeholderTextColor={COLORS.black}
                  keyboardType='text'
                  style={{
                    width: "100%"
                  }}
                  value={formData.fname}
                  onChangeText={(text) => handleInputChange('fname', text)}
                  placeholder="First Name"
                >
                </TextInput>
              </View>
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.lname}
                onChangeText={(text) => handleInputChange('lname', text)}
                placeholder="Last Name"
              />
            </View>
            {/* Middle Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.mname}
                onChangeText={(text) => handleInputChange('mname', text)}
                placeholder="Middle Name"
              />
            </View>
            {/* TUP ID */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.tup_id}
                onChangeText={(text) => handleInputChange('tup_id', text)}
                placeholder="TUP ID"
              />
            </View>
            {/* College */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.college}
                onChangeText={(text) => handleInputChange('college', text)}
                placeholder="College"
              />
            </View>
            {/* Course */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.course}
                onChangeText={(text) => handleInputChange('course', text)}
                placeholder="Course"
              />
            </View>
            {/* Gender */}
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={formData.gender}
                style={styles.inputs}
                onValueChange={(itemValue, itemIndex) =>
                  handleInputChange('gender', itemValue)
                }
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {/* Phone */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="Phone"
              />
            </View>
            {/* Address */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder="Address"
              />
            </View>
            {/* Birthdate */}
            <View style={styles.inputContainer}>
              {/* Display current birthdate */}
              <Text style={styles.infoValue}>{formData.birthdate.toLocaleDateString()}</Text>
              {/* Render DateTimePicker on press */}
              <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
                <Text style={styles.infoLabel}>Select Birthdate</Text>
              </TouchableOpacity>
              {/* DateTimePicker */}
              {isDateTimePickerVisible && (
                <DateTimePicker
                testID="dateTimePicker"
                value={formData.birthdate || new Date()} // Ensure defaultValue if formData.birthdate is undefined
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
              )}
            </View>
            {/* Save Changes button */}
            <TouchableOpacity style={styles.requestButton} onPress={handleSubmit}>
              <Text style={styles.requestButtonText}>Save Changes</Text>
            </TouchableOpacity>
            {/* Close button */}
            <TouchableOpacity style={styles.requestButton} onPress={handleCloseModal}>
              <Text style={styles.requestButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flex: 1, // This is important for the ScrollView to work properly
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white', // Change the background color to maroon
    padding: 8, // Adjust the padding to make the button smaller
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'maroon', // Change the border color to maroon
    marginTop: 20,
    width: 100,
  },
  logoutButtonText: {
    marginLeft: 10,
    color: 'maroon', // Change the text color to maroon
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
  infoContainer: {
    marginTop: 20,
  },
  logoutButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'maroon', // Change the background color to maroon
    padding: 8, // Adjust the padding to make the button smaller
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'maroon', // Change the border color to maroon
    marginTop: 20,
    width: 300,
    justifyContent: 'center',
  },
  logoutButtonTexts: {
    marginLeft: 10,
    color: 'white', // Change the text color to maroon
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000', // Maroon color
  },
  modalView: {
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
  modalView: {
    backgroundColor: "transparent", // transparent background
    alignItems: "center",
    elevation: 5
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 100,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalContents: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000', // Maroon color
  },
  modalText: {
    marginBottom: 16,
  },
});

export default ProfileScreen;