import React, { useState, useContext } from 'react';
import { View, Text, Modal, Button, TextInput, StyleSheet, ToastAndroid, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import * as ImagePicker from "expo-image-picker";

const Proposal2Modal = ({ visible, closeModal, proposalId }) => {
    const [post_evaluation_attendance, setPost_evaluation_attendance] = useState(null);
    const [evaluation_form, setEvaluation_form] = useState(null);
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
        setPost_evaluation_attendance(null);
        setEvaluation_form(null);
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
            if (!post_evaluation_attendance || !post_evaluation_attendance.uri || !evaluation_form || !evaluation_form.uri || !capsule_detail || !capsule_detail.uri
                || !certificate || !certificate.uri || !attendance || !attendance.uri) { // Check if files or file URIs exist
                setError('Please choose all files'); // Set error state if any file is not selected
                return;
            }
    
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;
    
            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('post_evaluation_attendance', {
                uri: post_evaluation_attendance.uri,
                name: post_evaluation_attendance.name,
                type: 'application/pdf',
            });
            formData.append('evaluation_form', {
                uri: evaluation_form.uri,
                name: evaluation_form.name,
                type: 'application/pdf',
            });
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
    
            const response = await axios.post(`${baseURL}mobileproposal6`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
    
            if (response.data.extension_status === 'Process Done') {
                console.log(response.data.documentation_photos);
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
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Extension Application</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.fileInput}>
                            <Button title="Attendance for Post-Evaluation Survey" onPress={() => handleChooseFile(setPost_evaluation_attendance)} />
                            <Text>{post_evaluation_attendance ? post_evaluation_attendance.name : 'No file chosen'}</Text>
                        </View>
                        <View style={styles.fileInput}>
                            <Button title="Evaluation Form" onPress={() => handleChooseFile(setEvaluation_form)} />
                            <Text>{evaluation_form ? evaluation_form.name : 'No file chosen'}</Text>
                        </View>
                        <View style={styles.fileInput}>
                            <Button title="Capsule Detail/Narrative" onPress={() => handleChooseFile(setCapsule_detail)} />
                            <Text>{capsule_detail ? capsule_detail.name : 'No file chosen'}</Text>
                        </View>
                        <View style={styles.fileInput}>
                            <Button title="Certificate" onPress={() => handleChooseFile(setCertificate)} />
                            <Text>{certificate ? certificate.name : 'No file chosen'}</Text>
                        </View>
                        <View style={styles.fileInput}>
                            <Button title="Attendance" onPress={() => handleChooseFile(setAttendance)} />
                            <Text>{attendance ? attendance.name : 'No file chosen'}</Text>
                        </View>
                    </View>

                    <View style={styles.containers}>
                        <FlatList
                            key={listKey} // Use key to trigger re-render
                            data={selectedImages}
                            renderItem={renderImageItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            <Text style={{ color: 'white' }}>Add Image</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button title="Close" onPress={() => { closeModal(); refresh(); }} />
                        <Button title="Submit Proposal" onPress={handleSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    containers: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagePicker: {
        width: 100,
        height: 100,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
    },
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
    formContainer: {
        width: '100%', // Full width
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

export default Proposal2Modal;
