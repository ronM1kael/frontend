import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, StatusBar, FlatList, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import PDFView from 'react-native-view-pdf';
import baseURL2 from '../../assets/common/baseurlnew';

const MOBILEfacultyApplicationStatus = () => {
    const context = useContext(AuthGlobal);
    const [extensionData, setExtensionData] = useState([]);
    const [selectedExtension, setSelectedExtension] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsNULL, setAppointmentsNULL] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [fileDetails, setFileDetails] = useState(null);

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

    const handleAppointmentPressNull = async (appointmentId) => {
        const appointment = await fetchAppointmentDetails(appointmentId);
        if (appointment) {
            setAppointmentsNULL((prevAppointments) => [...prevAppointments, appointment]);
        }
    };

    const fetchExtensionFiles = async (extensionId) => {
        try {
            const response = await axios.get(`${baseURL}MOBILEgetFileExtension/${extensionId}`);
            const data = response.data;
            setFileDetails(data);
            setModalVisible(true); // Show the modal after fetching data
        } catch (error) {
            console.error('Error fetching extension files:', error);
        }
    };

    const renderFileDetails = () => {
        if (!fileDetails) return null; // If no file details, return null
    
        return (
            <ScrollView contentContainerStyle={styles.modalContent}>
                
                <View style={styles.fileDetailContainer}>
                    <Text style={styles.fileDetailTitle}>Beneficiary:</Text>
                    <Text style={styles.fileDetailValue}>{fileDetails.beneficiary || 'No Data'}</Text>
                </View>
                <View style={styles.fileDetailContainer}>
                    <Text style={styles.fileDetailTitle}>MOU (Memorandum of Understanding):</Text>
                    {fileDetails.mou_file ? (
                        <TouchableOpacity onPress={() => openPDF(fileDetails.mou_file)}>
                            <Text style={styles.linkText}>View PDF - {fileDetails.beneficiary}</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.fileDetailValue}>No Data</Text>
                    )}
                </View>
                
            </ScrollView>
        );
    };

    const openPDF = (fileUri) => {
        setModalVisible(false);
        const pdfUri = `${baseURL2}uploads/extension/${fileUri}`;
        Linking.openURL(pdfUri);
    };

    const renderAppointmentButtons = (extensions) => {
        return (
            <View style={[styles.appointmentContainer, styles.centered]}>
                <Icon name="calendar" size={20} color="grey" style={styles.calendarIcon} />
                <Text style={styles.appointmentTitle}>Appointments</Text>
                <View style={styles.appointmentButtons}>
                    <TouchableOpacity
                        style={[styles.appointmentButton, styles.appointmentButtonWide]}
                        onPress={() =>
                            extensions && extensions.appointment1_id === null
                                ? handleAppointmentPressNull(extensions.appointment1_id)
                                : handleAppointmentPress(extensions.appointment1_id)
                        }
                    >
                        <Text style={styles.appointmentButtonText}>Proposal Consultation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.appointmentButton, styles.appointmentButtonWide]}
                        onPress={() =>
                            extensions && extensions.appointment2_id === null
                                ? handleAppointmentPressNull(extensions.appointment2_id)
                                : handleAppointmentPress(extensions.appointment2_id)
                        }
                    >
                        <Text style={styles.appointmentButtonText}>Implementation Proper</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.appointmentButton, styles.appointmentButtonWide]}
                        onPress={() =>
                            extensions && extensions.appointment3_id === null
                                ? handleAppointmentPressNull(extensions.appointment3_id)
                                : handleAppointmentPress(extensions.appointment3_id)
                        }
                    >
                        <Text style={styles.appointmentButtonText}>Pre-Evaluation Survey</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.appointmentButton, styles.appointmentButtonWide]}
                        onPress={() =>
                            extensions && extensions.appointment4_id === null
                                ? handleAppointmentPressNull(extensions.appointment4_id)
                                : handleAppointmentPress(extensions.appointment4_id)
                        }
                    >
                        <Text style={styles.appointmentButtonText}>Mid-Evaluation Survey</Text>
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
                        <Text style={styles.extensionTitle}><Icon name="dot-circle-o" size={20} color="#666" style={styles.dotIcon} />{' '}{' '}{' '}{item.title}</Text>
                        <Icon name="chevron-right" size={20} color="#666" style={styles.chevronIcon} />
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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                            <View style={[styles.appointmentContainer, styles.centered]}>
                                <Icon name="file-pdf-o" size={20} color="grey" style={styles.calendarIcon} />
                                <Text style={styles.appointmentTitle}>Files/Details</Text>
                                <View style={styles.appointmentButtons}>
                                    <TouchableOpacity
                                        style={[styles.appointmentButton, styles.appointmentButtonWide]}
                                        onPress={() => fetchExtensionFiles(selectedExtension.id)} // Pass the selected extension ID
                                    >
                                        <Text style={styles.appointmentButtonText}>Extension Files</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
                            <View key={index} style={styles.appointmentDetail}>
                                <Text style={styles.appointmentDetailText}>Purpose: {appointment.purpose}</Text>
                                <Text style={styles.appointmentDetailText}>Status: {appointment.status}</Text>
                                <Text style={styles.appointmentDetailText}>Time: {appointment.time}</Text>
                                <Text style={styles.appointmentDetailText}>Date: {appointment.date}</Text>
                            </View>
                        ))}
                        <TouchableOpacity onPress={() => setAppointments([])} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={appointmentsNULL.length > 0}
                animationType="slide"
                onRequestClose={() => setAppointmentsNULL([])}
                transparent={true}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {appointmentsNULL.map((appointment, index) => (
                            <View key={index} style={styles.appointmentDetail}>
                                <Text style={styles.appointmentDetailText}>No appointment has been made yet.</Text>
                            </View>
                        ))}
                        <TouchableOpacity onPress={() => setAppointmentsNULL([])} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
                transparent={true}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Extension Files & Other Details</Text>
                        {renderFileDetails()}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    pageTitle: {
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    pageSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    extensionItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    extensionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    chevronIcon: {
        marginLeft: 10,
    },
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
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    progressBarContainer: {
        height: 40,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'green',
        justifyContent: 'center',
    },
    progressText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    separator: {
        height: 2,
        backgroundColor: '#ccc',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statusValue: {
        fontSize: 15,
        color: '#333',
    },
    appointmentContainer: {
        marginBottom: 20,
    },
    appointmentTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    appointmentButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    appointmentButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        minWidth: '45%',
    },
    appointmentButtonText: {
        color: '#333',
        fontSize: 10,
    },
    appointmentDetail: {
        marginBottom: 10,
    },
    appointmentDetailText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    centered: {
        alignItems: 'center',
    },
    appointmentButtonWide: {
        width: '45%', // Adjust this value as needed
    },
    calendarIcon: {
        marginBottom: 5,
    },
    dotIcon: {
        marginRight: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    modalContent: {
        padding: 20,
    },
    fileDetailContainer: {
        marginBottom: 15,
    },
    fileDetailTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    fileDetailValue: {
        fontSize: 16,
        color: '#666',
    },
});

export default MOBILEfacultyApplicationStatus;
