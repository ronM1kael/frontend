import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';

const CalendarEventsApp = () => {
  const [items, setItems] = useState({});

  const loadItems = (day) => {
    // Simulating data loading, you can replace this with actual data retrieval logic
    setTimeout(() => {
      const newItems = {
        '2024-03-07': [{ name: 'Event 1' }, { name: 'Event 2' }],
        '2024-03-10': [{ name: 'Event 3' }],
        '2024-03-15': [{ name: 'Event 4' }, { name: 'Event 5' }],
      };
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          console.log('selected day', day);
          loadItems(day);
        }}
      />
      <Agenda
        items={items}
        renderItem={(item) => renderItem(item)}
        onRefresh={() => loadItems()}
        refreshing={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
});

export default CalendarEventsApp;