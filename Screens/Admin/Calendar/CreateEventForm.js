import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseurl";

const CreateEventForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleCreateEvent = async () => {
    try {
      // Validate input
      if (!title) {
        console.error('Event title is required.');
        return;
      }

      // Pass the data to the onSubmit prop
      onSubmit({ title, start, end });

      // Note: You may choose to reset the form fields here if needed
      // setTitle('');
      // setStart('');
      // setEnd('');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <View>
      <Text>Event Title</Text>
      <TextInput value={title} onChangeText={setTitle} />

      <Text>Event Start</Text>
      <TextInput value={start} onChangeText={setStart} />

      <Text>Event End</Text>
      <TextInput value={end} onChangeText={setEnd} />

      <Button title="Create Event" onPress={handleCreateEvent} />
      <Button title="Close" onPress={onCancel} />
    </View>
  );
};

export default CreateEventForm;
