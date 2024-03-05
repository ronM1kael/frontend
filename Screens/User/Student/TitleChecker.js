import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';
import baseURL from '../../../assets/common/baseurl';

import Icon from "react-native-vector-icons/FontAwesome";

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.title, { textAlign: 'center', color: 'maroon' }]}>Title Checker</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              // placeholder="Enter Research Title"
              value={researchTitle}
              onChangeText={setResearchTitle}
            />
            <TouchableOpacity style={styles.searchIcon} onPress={searchResearch}>
              <Icon name="search" size={20} color="#800000" />
            </TouchableOpacity>
          </View>
        </View>
        {error ? (
          <Text style={[styles.listItem, { color: '#800000' }]}>{error}</Text>
        ) : researchCount === 0 ? (
          <Text style={[styles.listItem, { color: '#800000' }]}>Nothing matched your title.</Text>
        ) : (
          <ScrollView style={styles.list}>
            {researchList.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => openResearchModal(item.id)}>
                <View style={styles.listItem}>
                  <Text style={styles.researchTitle}>{item.research_title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <Modal visible={modalVisible} animationType="slide">
          {selectedResearch && (
            <ScrollView>
              <View style={[styles.modalContainer, { marginLeft: 20, marginRight: 20 }]}>
                <View>
                  <Text style={[styles.modalTitle, { marginTop: 30 }]}>Research Title:</Text>
                  <Text style={{ marginBottom: 30, color: 'maroon', fontStyle: 'italic' }}>
                    "{selectedResearch?.research_title}"
                  </Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Abstract:</Text>
                  <Text style={{ marginBottom: 16 }}>
                    {selectedResearch?.abstract}
                  </Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Department:</Text>
                  <Text style={{ marginBottom: 16 }}>
                    {selectedResearch?.department}
                  </Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Course:</Text>
                  <Text style={{ marginBottom: 16 }}>
                    {selectedResearch?.course}
                  </Text>
                  <Text style={[styles.modalTitle, { marginBottom: 30 }]}>Research Details</Text>
                  {selectedResearch.faculty_adviser1 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 1:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.faculty_adviser1}
                      </Text>
                    </>
                  )}
                  {selectedResearch.faculty_adviser2 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 2:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.faculty_adviser2}
                      </Text>
                    </>
                  )}
                  {selectedResearch.faculty_adviser3 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 3:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.faculty_adviser3}
                      </Text>
                    </>
                  )}
                  {selectedResearch.faculty_adviser4 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 4:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.faculty_adviser4}
                      </Text>
                    </>
                  )}
                  {selectedResearch.researcher1 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 1:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.researcher1}
                      </Text>
                    </>
                  )}
                  {selectedResearch.researcher2 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 2:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.researcher2}
                      </Text>
                    </>
                  )}
                  {selectedResearch.researcher3 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 3:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.researcher3}
                      </Text>
                    </>
                  )}
                  {selectedResearch.researcher4 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 4:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.researcher4}
                      </Text>
                    </>
                  )}
                  {selectedResearch.researcher5 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 5:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.researcher5}
                      </Text>
                    </>
                  )}
                  {selectedResearch.researcher6 && (
                    <>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 6:</Text>
                      <Text style={{ marginBottom: 16 }}>
                        {selectedResearch?.researcher6}
                      </Text>
                    </>
                  )}
                  <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Time Frame:</Text>
                  <Text style={{ marginBottom: 16 }}>
                    {selectedResearch?.time_frame}
                  </Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Date Completion:</Text>
                  <Text style={{ marginBottom: 16 }}>
                    {selectedResearch?.date_completion}
                  </Text>
                </View>
                <Button title="Close" onPress={() => setModalVisible(false)} color="#800000" />
              </View>
            </ScrollView>
          )}
        </Modal>
      </View>
    </SafeAreaView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default YourComponent;