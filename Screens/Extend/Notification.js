import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const Notification = ({ message, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 4, // Add elevation for shadow on Android
    borderRadius: 8, // Add border radius for rounded corners
    marginHorizontal: 16, // Add margin horizontally
    marginTop: 16, // Add margin from top
  },
  message: {
    fontSize: 16,
    color: '#333333',
  },
});

export default Notification;
