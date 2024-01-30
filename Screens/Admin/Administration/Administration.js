import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Modal, TextInput } from 'react-native';
import axios from 'axios';

import baseURL from "../../../assets/common/baseurl";

const AdminScreen = () => {
  const [adminList, setAdminList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    admin_fname: '',
    admin_lname: '',
    // Add other form fields as needed
  });

  const fetchAdminList = async () => {
    try {
      const response = await axios.get(`${baseURL}mobileadministration`);
      setAdminList(response.data.adminlist);
    } catch (error) {
      console.error('Error fetching admin list:', error);
    }
  };

  const openModal = () => {
    setFormData({
      admin_fname: '',
      admin_lname: '',
      // Initialize other form fields as needed
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addAdministrator = async () => {
    try {
      const response = await axios.post(`${baseURL}mobileaddadministration`, formData);
      console.log('Administrator added:', response.data);
      fetchAdminList(); // Refresh the admin list after adding
      closeModal();
    } catch (error) {
      console.error('Error adding administrator:', error);
    }
  };

  const editAdministrator = async (id) => {
    // Fetch the administrator data for editing
    try {
      const response = await axios.get(`${baseURL}mobileeditadministration/${id}`);
      setFormData(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching administrator for editing:', error);
    }
  };

  const updateAdministrator = async (id) => {
    // Send a PUT request to update the administrator
    try {
      const response = await axios.put(`${baseURL}mobileupdateadministration/${id}`, formData);
      console.log('Administrator updated:', response.data);
      fetchAdminList(); // Refresh the admin list after updating
      closeModal();
    } catch (error) {
      console.error('Error updating administrator:', error);
    }
  };

  const deleteAdministrator = async (id) => {
    // Send a DELETE request to delete the administrator
    try {
      const response = await axios.delete(`${baseURL}mobiledeleteadministration/${id}`);
      console.log('Administrator deleted:', response.data);
      fetchAdminList(); // Refresh the admin list after deleting
    } catch (error) {
      console.error('Error deleting administrator:', error);
    }
  };

  useEffect(() => {
    fetchAdminList();
  }, []);

  return (
    <View>
      <Text>Administrator List</Text>
      <FlatList
        data={adminList}
        keyExtractor={(item) => item.userid.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.fname} {item.lname}</Text>
            <Button title="Edit" onPress={() => editAdministrator(item.id)} />
            <Button title="Delete" onPress={() => deleteAdministrator(item.id)} />
            {/* Add other details as needed */}
          </View>
        )}
      />

      <Button title="Add Administrator" onPress={openModal} />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View>
          <Text>Add/Edit Administrator</Text>
          <TextInput
            placeholder="First Name"
            value={formData.admin_fname}
            onChangeText={(text) => handleInputChange('admin_fname', text)}
          />
          <TextInput
            placeholder="Last Name"
            value={formData.admin_lname}
            onChangeText={(text) => handleInputChange('admin_lname', text)}
          />
          {/* Add other form fields as needed */}
          <Button title="Save" onPress={addAdministrator} />
          <Button title="Update" onPress={() => updateAdministrator(formData.id)} />
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

export default AdminScreen;
