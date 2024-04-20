import React, { useState, useContext } from 'react';
import { View, Text, Modal, Button, TextInput, StyleSheet, ToastAndroid, FlatList, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import baseURL from '../../assets/common/baseurl';
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

const Proposal2Modal = ({ visible, closeModal, proposalId }) => {

    const [capsule_detail, setCapsule_detail] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState(null); // State for error handling
    const [listKey, setListKey] = useState(0); // Key for re-rendering FlatList
    const context = useContext(AuthGlobal);

    const showToast = message => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const refresh = () => {
        setCapsule_detail(null);
        setCertificate(null);
        setAttendance(null);
        setMainImage(null);
        setSelectedImages([]);
        setError(null);
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

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                multiple: true,
            });

            if (!result.cancelled && result.assets.length > 0) {
                const selectedUris = result.assets.map((asset) => asset.uri);
                setSelectedImages((prevImages) => [...prevImages, ...selectedUris]);
                setListKey((prevKey) => prevKey + 1); // Update key to trigger re-render
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Error', 'Failed to pick images. Please try again.');
        }
    };

    const handleSubmit = async () => {
        try {
            if (!capsule_detail || !capsule_detail.uri || !certificate || !certificate.uri || !attendance || !attendance.uri) { // Check if files or file URIs exist
                setError('Please choose all files'); // Set error state if any file is not selected
                return;
            }
    
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;
    
            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('capsule_detail', {
                uri: capsule_detail.uri,
                name: capsule_detail.name,
                type: 'application/pdf',
            });
            formData.append('certificate', {
                uri: certificate.uri,
                name: certificate.name,
                type: 'application/pdf',
            });
            formData.append('attendance', {
                uri: attendance.uri,
                name: attendance.name,
                type: 'application/pdf',
            });
            // Append selected images to formData
            selectedImages.forEach((imageUri, index) => {
                formData.append('img_path[]', {
                    uri: imageUri,
                    name: `image_${index}.jpg`,
                    type: 'image/jpeg',
                });
            });
    
            formData.append("user_id", userId);
    
            const response = await axios.post(`${baseURL}mobileproposal11`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
    
            if (response.data.success) {
                console.log('Proposal submitted successfully'); // Log success message
                Toast.show({
                    type: 'success',
                    text1: 'Documents and Photos added.',
                });
                closeModal(); // Close modal upon successful submission
            } else {
                console.error('Backend returned an error:', response.data.message); // Log backend error
                setError('Proposal submission failed. Please try again.'); // Set error state
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            setError('Error submitting proposal. Please try again.');
        }
    };
    

    const renderImageItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => console.log(item)}
            onLongPress={() => handleImageLongPress(index)} // Handle long press event
            style={styles.imagePicker}
        >
            <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
        </TouchableOpacity>
    );

    const handleImageLongPress = (index) => {
        // Display a modal to confirm the deletion of the selected image
        Alert.alert(
            'Delete Image',
            'Are you sure you want to delete this image?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        // Remove the selected image from selectedImages state
                        setSelectedImages((prevImages) => {
                            const updatedImages = [...prevImages];
                            updatedImages.splice(index, 1); // Remove the image at the specified index
                            return updatedImages;
                        });
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Extension Application</Text>
                        <View style={styles.separator} />
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.formContainer}>

                        <View style={styles.fileSelectionContainer}>
                                <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setCapsule_detail)}>
                                    <View style={styles.fileButtonContent}>
                                        <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                        <Text style={styles.chooseFileText}>Choose File</Text>
                                        <Text style={styles.memoText}>(Capsule Detail/Narrative)</Text>
                                    </View>
                                </TouchableOpacity>
                                {capsule_detail ? (
                                    <Text style={styles.fileText}>Selected File: {capsule_detail.name}</Text>
                                ) : (
                                    <Text style={styles.fileText}>No File Chosen</Text>
                                )}
                                {error && <Text style={styles.errorText}>{error}</Text>}
                            </View>

                            <View style={styles.fileSelectionContainer}>
                                <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setCertificate)}>
                                    <View style={styles.fileButtonContent}>
                                        <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                        <Text style={styles.chooseFileText}>Choose Certificate</Text>
                                    </View>
                                </TouchableOpacity>
                                {certificate ? (
                                    <Text style={styles.fileText}>Selected File: {certificate.name}</Text>
                                ) : (
                                    <Text style={styles.fileText}>No File Chosen</Text>
                                )}
                                {error && <Text style={styles.errorText}>{error}</Text>}
                            </View>

                            <View style={styles.fileSelectionContainer}>
                                <TouchableOpacity style={styles.chooseFileButton} onPress={() => handleChooseFile(setAttendance)}>
                                    <View style={styles.fileButtonContent}>
                                        <Icon name="file" size={20} color="#fff" style={styles.icon} />
                                        <Text style={styles.chooseFileText}>Choose Attendance</Text>
                                    </View>
                                </TouchableOpacity>
                                {attendance ? (
                                    <Text style={styles.fileText}>Selected File: {attendance.name}</Text>
                                ) : (
                                    <Text style={styles.fileText}>No File Chosen</Text>
                                )}
                                {error && <Text style={styles.errorText}>{error}</Text>}
                            </View>
                        
                            <Text style={styles.imageTitle}>Prototype Documentation Photos</Text>  

                            <View style={styles.containers}>
                                <FlatList
                                    key={listKey} // Use key to trigger re-render
                                    data={selectedImages}
                                    renderItem={renderImageItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                                <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, { marginTop: 10 }]}>
                                    <Text style={{ color: 'white' }}>Add Image</Text>
                                </TouchableOpacity>
                            </View>  

                            <View style={styles.separator} />
                            <View style={styles.buttonContainer}>
                                <Button title="Submit Proposal" onPress={handleSubmit} color="#000" />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    imageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    containers: {
        marginBottom: 10,
    },
    imagePicker: {
        backgroundColor: '#000',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
});

export default Proposal2Modal;
