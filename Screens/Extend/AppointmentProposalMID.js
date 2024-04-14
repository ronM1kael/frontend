import React, { useState, useContext } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import baseURL from '../../assets/common/baseurl';

const AppointmentModalMID = ({ visible, closeModal, extensionId }) => {
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const context = useContext(AuthGlobal);

  const handleSubmit = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      const user_id = userProfile.id;

      const response = await axios.post(
        `${baseURL}mobilecheckingDate`,
        {
          date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          time,
        }
      );

      if (response.data.exists) {
        Toast.show({
          type: 'error',
          text1: 'Appointment Conflict',
          text2: 'Date Already Reserved.',
        });
        setDate(new Date());
        setTime('');
      } else {
        const appointmentData = {
          extensionId,
          purpose,
          date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          time,
          user_id: user_id,
        };

        const res = await axios.post(
          `${baseURL}mobilefacultySchedulingAppointment1`,
          appointmentData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (res.data.success) {
          Toast.show({
            type: 'success',
            text1: 'Your schedule has been sent;',
            text2: 'kindly wait to be approved.',
          });
          closeModal();
        } else {
          alert('Failed to schedule appointment. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while scheduling appointment.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Make an Appointment for a Mid-Survey Consultation</Text>
          <View style={styles.separator} />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Icon name="close" size={20} color="#333" />
          </TouchableOpacity>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="tasks" size={20} color="#000" />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={purpose}
                  onValueChange={(itemValue) => setPurpose(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="--- SELECT PURPOSE ---" value="" />
                  <Picker.Item label="Consultation Meeting for Mid-Evaluation Survey" value="Mid-Survey Consultation" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Icon name="calendar" size={20} color="#000" />
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateContainer}>
                <Text style={styles.dateText}>{date.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
              <Icon name="clock-o" size={20} color="#000" />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={time}
                  onValueChange={(itemValue) => setTime(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="--- SELECT TIME RANGE ---" value="" />
                  <Picker.Item label="09:00 AM - 10:00 AM" value="09:00 AM - 10:00 AM" />
                  <Picker.Item label="10:00 AM - 11:00 AM" value="10:00 AM - 11:00 AM" />
                  <Picker.Item label="11:00 AM - 12:00 NN" value="11:00 AM - 12:00 NN" />
                  <Picker.Item label="01:00 PM - 02:00 PM" value="01:00 PM - 02:00 PM" />
                  <Picker.Item label="02:00 PM - 03:00 PM" value="02:00 PM - 03:00 PM" />
                  <Picker.Item label="03:00 PM - 04:00 PM" value="03:00 PM - 04:00 PM" />
                </Picker>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} color="#000" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff', // white background for the modal
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
  },
  separator: {
    height: 2,
    backgroundColor: 'maroon', // Maroon color for the separator
    marginBottom: 20, // Adjust spacing as needed
  },
  formContainer: {
    width: '100%', // Full width
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000', // Black color for the text
  },
  dateContainer: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  dateText: {
    color: '#000',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center align the button
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default AppointmentModalMID;
