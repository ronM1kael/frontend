import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, StatusBar, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";

const MOBILEfacultyApplicationStatus = () => {
    const context = useContext(AuthGlobal);
    const [extensionData, setExtensionData] = useState([]);
    const [selectedExtension, setSelectedExtension] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const fetchExtensionData = useCallback(async () => {
        try {
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;

            if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
                console.error('Invalid authentication state');
                return;
            }

            const response = await axios.get(`${baseURL}MOBILEfacultyApplicationStatus/${userProfile.id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            const data = response.data;
            setExtensionData(data.extension);
        } catch (error) {
            console.error('Error fetching extension data:', error);
        }
    }, [context.stateUser.userProfile]);

    useFocusEffect(
        useCallback(() => {
            fetchExtensionData();
        }, [fetchExtensionData])
    );

    const openExtensionDetails = (extension) => {
        setSelectedExtension(extension);
    };

    const closeModal = () => {
        setSelectedExtension(null);
    };

    const fetchAppointmentDetails = async (appointmentId) => {
        try {
            const response = await axios.get(`${baseURL}MOBILEgetAppointment/${appointmentId}`);
            const appointment = response.data;
            return appointment;
        } catch (error) {
            console.error('Error fetching appointment data:', error);
            return null;
        }
    };

    const handleAppointmentPress = async (appointmentId) => {
        const appointment = await fetchAppointmentDetails(appointmentId);
        if (appointment) {
            setAppointments((prevAppointments) => [...prevAppointments, appointment]);
        }
    };

    const renderAppointmentButtons = (extensions) => {
        return (
            <View style={styles.appointmentContainer}>
                <Text style={styles.appointmentTitle}>Appointments</Text>
                <View style={styles.appointmentButtons}>
                    <TouchableOpacity
                        style={styles.appointmentButton}
                        onPress={() => handleAppointmentPress(extensions.appointment1_id)}
                    >
                        <Text>Proposal Consultation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.appointmentButton}
                        onPress={() => handleAppointmentPress(extensions.appointment2_id)}
                    >
                        <Text>Implementation Proper</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.appointmentButton}
                        onPress={() => handleAppointmentPress(extensions.appointment3_id)}
                    >
                        <Text>Pre-Evaluation Survey</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.appointmentButton}
                        onPress={() => handleAppointmentPress(extensions.appointment4_id)}
                    >
                        <Text>Mid-Evaluation Survey</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#333" barStyle="light-content" />
            <View style={styles.pageTitle}>
                <Text style={styles.pageTitleText}>Extension Application Status</Text>
                <Text style={styles.pageSubtitle}>List of your Extension Applications:</Text>
            </View>

            <FlatList
                data={extensionData}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.extensionItem} onPress={() => openExtensionDetails(item)}>
                        <Text style={styles.extensionTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchExtensionData} />}
            />

            <Modal
                visible={selectedExtension !== null}
                animationType="slide"
                onRequestClose={closeModal}
                transparent={true}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedExtension?.title}</Text>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusValue}>({selectedExtension?.status})</Text>
                        </View>
                        <View style={styles.separator} />
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.progressBarContainer}>
                            <View
                                style={[styles.progressBar, { width: `${selectedExtension?.percentage_status}%` }]}
                            >
                                <Text style={styles.progressText}>{selectedExtension?.percentage_status}%</Text>
                            </View>
                        </View>
                        {renderAppointmentButtons(selectedExtension)}
                    </View>
                </View>
            </Modal>

            {/* Modal for displaying appointment details */}
            <Modal
                visible={appointments.length > 0}
                animationType="slide"
                onRequestClose={() => setAppointments([])}
                transparent={true}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {appointments.map((appointment, index) => (
                            <View key={index}>
                                <Text style={styles.modalTitle}>{appointment.title}</Text>
                                <Text>{appointment.purpose}</Text>
                                <Text>{appointment.status}</Text>
                                <Text>{appointment.time}</Text>
                                <Text>{appointment.date}</Text>
                            </View>
                        ))}
                        <TouchableOpacity onPress={() => setAppointments([])} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    pageTitle: {
        marginBottom: 20,
        alignItems: 'center',
    },
    pageTitleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    extensionItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
        paddingVertical: 10,
    },
    extensionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
        textAlign: 'center',
    },
    progressBarContainer: {
        height: 40,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'green',
        justifyContent: 'center',
    },
    progressText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    separator: {
        height: 2,
        backgroundColor: '#cccccc',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    pageSubtitle: {
        fontSize: 16,
        color: '#999999',
        marginTop: 5,
    },statusContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statusValue: {
        fontSize: 15,
        color: '#333333',
    },
});

export default MOBILEfacultyApplicationStatus;