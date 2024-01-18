import React, { useContext, useState, useEffect, useCallback  } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import baseURL from "../../assets/common/baseurl";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import axios from "axios"
import AuthGlobal from "../../Context/Store/AuthGlobal"
import AsyncStorage from '@react-native-async-storage/async-storage'

import { logoutUser } from "../../Context/Actions/Auth.actions"

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

  return (
    <KeyboardAwareScrollView>
    <View style={styles.container}>
    <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://www.bootdey.com/img/Content/avatar/avatar6.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {student ? `${student.fname} ${student.mname} ${student.lname}` : ''}
        </Text>
      </View>

      {/* Logout button with icon */}
      <TouchableOpacity style={styles.logoutButton}>
        <Icon name="sign-out" type="material" size={24} color="maroon" />
        <Text style={styles.logoutButtonText} 
              onPress={() => handleLogout()}>Logout
        </Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>TUP-ID:</Text>
        <Text style={styles.infoValue}>{student ? student.tup_id : ""}</Text>
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
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{student ? student.email : ""}</Text>
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
    </View>
    </KeyboardAwareScrollView>
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
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    marginTop: 5,
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