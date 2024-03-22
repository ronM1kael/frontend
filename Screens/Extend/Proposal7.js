import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const Proposal7Modal = ({visible, closeModal, proposalId}) => {
    const [confirmation, setConfirmation] = useState('Choose.........');
    const [letter, setLetter] = useState(null);
    const [nda, setNda] = useState(null);
    const [coa, setCoa] = useState(null);
    const [error, setError] = useState(null);
    const context = useContext(AuthGlobal);

    const refresh = () => {
        setLetter(null);
        setNda(null);
        setCoa(null);
        setError(null);
    };

    const showToast = message => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const handleChooseFile = async (fileStateSetter) => {
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

                            fileStateSetter({
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

            if (!letter || !letter.uri || !nda || !nda.uri || !coa || !coa.uri) { // Check if files or file URIs exist
                setError('Please choose all files'); // Set error state if any file is not selected
                return;
            }

            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;

            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('confirmation', confirmation);
            formData.append('letter', {
                uri: letter.uri,
                name: letter.name,
                type: 'application/pdf',
            });
            formData.append('nda', {
                uri: nda.uri,
                name: nda.name,
                type: 'application/pdf',
            });
            formData.append('coa', {
                uri: coa.uri,
                name: coa.name,
                type: 'application/pdf',
            });
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobileproposal7`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.data.success) {
                console.log(response.data.message);
                showToast('Proposal submitted successfully');
                closeModal();
            } else {
                setError('Proposal submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            setError('Error submitting proposal. Please try again.');
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Extension Application</Text>
                    <Picker
                        selectedValue={confirmation}
                        onValueChange={(itemValue) => setConfirmation(itemValue)}
                    >
                        <Picker.Item label="Choose........." value="Choose........." />
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="None" value="None" />
                    </Picker>
                    {confirmation === 'Yes' && (
                        <View style={styles.formContainer}>
                        <View style={styles.fileInput}>
                        <Button title="Letter" onPress={() => handleChooseFile(setLetter)} />
                        <Text>{letter ? letter.name : 'No file chosen'}</Text>
                    </View>
                    <View style={styles.fileInput}>
                    <Button title="NDA (Non Diclosure Agreement)" onPress={() => handleChooseFile(setNda)} />
                    <Text>{nda ? nda.name : 'No file chosen'}</Text>
                </View>
                <View style={styles.fileInput}>
                    <Button title="COA (Certificate of Acceptance)" onPress={() => handleChooseFile(setCoa)} />
                    <Text>{coa ? coa.name : 'No file chosen'}</Text>
                </View>
                </View>
                    )}
                    <View style={styles.buttonContainer}>
                        <Button title="Submit Proposal" onPress={handleSubmit} />
                        <Button title="Close" onPress={() => { closeModal(); refresh(); }} />
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
        fontWeight: 'bold', // Added fontWeight for emphasis
    },
    fileInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20, // Increased marginBottom for spacing
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default Proposal7Modal;
