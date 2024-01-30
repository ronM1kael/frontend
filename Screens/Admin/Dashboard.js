import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';

import baseURL from "../../assets/common/baseurl";

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [filter, setFilter] = useState('all'); // Added filter state

  const [applicationCount, setApplicationsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);
  const [filterapplication, setFilterApplication] = useState('all'); // Added filter state

  // Fetch data from your backend using Axios
  useEffect(() => {
    // Replace 'your-api-endpoint/dashboardmobile' with your actual API endpoint
    axios.get(`${baseURL}dashboardmobile`)
      .then((response) => {
        const data = response.data;
        setUsersCount(data.usersCount);
        setStudentCount(data.studentCount);
        setStaffCount(data.staffCount);
        setFacultyCount(data.facultyCount);

        setApplicationsCount(data.applicationCount);
        setPendingCount(data.pendingCount);
        setPassedCount(data.passedCount);
        setReturnedCount(data.returnedCount);
        // Add more state variables based on your data structure
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const displayUserCount = () => {
    let count;

    switch (filter) {
      case 'all':
        count = usersCount;
        break;
      case 'student':
        count = studentCount;
        break;
      case 'staff':
        count = staffCount;
        break;
      case 'faculty':
        count = facultyCount;
        break;
      default:
        count = 0;
    }

    // Update the user count
    // You may want to use state for updating counts in a real-world scenario
    alert(`User Count: ${count}, Filter: ${filter}`);
  };

  const displayApplicationCount = () => {
    let countapplication;

    switch (filterapplication) {
      case 'all':
        countapplication = applicationCount;
        break;
      case 'pending':
        countapplication = pendingCount;
        break;
      case 'passed':
        countapplication = passedCount;
        break;
      case 'returned':
        countapplication = returnedCount;
        break;
      default:
        countapplication = 0;
    }

    // Update the user count
    // You may want to use state for updating counts in a real-world scenario
    alert(`Application Count: ${countapplication}, Filter: ${filterapplication}`);
  };

  // Function to change the filter
  const changeFilter = () => {
    switch (filter) {
      case 'all':
        setFilter('student');
        break;
      case 'student':
        setFilter('staff');
        break;
      case 'staff':
        setFilter('faculty');
        break;
      case 'faculty':
        setFilter('all');
        break;
      default:
        setFilter('all');
    }
  };

  const changeApplicationFilter = () => {
    switch (filterapplication) {
      case 'all':
        setFilterApplication('pending');
        break;
      case 'pending':
        setFilterApplication('passed');
        break;
      case 'passed':
        setFilterApplication('returned');
        break;
      case 'returned':
        setFilterApplication('all');
        break;
      default:
        setFilterApplication('all');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: 'https://www.bootdey.com/image/280x280/ffb3ff/000000' }} style={styles.backgroundImage} />
      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>User Role:</Text>
            <Text style={styles.itemPrice}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} title="Change Filter" onPress={changeFilter}>
            <Text style={styles.buttonText}>Change Role</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={displayUserCount}>
            <Text style={styles.buttonText}>Display User Count</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>Application Status:</Text>
            <Text style={styles.itemPrice}>{filterapplication.charAt(0).toUpperCase() + filterapplication.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} title="Change Filter" onPress={changeApplicationFilter}>
            <Text style={styles.buttonText}>Change Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={displayApplicationCount}>
            <Text style={styles.buttonText}>Display Application Count</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#fff',
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#999',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FFC107',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;