import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import baseURL from '../../../assets/common/baseurl';

import Icon from "react-native-vector-icons/FontAwesome";

const YourComponent = () => {
  const [researchTitle, setResearchTitle] = useState('');
  const [researchList, setResearchList] = useState([]);
  const [researchCount, setResearchCount] = useState(0);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  const [requestModalVisible, setRequestModalVisible] = useState(false);

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

  const openRequestModal = () => {
    setRequestModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.title, { textAlign: 'left', color: 'maroon' }]}>Title Checker</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={researchTitle}
              onChangeText={setResearchTitle}
            />
            <TouchableOpacity style={styles.searchIcon}
              onPress={searchResearch}
              underlayColor="#E8E8E8">
              <Icon name="search" size={20} color="#800000" />
            </TouchableOpacity>
          </View>
        </View>
        {error ? (
          <Text style={[styles.listItem, { color: '#800000' }]}>{error}</Text>
        ) : researchCount === 0 ? (
          <Text style={[styles.listItem, { color: '#800000' }]}>Nothing matched your title.</Text>
        ) : (
          // Inside the return statement of YourComponent
          <ScrollView style={styles.list}>
            {researchList.map((item) => (
              <TouchableWithoutFeedback key={item.id} onPress={() => openResearchModal(item.id)}>
                <View style={styles.listItem}>
                  <View style={styles.itemContent}>
                    <Text style={styles.researchTitle}>{item.research_title}</Text>
                    <TouchableOpacity style={styles.requestButton} onPress={openRequestModal}>
                      <Icon name="lock" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          {selectedResearch && (
            <ScrollView>
              <View style={[styles.modalContainer, { marginTop: 50, marginHorizontal: 20 }]}>
                <View style={styles.modalContents}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      alignSelf: "flex-end",
                      position: "absolute",
                      top: 5,
                      right: 10,
                    }}
                  >
                    <Icon name="close" size={20} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { marginTop: 30 }]}>Research Title</Text>
                  <Text style={{ marginBottom: 30, color: 'maroon', fontStyle: 'italic' }}>
                    {selectedResearch?.research_title}
                  </Text>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>Abstract:</Text>
                    <Text style={{ marginBottom: -80, marginLeft: 70, flex: 1 }}>
                      {selectedResearch?.abstract}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Department:</Text>
                    <Text style={{ marginBottom: 16, marginLeft: 50 }}>
                      {selectedResearch?.department}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Course:</Text>
                    <Text style={{ marginBottom: 30, marginLeft: 80 }}>
                      {selectedResearch?.course}
                    </Text>
                  </View>

                  <Text style={[styles.modalTitle, { marginBottom: 30 }]}>Research Details</Text>
                  {selectedResearch.faculty_adviser1 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 1:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                          {selectedResearch?.faculty_adviser1}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.faculty_adviser2 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 2:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                          {selectedResearch?.faculty_adviser2}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.faculty_adviser3 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 3:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                          {selectedResearch?.faculty_adviser3}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.faculty_adviser4 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty Adviser 4:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                          {selectedResearch?.faculty_adviser4}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.researcher1 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 1:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 46 }}>
                          {selectedResearch?.researcher1}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.researcher2 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 2:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 46 }}>
                          {selectedResearch?.researcher2}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.researcher3 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 3:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 46 }}>
                          {selectedResearch?.researcher3}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.researcher4 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 4:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 46 }}>
                          {selectedResearch?.researcher4}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.researcher5 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 5:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 46 }}>
                          {selectedResearch?.researcher5}
                        </Text>
                      </View>
                    </>
                  )}
                  {selectedResearch.researcher6 && (
                    <>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 6:</Text>
                        <Text style={{ marginBottom: 16, marginLeft: 46 }}>
                          {selectedResearch?.researcher6}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Time Frame:</Text>
                    <Text style={{ marginBottom: 16, marginLeft: 53 }}>
                      {selectedResearch?.time_frame}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Date Completion:</Text>
                    <Text style={{ marginBottom: 16, marginLeft: 23 }}>
                      {selectedResearch?.date_completion}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </Modal>

        <Modal visible={requestModalVisible} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={() => setRequestModalVisible(false)}
                  style={{
                    alignSelf: "flex-end",
                    position: "absolute",
                    top: 5,
                    right: 10,
                  }}
                >
                  <Icon name="close" size={20} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Request Access</Text>
                <View style={styles.inputContainer}>
                  <View
                    style={{
                      width: "95%",
                      height: 100,
                      borderColor: "#800000",
                      borderWidth: 1,
                      borderRadius: 8,
                      flexDirection: 'row', // Added to enable horizontal layout
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 10, // Adjusted padding for spacing
                    }}
                  >
                    <TextInput
                      style={styles.inputs}
                      // value={abstract}
                      // onChangeText={(text) => setAbstract(text)}
                      multiline={true}
                      numberOfLines={4}
                    />
                    <TouchableOpacity style={{ marginLeft: 10 }}>
                      <View style={{ backgroundColor: 'maroon', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Send Request</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
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
    borderColor: '#800000',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
  },
  requestButton: {
    backgroundColor: '#800000', // Maroon color
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 300, // Adjust the margin-left as needed
  },
  requestButtonText: {
    color: '#fff', // White color
    fontWeight: 'bold',
  },
  itemContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent', // transparent background
  },
  modalView: {
    backgroundColor: "transparent", // transparent background
    alignItems: "center",
    elevation: 5
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalContents: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000', // Maroon color
  },
  modalText: {
    marginBottom: 16,
  },
  inputs: {
    paddingRight: 10,
    lineHeight: 23,
    flex: 2,
    textAlignVertical: 'top'
  },
});

export default YourComponent;