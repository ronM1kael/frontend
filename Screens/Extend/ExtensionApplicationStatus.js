import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, StatusBar, FlatList, RefreshControl, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import baseURL2 from '../../assets/common/baseurlnew';
import { WebView } from 'react-native-webview';
import Carousel from 'react-native-snap-carousel';

const NoPhotosImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

const MOBILEfacultyApplicationStatus = () => {
    const context = useContext(AuthGlobal);
    const [extensionData, setExtensionData] = useState([]);
    const [selectedExtension, setSelectedExtension] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsNULL, setAppointmentsNULL] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [fileDetails, setFileDetails] = useState(null);
    const [modalVisiblePDF, setModalVisiblePDF] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [modalVisiblePhotos, setModalVisiblePhotos] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [prototypeDetails, setPrototypeDetails] = useState(null);
    const [prototypemodalVisible, setPrototypeModalVisible] = useState(false);

    const [prototypephotos, setprototypephotos] = useState([]);
    const [modalVisibleprototypePhotos, setModalVisibleprototypePhotos] = useState(false);

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

    const fetchDocumentationPhotos = async (extensionId) => {
        try {
            const response = await axios.get(`${baseURL}MOBILEgetDoumentationPhotos/${extensionId}`);
            setPhotos(response.data);
            setLoading(false);
            setModalVisiblePhotos(true); // Show the modal after fetching data
        } catch (error) {
            console.error('Error fetching documentation photos:', error);
            setLoading(false);
        }
    };

    const fetchPrototypeFiles = async (profileId) => {
        try {
            const response = await axios.get(`${baseURL}MOBILEgetFilePrototype/${profileId}`);
            const data = response.data;
            setPrototypeDetails(data);
            setPrototypeModalVisible(true); // Show the modal after fetching data
        } catch (error) {
            console.error('Error fetching extension files:', error);
        }
    };

    const renderPhotoItem = ({ item, index }) => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: `${baseURL2}/images/documentation/${item.img_path}` }} style={{ width: 200, height: 200 }} />
            </View>
        );
    };

    const renderPhotoPrototypeItem = ({ item, index }) => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: `${baseURL2}/images/prototypeDocumentation/${item.img_path}` }} style={{ width: 200, height: 200 }} />
            </View>
        );
    };

    const MOBILEgetProtoypePhotos = async (propoid) => {
        try {
            const response = await axios.get(`${baseURL}MOBILEgetProtoypePhotos/${propoid}`);
            setprototypephotos(response.data);
            setLoading(false);
            setModalVisibleprototypePhotos(true); // Show the modal after fetching data
        } catch (error) {
            console.error('Error fetching documentation photos:', error);
            setLoading(false);
        }
    };

    const renderFileDetails = () => {
        if (!fileDetails) return null; // If no file details, return null

        return (
            <View style={{ maxHeight: 500 }}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Beneficiary:</Text>
                        <Text style={styles.fileDetailValue}>{fileDetails.beneficiary || 'No Data'}</Text>
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>MOU (Memorandum of Understanding):</Text>
                        {fileDetails.mou_file ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.mou_file)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.mou_file}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>PPMP(Project Procurement Management Plan):</Text>
                        {fileDetails.ppmp_file ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.ppmp_file)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.ppmp_file}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>PR(Purchase Request):</Text>
                        {fileDetails.pr_file ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.pr_file)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.pr_file}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Market Study:</Text>
                        {fileDetails.market_study_file ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.market_study_file)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.market_study_file}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>MOA(Memorandum of Agreement):</Text>
                        {fileDetails.moa_file ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.moa_file)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.market_study_file}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Topics:</Text>
                        <Text style={styles.fileDetailValue}>{fileDetails.topics || 'No Data'}</Text>
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Sub-Topics:</Text>
                        <Text style={styles.fileDetailValue}>{fileDetails.subtopics || 'No Data'}</Text>
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Attendance for Post Evaluation Survey:</Text>
                        {fileDetails.post_evaluation_attendance ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.post_evaluation_attendance)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.post_evaluation_attendance}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Evaluation Form:</Text>
                        {fileDetails.evaluation_form ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.evaluation_form)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.evaluation_form}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Capsule Detail:</Text>
                        {fileDetails.capsule_detail ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.capsule_detail)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.capsule_detail}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Certificate:</Text>
                        {fileDetails.certificate ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.certificate)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.certificate}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Attendance:</Text>
                        {fileDetails.attendance ? (
                            <TouchableOpacity onPress={() => openPDF(fileDetails.attendance)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{fileDetails.attendance}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    };

    const renderPrototypeDetails = () => {
        if (!prototypeDetails) return null; // If no file details, return null

        return (
            <View style={{ maxHeight: 500 }}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>NDA(Non Disclosure Agreement):</Text>
                        {prototypeDetails.nda ? (
                            <TouchableOpacity onPress={() => openPDFprototype(prototypeDetails.nda)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{prototypeDetails.nda}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>COA(Certificate of Acceptance):</Text>
                        {prototypeDetails.coa ? (
                            <TouchableOpacity onPress={() => openPDFprototype(prototypeDetails.coa)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{prototypeDetails.coa}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Pre-Evaluation Survey:</Text>
                        <Text style={styles.fileDetailValue}>{prototypeDetails.pre_evaluation_survey || 'No Data'}</Text>
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Mid-Evaluation Survey:</Text>
                        <Text style={styles.fileDetailValue}>{prototypeDetails.mid_evaluation_survey || 'No Data'}</Text>
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Post-Evaluation Survey:</Text>
                        <Text style={styles.fileDetailValue}>{prototypeDetails.post_evaluation_survey || 'No Data'}</Text>
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Capsule Detail/Narative:</Text>
                        {prototypeDetails.capsule_detail ? (
                            <TouchableOpacity onPress={() => openPDFprototype(prototypeDetails.capsule_detail)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{prototypeDetails.capsule_detail}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Certificate:</Text>
                        {prototypeDetails.certificate ? (
                            <TouchableOpacity onPress={() => openPDFprototype(prototypeDetails.certificate)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{prototypeDetails.certificate}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                    <View style={styles.fileDetailContainer}>
                        <Text style={styles.fileDetailTitle}>Attendance:</Text>
                        {prototypeDetails.attendance ? (
                            <TouchableOpacity onPress={() => openPDFprototype(prototypeDetails.attendance)}>
                                <View style={styles.fileContainer}>
                                    <Text style={styles.fileDetailValue}>{prototypeDetails.attendance}</Text>
                                    <Text style={styles.downloadText}>Click to download</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.fileDetailValue}>No Data</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    };

    const openPDF = (fileUri) => {
        setModalVisiblePDF(true);
        const pdfUri = `${baseURL2}/uploads/extension/${fileUri}`;
        setSelectedPDF(pdfUri);
    };

    const openPDFprototype = (fileUri) => {
        setModalVisiblePDF(true);
        const pdfUri = `${baseURL2}/uploads/prototype/${fileUri}`;
        setSelectedPDF(pdfUri);
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
                                    <TouchableOpacity
                                        style={[styles.appointmentButton, styles.appointmentButtonWide, { marginLeft: 10 }]} // Added curly braces around marginLeft
                                        onPress={() => fetchPrototypeFiles(selectedExtension.prototype_id)} // Pass the selected extension ID
                                    >
                                        <Text style={styles.appointmentButtonText}>Prototype Files</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.appointmentContainer, styles.centered]}>
                                <Icon name="file-photo-o" size={20} color="grey" style={styles.calendarIcon} />
                                <Text style={styles.appointmentTitle}>Documentation Photos</Text>
                                <View style={styles.appointmentButtons}>
                                    <TouchableOpacity
                                        style={[styles.appointmentButton, styles.appointmentButtonWide]}
                                        onPress={() => fetchDocumentationPhotos(selectedExtension.id)} // Pass the selected extension ID
                                    >
                                        <Text style={styles.appointmentButtonText}>Extension Photos</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.appointmentButton, styles.appointmentButtonWide, { marginLeft: 10 }]}
                                        onPress={() => MOBILEgetProtoypePhotos(selectedExtension.prototype_id)} // Pass the selected extension ID
                                    >
                                        <Text style={styles.appointmentButtonText}>Prototype Photos</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

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

            <Modal
                visible={prototypemodalVisible}
                animationType="slide"
                onRequestClose={() => setPrototypeModalVisible(false)}
                transparent={true}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Prototype Files & Other Details</Text>
                        {renderPrototypeDetails()}
                        <TouchableOpacity onPress={() => setPrototypeModalVisible(false)} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisiblePDF}
                transparent={true}
                animationType="fade"
                onRequestClose={setModalVisiblePDF}
            >
                <View style={styles.centeredViews}>
                    <View style={[styles.modalViews, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => setModalVisiblePDF(false)} style={styles.closeButtonss}>
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        {selectedPDF && (
                            <WebView
                                source={{ uri: selectedPDF }}
                                style={{ flex: 1 }} // Adjust the WebView style as needed
                            />
                        )}
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="check-circle" size={100} color="green" />
                            <Text style={[styles.successTexts, { marginLeft: 10 }]}>The file has been successfully downloaded.</Text>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={modalVisiblePhotos} animationType="slide" onRequestClose={() => setModalVisiblePhotos(false)} transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainers}>
                        <Text style={styles.modalTitle}>Documentation Photos</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                        ) : photos.length === 0 ? (
                            <View style={styles.noPhotosContainer}>
                                <Image source={{ uri: NoPhotosImage }} style={styles.noPhotosImage} />
                            </View>
                        ) : (
                            <View style={styles.noPhotosContainer}>
                                <Carousel
                                    data={photos}
                                    renderItem={renderPhotoItem}
                                    sliderWidth={300}
                                    itemWidth={200}
                                    layout={'default'}
                                    loop={true}
                                />
                            </View>
                        )}
                        <TouchableOpacity onPress={() => setModalVisiblePhotos(false)} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={modalVisibleprototypePhotos} animationType="slide" onRequestClose={() => setModalVisibleprototypePhotos(false)} transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainers}>
                        <Text style={styles.modalTitle}>Prototype Documentation Photos</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                        ) : prototypephotos.length === 0 ? (
                            <View style={styles.noPhotosContainer}>
                                <Image source={{ uri: NoPhotosImage }} style={styles.noPhotosImage} />
                            </View>
                        ) : (
                            <View style={styles.noPhotosContainer}>
                                <Carousel
                                    data={prototypephotos}
                                    renderItem={renderPhotoPrototypeItem}
                                    sliderWidth={300}
                                    itemWidth={200}
                                    layout={'default'}
                                    loop={true}
                                />
                            </View>
                        )}
                        <TouchableOpacity onPress={() => setModalVisibleprototypePhotos(false)} style={styles.closeButton}>
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
    modalContainers: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
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
    pdf: {
        flex: 1, // Make sure the WebView takes up all available space
    },
    centeredViews: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalViews: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButtonss: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    successTexts: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
    fileContainer: {
        alignItems: 'center', // Center items horizontally
    },
    downloadText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    noPhotosContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noPhotosImage: {
        width: 200, // Adjust the width as needed
        height: 200, // Adjust the height as needed
    },
});

export default MOBILEfacultyApplicationStatus;
