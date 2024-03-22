import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';

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

            if (response.status >= 200 && response.status < 300) {
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
                        selectedValue={mid_evaluation}
                        onValueChange={(itemValue) => setMid_evaluation(itemValue)}
                    >
                        <Picker.Item label="Choose........." value="Choose........." />
                        <Picker.Item label="Done" value="Prototype Mid-Evaluation Survey Done" />
                        <Picker.Item label="Not Done" value="Prototype Mid-Evaluation Survey Not Done" />
                    </Picker>
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
