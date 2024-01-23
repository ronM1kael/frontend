import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

import baseURL from "../../../assets/common/baseurl";

const App = () => {
  const [events, setEvents] = useState([]);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events from your backend when the component mounts
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}mobileevents`);
      const eventsData = Array.isArray(response.data) ? response.data : response.data.events;

      setEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events. Please try again.');
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post(`${baseURL}mobileevents/create`, {
        title: eventTitle,
        start: eventStart,
        end: eventEnd,
      });
      setShowCreateEventForm(false);
      await fetchEvents();
      Alert.alert('Success', 'Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Error creating event. Please try again.');
      Alert.alert('Error', 'Error creating event. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Create Event" onPress={() => setShowCreateEventForm(!showCreateEventForm)} />
      {showCreateEventForm && (
        <View style={styles.createEventForm}>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={eventTitle}
            onChangeText={(text) => setEventTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Event Start"
            value={eventStart}
            onChangeText={(text) => setEventStart(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Event End"
            value={eventEnd}
            onChangeText={(text) => setEventEnd(text)}
          />
          <Button title="Create Event" onPress={handleCreateEvent} />
        </View>
      )}
      <Calendar
        markedDates={{
          // Mark the dates with events (you may need to format the dates accordingly)
          '2024-01-01': { marked: true, dotColor: 'red' },
          '2024-01-02': { marked: true, dotColor: 'red' },
          // Add more marked dates based on your events data
        }}
        onDayPress={(day) => console.log('Selected day:', day)}
      />
      {/* Display your events in a list or any other desired format */}
      {events && events.map((event) => (
        <View key={event.id}>
          <Text>{event.title}</Text>
          <Text>{event.start}</Text>
          <Text>{event.end}</Text>
          {/* Add more event details if needed */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createEventForm: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default App;
