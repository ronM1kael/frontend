import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../../Constants/color';

const ThreeButtonsComponent = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={{ marginVertical: 22 }}>

          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginVertical: 20,
            color: COLORS.black
          }}>
            Create A User Profile
          </Text>

          <View style={{
            borderBottomColor: 'maroon',
            borderBottomWidth: 2,
            marginBottom: 20,
          }} />

          <Text style={{
            fontSize: 16,
            color: COLORS.black
          }}>All users must have a user profile to use the services. Please select how you will be using Redigitalize.</Text>

        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'maroon' }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { borderColor: 'maroon', borderWidth: 1 }]}
          onPress={() => navigation.navigate('RegisterFacultyMember')}
        >
          <Text style={[styles.buttonText, { color: 'maroon' }]}>
            Faculty Member
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'maroon' }]}
          onPress={() => navigation.navigate('RegisterStaff')}>
          <Text style={styles.buttonText}>Staff</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 22 }}>

          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginVertical: 20,
            color: COLORS.black
          }}>
            Existing User?
          </Text>

          <View style={{
            borderBottomColor: 'maroon',
            borderBottomWidth: 2,
            marginBottom: 20,
          }} />

          <Text style={{
            fontSize: 16,
            color: COLORS.black
          }}>If you've used the service before, there is no requirement to create a new user profile.
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{
                fontSize: 18,
                color: '#800000',
                fontWeight: "bold",
                marginLeft: 6
              }}>here </Text>
            </TouchableOpacity>with your old credentials.</Text>

        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'maroon',
  },
  button: {
    width: 200,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ThreeButtonsComponent;
