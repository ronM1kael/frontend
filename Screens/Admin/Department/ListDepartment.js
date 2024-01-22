// Import necessary modules from React and React Native
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    ActivityIndicator,
    Alert,
} from 'react-native';

// Import your base URL from the common folder
import baseURL from "../../../assets/common/baseurl";

// Function to handle API requests and show error alerts
const handleApiRequest = async (url, method, body = null) => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
        throw error;
    }
};

// DepartmentScreen component
const DepartmentScreen = () => {
    // State variables for department data and form management
    const [loading, setLoading] = useState(true);
    const [showAddDepartmentForm, setShowAddDepartmentForm] = useState(false);
    const [editDepartmentInfoModalVisible, setEditDepartmentInfoModalVisible] = useState(false);
    const [editDepartmentId, setEditDepartmentId] = useState('');
    const [deptName, setDeptName] = useState('');
    const [deptCode, setDeptCode] = useState('');
    const [departmentlists, setDepartmentLists] = useState([]);

    // Function to reload department list
    const reloadDepartmentList = () => {
        setLoading(true);
        fetchDepartmentList();
    };

    // Fetch departments on component mount
    useEffect(() => {
        fetchDepartmentList();
    }, []);

    // Function to fetch department list
    const fetchDepartmentList = async () => {
        try {
            const data = await handleApiRequest(`${baseURL}departmentsmobile`, 'GET');
            setDepartmentLists(data.departmentlists);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    // Function to toggle add department form visibility
    const toggleAddDepartmentForm = () => {
        setShowAddDepartmentForm(!showAddDepartmentForm);
    };

    // Function to handle add department
    const handleAddDepartment = async () => {
        try {
            const data = await handleApiRequest(`${baseURL}departmentsmobile`, 'POST', {
                department_name: deptName,
                department_code: deptCode,
            });

            setDepartmentLists([...departmentlists, data]);
            toggleAddDepartmentForm();
            reloadDepartmentList(); // Trigger reload after adding department
        } catch (error) {
            // Error handling is done in handleApiRequest function
        }
    };

    // Function to show edit department info modal
    const showEditDepartmentInfoModal = async (id) => {
        setEditDepartmentId(id);
        try {
            const data = await handleApiRequest(`${baseURL}departmentsmobile/${id}`, 'GET');
            setDeptName(data.department_name);
            setDeptCode(data.department_code);
            setEditDepartmentInfoModalVisible(true);
        } catch (error) {
            // Error handling is done in handleApiRequest function
        }
    };

    // Function to handle edit department
    const handleEditDepartment = async () => {
        try {
            const data = await handleApiRequest(`${baseURL}departmentsmobile/${editDepartmentId}`, 'PUT', {
                dept_name: deptName,
                dept_code: deptCode,
            });

            const updatedDepartmentList = departmentlists.map((item) =>
                item.id === editDepartmentId
                    ? { ...item, department_name: data.department_name, department_code: data.department_code }
                    : item
            );

            setDepartmentLists(updatedDepartmentList);
            hideEditDepartmentInfoModal();
            reloadDepartmentList(); // Trigger reload after editing department
        } catch (error) {
            // Error handling is done in handleApiRequest function
        }
    };

    // Function to handle delete department
    const handleDeleteDepartment = async (id) => {
        try {
            await handleApiRequest(`${baseURL}departmentsmobile/${id}`, 'DELETE');
            const updatedDepartmentList = departmentlists.filter((item) => item.id !== id);
            setDepartmentLists(updatedDepartmentList);
            reloadDepartmentList(); // Trigger reload after deleting department
        } catch (error) {
            // Error handling is done in handleApiRequest function
        }
    };

    // Function to hide edit department info modal
    const hideEditDepartmentInfoModal = () => {
        setEditDepartmentInfoModalVisible(false);
        setEditDepartmentId('');
        setDeptName('');
        setDeptCode('');
    };

    // Render loading indicator if data is still loading
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Render the main UI
    return (
        <View style={{ padding: 20 }}>
            <Button title="Add Department" onPress={toggleAddDepartmentForm} />

            {showAddDepartmentForm && (
                <View>
                    <Text>Add Department</Text>
                    <TextInput
                        value={deptName}
                        onChangeText={(text) => setDeptName(text)}
                        placeholder="Department Name"
                    />
                    <TextInput
                        value={deptCode}
                        onChangeText={(text) => setDeptCode(text)}
                        placeholder="Department Code"
                    />
                    <TouchableOpacity onPress={handleAddDepartment}>
                        <Text>Create Department</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleAddDepartmentForm}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={departmentlists}
                keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 20 }}>
                        <Button title="Edit" onPress={() => showEditDepartmentInfoModal(item.id)} />
                        <Button title="Delete" onPress={() => handleDeleteDepartment(item.id)} />
                        <Text>{item.department_name}</Text>
                        <Text>{item.department_code}</Text>
                    </View>
                )}
            />

            <Modal visible={editDepartmentInfoModalVisible} animationType="slide">
                <View>
                    <Text>Edit Department Information</Text>
                    <TextInput
                        value={deptName}
                        onChangeText={(text) => setDeptName(text)}
                        placeholder="Department Name"
                    />
                    <TextInput
                        value={deptCode}
                        onChangeText={(text) => setDeptCode(text)}
                        placeholder="Department Code"
                    />
                    <TouchableOpacity onPress={handleEditDepartment}>
                        <Text>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={hideEditDepartmentInfoModal}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default DepartmentScreen;
