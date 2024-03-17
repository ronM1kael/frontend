import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, SafeAreaView } from 'react-native';
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
        `${baseURL}mobilechangeavatar/${userProfile.email}`,
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

      // Show success message
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Success",
        text2: "Avatar uploaded successfully",
      });

    } catch (error) {
      console.error('Error changing avatar:', error);
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

      const email = userProfile.email;

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

      setProfileData(response.data.student);
      setIsModalVisible(false);

      // Show success message
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatBirthdate = (birthdate) => {
    if (!birthdate) return '';

    const date = new Date(birthdate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={[styles.avatarContainer, { backgroundColor: 'gray' }]}>
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
              <Icon name="sign-out" size={24} color={'black'} />
              <Text style={styles.logoutButtonText} onPress={handleLogout}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.content}>
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
            </View>
          )}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Icon name="edit" size={24} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Icon name="times" size={24} color={'black'} />
              </TouchableOpacity>
              <ScrollView>
                <Text style={styles.modalTitle}>Edit Profile</Text>
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
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.inputField, styles.addressInput]}
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  placeholder="Enter Address"
                  multiline={true}
                  numberOfLines={4}
                />
                <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={styles.datePicker}>
                  <Icon name="calendar" size={20} color={COLORS.black} />
                  <Text style={styles.datePickerText}>{formatBirthdate(formData.birthdate)}</Text>
                </TouchableOpacity>
                {isDateTimePickerVisible && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={formData.birthdate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
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
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  clearButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  clearButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  textWithShadow: {
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileInfo: {
    marginTop: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: 'gray',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    color: 'gray',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  datePickerText: {
    marginLeft: 10,
    color: 'black',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
