import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}eventMobileHomePage`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const renderEvent = (event) => {
    return (
      <View key={event.id} style={styles.eventContainer}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventTime}>{event.start} - {event.end}</Text>
        {/* Add more event details here */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
  markedDates={events.reduce((markedDates, event) => {
    const startDate = event.start;
    const endDate = event.end;
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const dateString = currentDate.toISOString().split('T')[0];
      markedDates[dateString] = { marked: true };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return markedDates;
  }, {})}
/>
      <View style={styles.eventsContainer}>
        {events.map(renderEvent)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  eventContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 16,
    color: '#888',
  },
});

export default EventCalendar;
