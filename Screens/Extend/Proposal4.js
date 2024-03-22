import React, { useState, useContext } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const ExtensionProposalModal = ({ visible, closeModal, proposalId }) => {
    const [implementation_proper, setImplementation_Proper] = useState('');
    const [proponents, setProponents] = useState([null]); // Array of proponents
    const context = useContext(AuthGlobal);
    const [error, setError] = useState(null);

    const addProponent = () => {
        setProponents([...proponents, null]); // Add a new null proponent
    };

    const removeProponent = (index) => {
        const updatedProponents = [...proponents];
        updatedProponents.splice(index, 1); // Remove the proponent at the given index
        setProponents(updatedProponents);
    };

    const submitProposal = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;

            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('implementation_proper', implementation_proper);
            formData.append('proponents1', proponents[0]); // Assuming proponents are stored in an array
            formData.append('proponents2', proponents[1]);
            formData.append('proponents3', proponents[2]);
            formData.append('proponents4', proponents[3]);
            formData.append('proponents5', proponents[4]);
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobileproposal4`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.data.success) {
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
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Submission of Proposal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Implementation Proper"
                        value={implementation_proper}
                        onChangeText={setImplementation_Proper}
                    />
                    {proponents.map((proponent, index) => (
                        <View key={index}>
                            <TextInput
                                style={styles.input}
                                placeholder={`Proponent ${index + 1}`}
                                value={proponent}
                                onChangeText={(text) => {
                                    const updatedProponents = [...proponents];
                                    updatedProponents[index] = text;
                                    setProponents(updatedProponents);
                                }}
                            />
                            <Button title="Remove Proponent" onPress={() => removeProponent(index)} />
                        </View>
                    ))}
                    <Button title="Add Proponent" onPress={addProponent} />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <Button title="Submit Proposal" onPress={submitProposal} />
                    <Button title="Close" onPress={closeModal} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default ExtensionProposalModal;
