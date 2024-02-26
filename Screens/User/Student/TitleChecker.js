import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal } from 'react-native';

import baseURL from '../../../assets/common/baseurl';

const YourComponent = () => {
  const [researchTitle, setResearchTitle] = useState('');
  const [researchList, setResearchList] = useState([]);
  const [researchCount, setResearchCount] = useState(0);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchResearchList();
  }, []);

  const fetchResearchList = async () => {
    try {
      const response = await fetch(`${baseURL}mobile/title-checker-page`);
      const data = await response.json();
      setResearchList(data.researchList);
      setResearchCount(data.researchCount);
    } catch (error) {
      console.error('Error fetching research list:', error);
    }
  };

  const searchResearch = async () => {
    try {
      const response = await fetch(`${baseURL}mobile/count-title-occurrences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ research_title: researchTitle }),
      });
      const data = await response.json();
      setResearchList(data.researchList);
      setResearchCount(data.researchCount);
    } catch (error) {
      console.error('Error searching research:', error);
    }
  };

  const openResearchModal = async (id) => {
    try {
      const response = await fetch(`${baseURL}mobile/show-research-info/${id}`);
      const data = await response.json();
      setSelectedResearch(data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching research info:', error);
    }
  };

  return (
    <View>
      <View>
        <Text>Title Checker</Text>
        <TextInput
          placeholder="Enter research title"
          value={researchTitle}
          onChangeText={setResearchTitle}
        />
        <Button title="Search" onPress={searchResearch} />
      </View>
      {researchCount === 0 ? (
        <Text>Nothing matched your title.</Text>
      ) : (
        <FlatList
          data={researchList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text onPress={() => openResearchModal(item.id)}>{item.research_title}</Text>
          )}
        />
      )}
      <Modal visible={modalVisible} animationType="slide">
        <View>
          <Text>Research Details</Text>
          <Text>Research Title: {selectedResearch?.research_title}</Text>
          <Text>Research Abstract: {selectedResearch?.abstract}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default YourComponent;