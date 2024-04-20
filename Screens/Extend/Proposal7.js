import React, { useState, useContext } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import baseURL from '../../assets/common/baseurl';
import Toast from "react-native-toast-message";

const ExtensionProposalModal = ({ visible, closeModal, proposalId }) => {
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
            if (!letter || !letter.uri || !nda || !nda.uri || !coa || !coa.uri) {
                setError('Please choose all files');
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
                if (confirmation === 'None') {
                    Toast.show({
                        type: 'success',
                        text1: 'Process Done',
                    });
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Your Proposal has been sent;',
                        text2: 'kindly wait to be approved.',
                    });
                }
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
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Extension Application</Text>
                    <View style={styles.separator} />
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.questionText}>Do you have a prototype?</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={confirmation}
                                        onValueChange={(itemValue) => setConfirmation(itemValue)}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Choose........." value="Choose........." />
                                        <Picker.Item label="Yes" value="Yes" />
                                        <Picker.Item label="None" value="None" />
                                    </Picker>
                                </View>
                            </View>
                            {confirmation === 'Yes' && (
                                <View style={styles.formContainer}>
                                    <View style={styles.fileSelectionContainer}>
                                        <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setLetter)}>
                                            <View style={styles.fileButtonContent}>
                                                <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                                <Text style={styles.chooseFileText}>Upload Letter</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {letter ? (
                                            <Text style={styles.fileText}>Selected File: {letter.name}</Text>
                                        ) : (
                                            <Text style={styles.fileText}>No File Chosen</Text>
                                        )}
                                        {error && <Text style={styles.errorText}>{error}</Text>}
                                    </View>
                                    <View style={styles.fileSelectionContainer}>
                                        <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setNda)}>
                                            <View style={styles.fileButtonContent}>
                                                <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                                <Text style={styles.chooseFileText}>Choose NDA</Text>
                                                <Text style={styles.memoText}>(Non Diclosure Agreement)</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {nda ? (
                                            <Text style={styles.fileText}>Selected File: {nda.name}</Text>
                                        ) : (
                                            <Text style={styles.fileText}>No File Chosen</Text>
                                        )}
                                        {error && <Text style={styles.errorText}>{error}</Text>}
                                    </View>
                                    <View style={styles.fileSelectionContainer}>
                                        <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setCoa)}>
                                            <View style={styles.fileButtonContent}>
                                                <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                                <Text style={styles.chooseFileText}>Choose COA</Text>
                                                <Text style={styles.memoText}>(Certificate of Acceptance)</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {coa ? (
                                            <Text style={styles.fileText}>Selected File: {coa.name}</Text>
                                        ) : (
                                            <Text style={styles.fileText}>No File Chosen</Text>
                                        )}
                                        {error && <Text style={styles.errorText}>{error}</Text>}
                                    </View>
                                </View>
                            )}
                            <View style={styles.separator} />
                            <View style={styles.buttonContainer}>
                                <Button title="Submit Proposal" onPress={handleSubmit} color="#000" />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 20,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        height: 2,
        backgroundColor: 'maroon',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerContainer: {
        flex: 1,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#000',
    },
    dateContainer: {
        flex: 1,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    dateText: {
        color: '#000',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    chooseFileButton: {
        backgroundColor: '#000',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    chooseFileText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fileSelectionContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    fileText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    fileButtonContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    memoText: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    questionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
});

export default ExtensionProposalModal;
