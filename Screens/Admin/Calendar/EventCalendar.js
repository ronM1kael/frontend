import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import CreateEventForm from './CreateEventForm';
import axios from 'axios';
import baseURL from "../../../assets/common/baseurl";

const CalendarScreen = () => {
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}events`);
      console.log('Events response:', response.data); // Add this line
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const createEvent = async (eventData) => {
    try {
      await axios.post(`${baseURL}events/create`, eventData);
      fetchEvents();
      setShowCreateEventForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <View>
      <Button title="Create Event" onPress={() => setShowCreateEventForm(true)} />

      {showCreateEventForm && (
        <CreateEventForm onSubmit={createEvent} onCancel={() => setShowCreateEventForm(false)} />
      )}

      <View>
        {/* Render your calendar with events */}
        {events.length > 0 ? (
          events.map((event) => {
            console.log('Event:', event); // Add this line
            return (
              <View key={event.id}>
                <Text>{event.title}</Text>
                {/* Render other event details */}
              </View>
            );
          })
        ) : (
          <Text>No events available</Text>
        )}
      </View>
    </View>
  );
};

export default CalendarScreen;