import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

const Proposal7Modal = ({visible, closeModal, proposalId}) => {
    const [mid_evaluation , setMid_evaluation ] = useState('Choose.........');
    const [error, setError] = useState(null);
    const context = useContext(AuthGlobal);

    const showToast = message => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const refresh = () => {
        setMid_evaluation('Choose.........');
        setError(null);
    };

    const handleSubmit = async () => {
        try {

            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;

            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('mid_evaluation', mid_evaluation);
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobileproposal9`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.data.success) {
                if (mid_evaluation === 'Prototype Mid-Evaluation Survey Done') {
                    Toast.show({
                        type: 'success',
                        text1: 'Prototype Mid-Evaluation Survey Done',
                    });
                } else {
                    // Handle other cases here if needed
                }
                closeModal();
            } else {
                if (mid_evaluation === 'Prototype Mid-Evaluation Survey Not Done') {
                    Toast.show({
                        type: 'success',
                        text1: 'Prototype Mid-Evaluation Survey Not Done',
                    });
                } else {
                    // Handle other cases here if needed
                }
                setError('Proposal submission failed. Please try again.');
                closeModal();
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
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Extension Application</Text>
                    <View style={styles.separator} />
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.questionText}>Mid-Evaluation Survey</Text>
                            <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={mid_evaluation}
                        onValueChange={(itemValue) => setMid_evaluation(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Choose........." value="Choose........." />
                        <Picker.Item label="Done" value="Prototype Mid-Evaluation Survey Done" />
                        <Picker.Item label="Not Done" value="Prototype Mid-Evaluation Survey Not Done" />
                    </Picker>
                    </View>
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
    questionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
});

export default Proposal7Modal;
