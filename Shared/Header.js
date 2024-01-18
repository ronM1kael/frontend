import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const Header = () => {
  const handleBellPress = () => {
    // Handle bell icon press action here
    // For example, show notifications or perform any other action
    console.log('Bell icon pressed!');
    // Add your logic for notification handling or other actions
  };

  return (
    <SafeAreaView>
    <View style={styles.headerContainer}>
      <View style={styles.leftContent}>
        <Image
          source={require("../assets/tup.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require("../assets/res.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.companyName}>R&E-Services</Text>
      </View>
      <View style={styles.bellContainer}>
        <TouchableOpacity onPress={handleBellPress} style={styles.bellIconContainer}>
          <Image
            source={require("../assets/notification_bell.png")}
            style={styles.bellIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: 'maroon',
    paddingHorizontal: 16,
    paddingTop: 30
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginLeft: 10,
  },
  bellContainer: {
    width: 50, // Adjust the width as needed
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'maroon', // Separator color
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: 25,
    height: 25,
    tintColor: 'maroon', // Adjust bell icon color
  },
});

export default Header;
