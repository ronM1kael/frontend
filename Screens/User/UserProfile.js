import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"
import baseURL from "../../assets/common/baseurl";
import baseURL2 from '../../assets/common/baseurlnew';

const ProfileScreen = () => {

  const [student, setProfileData] = useState(null);
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const checkAuthentication = async () => {
        const jwtToken = await AsyncStorage.getItem('jwt');

        if (!jwtToken || !context.stateUser.isAuthenticated) {
          navigation.navigate('Login');
        } else {
          try {
            const userProfile = context.stateUser.userProfile;

            if (!userProfile || !userProfile.id) {
              console.error("User profile or user ID is undefined");
              // Handle the error appropriately, e.g., navigate to an error screen.
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

      checkAuthentication();

      return () => {
        setProfileData(null);
      };
    }, [context.stateUser.isAuthenticated, context.stateUser.userProfile, navigation])
  );

  const handleLogout = async () => {
    // Add logic for handling logout
    logoutUser(context.dispatch, navigation)
  };

  const handleEditProfile = () => {
    // Add logic for handling profile editing
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
      // Handle error, e.g., show error message
    }
  };

  const uploadAvatar = async (uri) => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
  
      const response = await axios.post(
        `${baseURL}mobilechangeavatar`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error changing avatar:', error);
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
              onPress={() => navigation.navigate("EditProfile")}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
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
});

export default ProfileScreen;