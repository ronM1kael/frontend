import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../../Constants/color';

const ThreeButtonsComponent = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>
          Create A User Profile
        </Text>

        <View style={styles.separator} />

        <Text style={styles.description}>
          All users must have a user profile to use the services. Please select how you will be using Redigitalize.
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.studentButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonTexts}>I am a Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.facultyButton]}
          onPress={() => navigation.navigate('RegisterFacultyMember')}
        >
          <Text style={styles.buttonText}>I am a Faculty Member</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.staffButton]}
          onPress={() => navigation.navigate('RegisterStaff')}
        >
          <Text style={styles.buttonTexts}>I am a Staff Member</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>
          Already have an account?
        </Text>

        <View style={styles.separator} />

        <Text style={styles.description}>
          If you've used the service before, there is no requirement to create a new user profile.
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}> Click here </Text>
          to login with your existing credentials.
        </Text>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
    textAlign: 'center',
  },
  separator: {
    borderBottomColor: COLORS.maroon,
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  buttonTexts: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  studentButton: {
    backgroundColor: 'black',
  },
  facultyButton: {
    backgroundColor: COLORS.maroon,
    borderColor: COLORS.maroon,
    borderWidth: 1,
  },
  staffButton: {
    backgroundColor: 'black',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: COLORS.black,
    textAlign: 'center',
  },
  link: {
    color: COLORS.maroon,
    fontWeight: 'bold',
  },
});

export default ThreeButtonsComponent;
