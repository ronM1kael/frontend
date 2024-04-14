import React, { useState, useContext } from 'react';
import { View, Text, Modal, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import baseURL from '../../assets/common/baseurl';
import Toast from "react-native-toast-message";

const Proposal2Modal = ({ visible, closeModal, proposalId }) => {
    const [moa, setMOA] = useState(null);
    const [error, setError] = useState(null); // State for error handling
    const context = useContext(AuthGlobal);

    const handleChooseFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            if (result.canceled) {
                console.log('Document picking canceled');
                return;
            } else if (result.assets && result.assets.length > 0) {
                const pickedAsset = result.assets[0];

                if (pickedAsset.uri) {
                    const fileInfo = await FileSystem.getInfoAsync(pickedAsset.uri);

                    if (fileInfo) {
                        const newUri = FileSystem.documentDirectory + fileInfo.name;

                        try {
                            await FileSystem.copyAsync({
                                from: pickedAsset.uri,
                                to: newUri,
                            });

                            setMOA({
                                name: pickedAsset.name,
                                uri: newUri,
                            });

                            setError(null); // Clear any previous errors

                            console.log('Document picked:', result);
                            return; // Exit the function after successful file picking
                        } catch (copyError) {
                            console.error('Error copying file:', copyError);
                            setError('Error copying file. Please try again.'); // Set error state
                        }
                    } else {
                        console.log('Error getting file info for the picked document');
                        setError('Error getting file info. Please try again.'); // Set error state
                    }
                } else {
                    console.log('Invalid URI for the picked document');
                    setError('Invalid URI for the picked document. Please try again.'); // Set error state
                }
            } else {
                console.log('Document picking failed with unexpected result:', result);
                setError('Document picking failed. Please try again.'); // Set error state
            }
        } catch (err) {
            console.error('Error picking document', err);
            setError('Error picking document. Please try again.'); // Set error state
        }
    };

    const handleSubmit = async () => {
        try {
            if (!moa || !moa.uri) { // Check if files or file URIs exist
                setError('Please choose a MOA file'); // Set error state if any file is not selected
                return;
            }

            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;

            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('moa_file', {
                uri: moa.uri,
                name: moa.name,
                type: 'application/pdf',
            });
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobileproposal3`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.data.success) {
                console.log(response.data.message);
                Toast.show({
                    type: 'success',
                    text1: 'Proposal sent for review by Board and OSG.',
                    text2: 'Wait for updates on your results.',
                  });
                closeModal();
            } else {
                setError('MOA submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting MOA:', error);
            setError('Error submitting MOA. Please try again.');
        }
    };

    const refresh = () => {
        setMOA(null);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Extension Application</Text>
                    <View style={styles.separator} />
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.formContainer}>
                        <View style={styles.fileSelectionContainer}>
                            <TouchableOpacity style={styles.chooseFileButton} onPress={handleChooseFile}>
                                <View style={styles.fileButtonContent}>
                                    <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                    <Text style={styles.chooseFileText}>Choose MOA File</Text>
                                    <Text style={styles.memoText}>(Memorandum Of Agreement)</Text>
                                </View>
                            </TouchableOpacity>
                            {moa ? (
                                <Text style={styles.fileText}>Selected File: {moa.name}</Text>
                            ) : (
                                <Text style={styles.fileText}>No File Chosen</Text>
                            )}
                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.buttonContainer}>
                            <Button title="Submit Proposal" onPress={handleSubmit} color="#000" />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff', // white background for the modal
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 20,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center', // Center align the text
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    formContainer: {
        width: '100%', // Full width
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    chooseFileButton: {
        backgroundColor: '#000',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center', // Center align items horizontally
        justifyContent: 'center', // Center align items vertically
        marginBottom: 10,
    },
    chooseFileText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Center align the button
        marginTop: 20,
    },
    separator: {
        height: 2,
        backgroundColor: 'maroon', // Maroon color for the separator
        marginBottom: 20, // Adjust spacing as needed
    },
    fileSelectionContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    fileText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        textAlign: 'center', // Center align the text
    },
    fileButtonContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Align content in the center
    },
    memoText: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center', // Center align the text
    },
});

export default Proposal2Modal;
