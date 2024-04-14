import React, { useState, useContext } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import baseURL from '../../assets/common/baseurl';
import Toast from "react-native-toast-message";

const Proposal2Modal = ({ visible, closeModal, proposalId }) => {
    const [ppmpFile, setPpmpFile] = useState(null);
    const [prFile, setPrFile] = useState(null);
    const [marketStudyFile, setMarketStudyFile] = useState(null);
    const [error, setError] = useState(null);
    const context = useContext(AuthGlobal);

    const showToast = message => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom',
        });
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
            if (!ppmpFile || !ppmpFile.uri || !prFile || !prFile.uri || !marketStudyFile || !marketStudyFile.uri) {
                setError('Please choose all files');
                return;
            }

            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;

            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('ppmp_file', {
                uri: ppmpFile.uri,
                name: ppmpFile.name,
                type: 'application/pdf',
            });
            formData.append('pr_file', {
                uri: prFile.uri,
                name: prFile.name,
                type: 'application/pdf',
            });
            formData.append('market_study_file', {
                uri: marketStudyFile.uri,
                name: marketStudyFile.name,
                type: 'application/pdf',
            });
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobileproposal2`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Proposal sent to DO, UES, and President.',
                    text2: 'Results coming soon. Wait for update',
                  });
                console.log(response.data.message);
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
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Submission of Documents</Text>
                    <View style={styles.separator} />
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.formContainer}>
                        <View style={styles.fileSelectionContainer}>
                            <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setPpmpFile)}>
                                <View style={styles.fileButtonContent}>
                                    <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                    <Text style={styles.chooseFileText}>Choose PPMP File</Text>
                                    <Text style={styles.memoText}>(Project Procurement Management Plan)</Text>
                                </View>
                            </TouchableOpacity>
                            {ppmpFile ? (
                                <Text style={styles.fileText}>Selected File: {ppmpFile.name}</Text>
                            ) : (
                                <Text style={styles.fileText}>No File Chosen</Text>
                            )}
                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </View>
                        <View style={styles.fileSelectionContainer}>
                            <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setPrFile)}>
                                <View style={styles.fileButtonContent}>
                                    <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                    <Text style={styles.chooseFileText}>Choose PR File</Text>
                                    <Text style={styles.memoText}>(Purchase Request)</Text>
                                </View>

                            </TouchableOpacity>
                            {prFile ? (
                                <Text style={styles.fileText}>Selected File: {prFile.name}</Text>
                            ) : (
                                <Text style={styles.fileText}>No File Chosen</Text>
                            )}
                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </View>
                        <View style={styles.fileSelectionContainer}>
                            <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setMarketStudyFile)}>
                                <View style={styles.fileButtonContent}>
                                    <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                    <Text style={styles.chooseFileText}>Choose Request</Text>
                                    <Text style={styles.memoText}>(for Qoutation/Market Study)</Text>
                                </View>

                            </TouchableOpacity>
                            {marketStudyFile ? (
                                <Text style={styles.fileText}>Selected File: {marketStudyFile.name}</Text>
                            ) : (
                                <Text style={styles.fileText}>No File Chosen</Text>
                            )}
                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.buttonContainer}>
                        <Button title="Submit Proposal" onPress={handleSubmit} color="#333" />
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