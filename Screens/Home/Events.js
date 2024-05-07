import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Fetch events when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}eventMobileHomePage`);
      const eventsData = response.data;
      const marked = generateMarkedDates(eventsData);
      setEvents(eventsData);
      setMarkedDates(marked);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Generate marked dates for the calendar
  const generateMarkedDates = (eventsData) => {
    const marked = {};

    eventsData.forEach((event) => {
      const startDate = event.start.split(' ')[0]; // Updated to consider only date part
      const endDate = event.end.split(' ')[0]; // Updated to consider only date part

      let currentDate = new Date(startDate);
      const endDateObj = new Date(endDate);

      while (currentDate <= endDateObj) {
        const dateString = currentDate.toISOString().split('T')[0];
        marked[dateString] = { marked: true };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return marked;
  };

  // Handle day press on the calendar
  const handleDayPress = (date) => {
    const selectedDateString = date.dateString;
    const eventsOnSelectedDate = events.filter(
      (event) => event.start.split(' ')[0] === selectedDateString
    );

    if (eventsOnSelectedDate.length > 0) {
      // If events are found, show modal with event details
      showEventDetailsModal(eventsOnSelectedDate);
    } else {
      // If no events are found, show toast notification
      showToastNotification();
    }
  };

  // Show modal with event details
  const showEventDetailsModal = (events) => {
    // Implement your modal logic here
    // Use events array to display event details
    // You can use libraries like react-native-modal for modal implementation
    // Example: Show alert with event details
    Alert.alert(
      'Event Details',
      `Title: ${events[0].title}\nStart: ${events[0].start}\nEnd: ${events[0].end}`,
      [
        {
          text: 'OK',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  // Show toast notification for no events on selected date
  const showToastNotification = () => {
    Alert.alert(
      'No Events',
      'There are no events for this date.',
      [
        {
          text: 'OK',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'period'}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#000000',
          textSectionTitleDisabledColor: '#8c8c8c',
          todayTextColor: '#007bff',
          dayTextColor: '#000000',
          textDisabledColor: '#8c8c8c',
          dotColor: '#007bff',
          selectedDayBackgroundColor: '#007bff',
          selectedDayTextColor: '#ffffff',
          arrowColor: '#007bff',
          monthTextColor: '#007bff',
          indicatorColor: '#007bff',
          textDayFontFamily: 'Roboto',
          textMonthFontFamily: 'Roboto',
          textDayHeaderFontFamily: 'Roboto',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
        onDayPress={handleDayPress} // Handle day press event
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default EventCalendar;
