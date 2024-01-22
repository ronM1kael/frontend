import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';

import baseURL from "../../assets/common/baseurl";

const DashboardScreen = () => {
  const [data, setData] = useState({
    usersCount: 0,
    studentCount: 0,
    staffCount: 0,
    facultyCount: 0,
    applicationCount: 0,
    pendingCount: 0,
    passedCount: 0,
    returnedCount: 0,
  });

  const [userFilter, setUserFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('applications');

  useEffect(() => {
    fetchData();
  }, [userFilter, applicationFilter]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}dashboardmobile`, {
        params: {
          userFilter,
          applicationFilter,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const InfoCard = ({ title, count, backgroundColor, renderFilterOptions, filterState, setFilterState }) => (
    <View style={styles.infoCard}>
      <TouchableOpacity style={[styles.filterButton, { backgroundColor: 'white' }]} onPress={() => renderFilterOptions(setFilterState)}>
        <Text>{`Filter: ${filterState}`}</Text>
      </TouchableOpacity>
      <Text style={styles.cardTitle}>{title} | {count}</Text>
      {/* ... other data specific to the info card */}
    </View>
  );

  const renderFilterOptions = (filterState, setFilterState, filterOptions) => {
    return (
      <View style={styles.filterOptionsContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.filterOption}
            onPress={() => setFilterState(option.value)}
          >
            <Text>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const userFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Student', value: 'student' },
    { label: 'Staff', value: 'staff' },
    { label: 'Faculty Member', value: 'faculty' },
  ];

  const applicationFilterOptions = [
    { label: 'All', value: 'applications' },
    { label: 'Pending', value: 'pending' },
    { label: 'Passed', value: 'passed' },
    { label: 'Returned', value: 'returned' },
  ];

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <InfoCard
            title="Users"
            count={data.usersCount}
            backgroundColor="maroon"
            renderFilterOptions={() => renderFilterOptions(userFilter, setUserFilter, userFilterOptions)}
            filterState={userFilter}
            setFilterState={setUserFilter}
          />
          <InfoCard
            title="Applications"
            count={data.applicationCount}
            backgroundColor="maroon"
            renderFilterOptions={() => renderFilterOptions(applicationFilter, setApplicationFilter, applicationFilterOptions)}
            filterState={applicationFilter}
            setFilterState={setApplicationFilter}
          />
          <InfoCard title="Researchs" count={data.usersCount} backgroundColor="maroon" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column', // Change to 'column' for a column layout
  },
  infoCard: {
    height: 150, // Set a fixed height for all cards
    backgroundColor: 'maroon', // Default color, will be overridden by props
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  filterButton: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  filterOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  filterOption: {
    padding: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // Add more styles as needed
});

export default DashboardScreen;
