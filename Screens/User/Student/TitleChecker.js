import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import baseURL from '../../../assets/common/baseurl';

const YourComponent = () => {
  const [researchTitle, setResearchTitle] = useState('');
  const [researchList, setResearchList] = useState([]);
  const [researchCount, setResearchCount] = useState(0);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResearchList();
  }, []);

  const fetchResearchList = async (query = '') => {
    try {
      const response = await fetch(`${baseURL}mobile/title-checker-page?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResearchList(data.researchlist);
      setResearchCount(data.researchlist.length);
      setError('');
    } catch (error) {
      console.error('Error fetching research list:', error);
      setError('Error fetching research list');
    }
  };

  const searchResearch = () => {
    fetchResearchList(researchTitle);
  };

  const openResearchModal = async (id) => {
    try {
      const response = await fetch(`${baseURL}mobile/show-research-info/${id}`);
      const data = await response.json();
      setSelectedResearch(data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching research info:', error);
      setError('Error fetching research info');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Title Checker</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter research title"
          value={researchTitle}
          onChangeText={setResearchTitle}
        />
        <Button title="Search" onPress={searchResearch} color="#800000" />
      </View>
      {error ? (
        <Text style={[styles.listItem, { color: '#800000' }]}>{error}</Text>
      ) : researchCount === 0 ? (
        <Text style={[styles.listItem, { color: '#800000' }]}>Nothing matched your title.</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={researchList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity onPress={() => openResearchModal(item.id)}>
                <Text style={styles.researchTitle}>{item.research_title}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Research Details</Text>
          <Text>Research Title: {selectedResearch?.research_title}</Text>
          <Text>Research Abstract: {selectedResearch?.abstract}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} color="#800000" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f8ff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000', // Maroon color
  },
  input: {
    height: 40,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  researchTitle: {
    color: '#800000', // Maroon color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000', // Maroon color
  },
});

export default YourComponent;
