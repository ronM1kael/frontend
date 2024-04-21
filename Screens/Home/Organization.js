import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import baseURL2 from '../../assets/common/baseurlnew';

const OrganizationTab = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${baseURL2}/assets/img/org.png` }}
        style={styles.image}
        resizeMode="contain" // Adjust resizeMode to "contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default OrganizationTab;
