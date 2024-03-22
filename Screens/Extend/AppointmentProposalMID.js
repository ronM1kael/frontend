import React, { useState, useContext } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const AppointmentModal = ({ visible, closeModal, extensionId }) => {
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
        alert('Appointment Conflict: Date Already Reserved');
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
          alert('Your schedule has been sent; kindly wait to be approved.');
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
          <Text style={styles.modalTitle}>Make an Appointment</Text>
          <View style={styles.formContainer}>
            <Picker
              selectedValue={purpose}
              onValueChange={(itemValue) => setPurpose(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="--- SELECT PURPOSE ---" value="" />
              {/* <Picker.Item label="Consultation Meeting for Proposal" value="Proposal Consultation" /> */}
              {/* <Picker.Item label="Consultation Meeting for Pre-Evaluation Survey" value="Pre-Survey Consultation" /> */}
              <Picker.Item label="Consultation Meeting for Mid-Evaluation Survey" value="Mid-Survey Consultation" />
            </Picker>
            <View style={styles.dateContainer}>
              <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
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
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} />
              <Button title="Close" onPress={closeModal} />
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
  },
  formContainer: {
    width: '100%', // Full width
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AppointmentModal;