import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Image } from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import baseURL from '../../../assets/common/baseurl';

import Icon from "react-native-vector-icons/FontAwesome";

import Toast from "react-native-toast-message";
import AuthGlobal from '../../../Context/Store/AuthGlobal';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";

import baseURL2 from '../../../assets/common/baseurlnew';
import { WebView } from 'react-native-webview';

const YourComponent = () => {
    const [researchTitle, setResearchTitle] = useState('');
    const [researchList, setResearchList] = useState([]);
    const [researchCount, setResearchCount] = useState(0);
    const [selectedResearch, setSelectedResearch] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleFILE, setModalVisibleFILE] = useState(false);
    const [error, setError] = useState('');

    // const [requestModalVisible, setRequestModalVisible] = useState(false);

    const [accessModalVisible, setAccessModalVisible] = useState(false);
    const [pendingModalVisible, setPendingModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);

    const [endModalVisible, setEndModalVisible] = useState(false);

    const context = useContext(AuthGlobal);
    const navigation = useNavigation();

    const [purpose, setPurpose] = useState('');

    const [selectedResearchId, setSelectedResearchId] = useState(null); // Add state for selected research id

    const [showInputContainer, setShowInputContainer] = useState(false);

    useEffect(() => {
        fetchResearchList();
    }, []);

    const fetchResearchList = async (query = '') => {
        try {
            const response = await fetch(`${baseURL}mobile/faculty-checker-page?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            setResearchList(data.researchlist);
            setResearchCount(data.researchlist.length);
            setError('');
        } catch (error) {
            console.error('Error fetching research list:', error);
            setError('Error fetching research list');
        }
    };

    const searchResearch = () => {
        fetchResearchList(researchTitle);
    };

    const openResearchModal = async (id) => {
        try {
            const response = await fetch(`${baseURL}mobile/faculty/send-request-access/${id}`);
            const data = await response.json();

            const endAccessDate = new Date(data.end_access_date);
            const currentDate = new Date();

            // Set hours, minutes, seconds, and milliseconds to zero
            endAccessDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            setSelectedResearch(data);
            setModalVisible(true);
            setError('');
        } catch (error) {
            console.error('Error fetching research info:', error);
            setError('Error fetching research info');
        }
    };

    const openRequestModal = async (id) => {
        try {
            const response = await fetch(`${baseURL}mobile/facultyFILE/send-request-access/${id}`);
            const data = await response.json();

            const endAccessDate = new Date(data.end_access_date);
            const currentDate = new Date();

            // Set hours, minutes, seconds, and milliseconds to zero
            endAccessDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            console.log(data);
            if (data.status == null) {
                setAccessModalVisible(true);
                setSelectedResearchId(id); // Store the id in state
            } else if (data.status === 'Access Approved') {
                if (endAccessDate.getTime() > currentDate.getTime()) {
                    setSelectedResearch(data);
                    setModalVisibleFILE(true);
                } else {
                    setEndModalVisible(true);
                }
            } else if (data.status === 'Rejected') {
                setRejectModalVisible(true);
            } else {
                setPendingModalVisible(true);
            }
            setError('');
        } catch (error) {
            console.error('Error fetching research info:', error);
            setError('Error fetching research info');
        }
    };

    const handleConfirmation = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;

            if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
                setError("User authentication or profile information is missing");
                return;
            }

            const userId = userProfile.id;
            const role = userProfile.role;

            const response = await axios.post(`${baseURL}student/send-request-access`, {
                research_id: selectedResearchId, // Use the selectedResearchId here
                purpose: purpose,
                requestor_id: userId,
                requestor_type: role
            });

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Request was successfully sent',
                    visibilityTime: 3000,
                    autoHide: true
                });
                setAccessModalVisible(false);
                setRejectModalVisible(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to send request',
                    visibilityTime: 3000,
                    autoHide: true
                });
            }
        } catch (error) {
            console.error('Error sending request:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send request',
                visibilityTime: 3000,
                autoHide: true
            });
        }
    };

    const [pdfFileName, setPdfFileName] = useState('');
    const [showPDF, setShowPDF] = useState(false);

    const Viewpdf = async (fileName) => {
        try {
            const response = await fetch(`${baseURL}mobileshowpdf/${fileName}`);
            const data = await response.json();
            const base64Content = data.base64Content;
            const uri = `${baseURL2}/uploads/pdf/${fileName}`;
            setPdfFileName(uri);
            setShowPDF(true);
            console.log(uri);
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };

    const handleClosePDF = () => {
        setShowPDF(false);
        setPdfFileName('');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View>
                    <Text style={[styles.title, { textAlign: 'center', color: 'black' }]}>Title Checker</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={researchTitle}
                            onChangeText={setResearchTitle}
                        />
                        <TouchableOpacity style={styles.searchIcon}
                            onPress={searchResearch}
                            underlayColor="#E8E8E8">
                            <Icon name="search" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>
                {error ? (
                    <Text style={[styles.listItem, { color: 'grey' }]}>{error}</Text>
                ) : researchCount === 0 ? (
                    <Text style={[styles.listItem, { color: 'grey' }]}>Nothing matched your title.</Text>
                ) : (
                    // Inside the return statement of YourComponent
                    <ScrollView style={styles.list}>
                        {researchList.map((item) => (
                            <TouchableOpacity key={item.id} onPress={() => openResearchModal(item.id)}>
                                <View style={styles.listItem}>
                                    <View style={styles.itemContent}>
                                        <Text style={styles.researchTitle}>{item.research_title}</Text>
                                        <TouchableOpacity style={styles.requestButton} key={item.id} onPress={() => openRequestModal(item.id)}>
                                            <Icon name="file-pdf-o" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* PERMISSION */}
                <Modal visible={accessModalVisible} animationType="slide" transparent={true}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, borderColor: 'maroon', borderWidth: 2 }}>
                            <TouchableOpacity onPress={() => setAccessModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'maroon' }}>Research Information</Text>
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Icon name="file-pdf-o" size={80} color="maroon" />
                            </View>
                            <Text style={{ marginBottom: 20 }}>To gain access to the information, you need to send a permission request.</Text>

                            <TouchableOpacity
                                onPress={() => setShowInputContainer(prevState => !prevState)}
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: 'maroon',
                                    borderWidth: 1,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 5,
                                    width: 200, // Adjust width as needed
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 55
                                }}
                            >
                                <Text style={{ color: 'maroon', fontWeight: 'bold' }}>
                                    {showInputContainer ? 'Close' : 'Request Access'}
                                </Text>
                            </TouchableOpacity>

                            {showInputContainer && (
                                <View style={{ marginTop: 10, width: "95%", height: 100, borderColor: "#800000", borderWidth: 1, borderRadius: 8, flexDirection: 'row', alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }}>
                                    <TextInput style={styles.inputs} multiline={true} numberOfLines={4} onChangeText={(text) => setPurpose(text)} />
                                    <TouchableOpacity onPress={handleConfirmation} style={{ marginLeft: 10 }}>
                                        <View style={{ backgroundColor: 'maroon', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}>
                                            <Text style={{ color: 'white' }}>Send Request</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* IF status=pending */}
                <Modal visible={pendingModalVisible} animationType="slide" transparent={true}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, borderColor: 'maroon', borderWidth: 2 }}>
                            <TouchableOpacity onPress={() => setPendingModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'maroon' }}>Request Information</Text>
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Icon name="hourglass" size={80} color="maroon" />
                            </View>
                            <Text style={{ marginBottom: 20 }}>Request processing, Please wait.</Text>
                        </View>
                    </View>
                </Modal>

                {/* IF status=Access Approved */}
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    {selectedResearch && (
                        <ScrollView>
                            <View style={[styles.modalContainer, { marginTop: 50, marginHorizontal: 20, borderRadius: 10, borderColor: 'maroon', borderWidth: 2 }]}>
                                <View style={styles.modalContents}>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={{
                                            alignSelf: "flex-end",
                                            position: "absolute",
                                            top: 5,
                                            right: 10,
                                        }}
                                    >
                                        <Icon name="close" size={20} />
                                    </TouchableOpacity>
                                    <Text style={[styles.modalTitle, { marginTop: 30 }]}>Research Title</Text>
                                    <Text style={{ marginBottom: 30, color: 'maroon', fontStyle: 'italic' }}>
                                        {selectedResearch?.research_title}
                                    </Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Abstract:</Text>
                                        <Text style={{ marginBottom: 30, marginLeft: 70, flex: 1 }}>
                                            {selectedResearch?.abstract}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Department:</Text>
                                        <Text style={{ marginBottom: 30, marginLeft: 49 }}>
                                            {selectedResearch?.department}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Course:</Text>
                                        <Text style={{ marginBottom: 30, marginLeft: 82 }}>
                                            {selectedResearch?.course}
                                        </Text>
                                    </View>

                                    <Text style={[styles.modalTitle, { marginBottom: 30 }]}>Research Details</Text>
                                    {selectedResearch.faculty_adviser1 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty 1:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                                                    {selectedResearch?.faculty_adviser1}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.faculty_adviser2 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty 2:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                                                    {selectedResearch?.faculty_adviser2}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.faculty_adviser3 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty 3:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                                                    {selectedResearch?.faculty_adviser3}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.faculty_adviser4 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Faculty 4:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 20 }}>
                                                    {selectedResearch?.faculty_adviser4}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.researcher1 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 1:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 35 }}>
                                                    {selectedResearch?.researcher1}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.researcher2 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 2:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 35 }}>
                                                    {selectedResearch?.researcher2}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.researcher3 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 3:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 35 }}>
                                                    {selectedResearch?.researcher3}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.researcher4 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 4:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 35 }}>
                                                    {selectedResearch?.researcher4}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.researcher5 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 5:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 35 }}>
                                                    {selectedResearch?.researcher5}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {selectedResearch.researcher6 && (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Researcher 6:</Text>
                                                <Text style={{ marginBottom: 16, marginLeft: 35 }}>
                                                    {selectedResearch?.researcher6}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Time Frame:</Text>
                                        <Text style={{ marginBottom: 16, marginLeft: 53 }}>
                                            {selectedResearch?.time_frame}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Date Completion:</Text>
                                        <Text style={{ marginBottom: 16, marginLeft: 23 }}>
                                            {selectedResearch?.date_completion}
                                        </Text>
                                    </View>

                                    <Text style={{ marginTop: 30, color: 'maroon', fontStyle: 'italic', marginLeft: 30 }}>
                                        This information remains valid until {selectedResearch?.end_access_date}
                                    </Text>

                                </View>
                            </View>
                        </ScrollView>
                    )}
                </Modal>

                <Modal
                    visible={showPDF}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleClosePDF}
                >
                    <View style={styles.centeredViews}>
                        <View style={[styles.modalViews, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                            <TouchableOpacity onPress={handleClosePDF} style={styles.closeButtons}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <WebView source={{ uri: pdfFileName }} />
                            <View style={{ alignItems: 'center' }}>
                                <Icon name="check-circle" size={100} color="green" />
                                <Text style={[styles.successTexts, { marginLeft: 10 }]}>The file has been successfully downloaded.</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* IF status=Access Approved FILE */}
                <Modal visible={modalVisibleFILE} animationType="slide" transparent={true}>
                    {selectedResearch && (
                        <ScrollView>
                            <View style={[styles.modalContainer, { marginTop: 50, marginHorizontal: 20, borderRadius: 10, borderColor: 'maroon', borderWidth: 2 }]}>
                                <View style={styles.modalContents}>
                                    <TouchableOpacity
                                        onPress={() => setModalVisibleFILE(false)}
                                        style={{
                                            alignSelf: "flex-end",
                                            position: "absolute",
                                            top: 5,
                                            right: 10,
                                        }}
                                    >
                                        <Icon name="close" size={20} />
                                    </TouchableOpacity>

                                    <Image
                                        source={{
                                            uri: 'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png',
                                        }}
                                        style={styles.image}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            Viewpdf(selectedResearch.research_file); // Assuming each item has a fileName property
                                        }}
                                        style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                                    >
                                        <Text style={{ marginRight: 5 }}>Download PDF</Text>
                                        <Icon name="download" size={20} color="maroon" />
                                    </TouchableOpacity>
                                    <Text style={{ marginTop: 30, color: 'maroon', fontStyle: 'italic', marginLeft: 30 }}>
                                        This information remains valid until {selectedResearch?.end_access_date}
                                    </Text>

                                </View>
                            </View>
                        </ScrollView>
                    )}
                </Modal>

                {/* IF status=Reject */}
                <Modal visible={rejectModalVisible} animationType="slide" transparent={true}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, borderColor: 'maroon', borderWidth: 2 }}>
                            <TouchableOpacity onPress={() => setRejectModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'maroon' }}>Research Information</Text>
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Icon name="shield" size={80} color="maroon" />
                            </View>
                            <Text style={{ marginBottom: 20 }}>The access you have requested has been denied.</Text>

                            <TouchableOpacity
                                onPress={() => setShowInputContainer(prevState => !prevState)}
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: 'maroon',
                                    borderWidth: 1,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 5,
                                    width: 200, // Adjust width as needed
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 55
                                }}
                            >
                                <Text style={{ color: 'maroon', fontWeight: 'bold' }}>
                                    {showInputContainer ? 'Close' : 'Reapply for Permission'}
                                </Text>
                            </TouchableOpacity>

                            {showInputContainer && (
                                <View style={[styles.inputContainer, { justifyContent: 'center', marginTop: 10 }]}>
                                    <View
                                        style={{
                                            width: "90%",
                                            height: 100,
                                            borderColor: "#800000",
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            flexDirection: 'row',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <TextInput
                                            style={styles.inputs}
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={setPurpose}
                                            value={purpose}
                                        />
                                        <TouchableOpacity
                                            onPress={handleConfirmation}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <View style={{ backgroundColor: 'maroon', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}>
                                                <Text style={{ color: 'white' }}>Send Request</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* IF end_access_date=date */}
                <Modal visible={endModalVisible} animationType="slide" transparent={true}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, borderColor: 'maroon', borderWidth: 2 }}>
                            <TouchableOpacity onPress={() => setEndModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'maroon' }}>Research Information</Text>
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="exclamation-triangle" size={80} color="maroon" />
                                    <Text style={{ marginBottom: 20 }}>The access you had expired.</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => setShowInputContainer(prevState => !prevState)}
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: 'maroon',
                                        borderWidth: 1,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 5,
                                        width: 200, // Adjust width as needed
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ color: 'maroon', fontWeight: 'bold' }}>
                                        {showInputContainer ? 'Close' : 'Reapply for Permission'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {showInputContainer && (
                                <View style={[styles.inputContainer, { justifyContent: 'center', marginTop: 10 }]}>
                                    <View
                                        style={{
                                            width: "90%",
                                            height: 100,
                                            borderColor: "#800000",
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            flexDirection: 'row',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <TextInput
                                            style={styles.inputs}
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={setPurpose}
                                            value={purpose}
                                        />
                                        <TouchableOpacity
                                            onPress={handleConfirmation}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <View style={{ backgroundColor: 'maroon', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}>
                                                <Text style={{ color: 'white' }}>Send Request</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f1f8ff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    list: {
        marginTop: 10,
    },
    listItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    researchTitle: {
        color: 'black', // Maroon color
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent', // semi-transparent black background
    },
    modalContent: {
        backgroundColor: "white",
        width: '80%', // Adjust width as needed
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#800000', // Maroon color
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
    },
    requestButton: {
        backgroundColor: '#800000', // Maroon color
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 250, // Adjust the margin-left as needed
    },
    requestButtonText: {
        color: '#fff', // White color
        fontWeight: 'bold',
    },
    itemContent: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    note: {
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
        fontSize: 16,
        color: '#333', // Adjust color as needed
    },
    inputs: {
        paddingRight: 10,
        lineHeight: 23,
        flex: 2,
        textAlignVertical: 'top'
    },
    modalContents: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "left",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    image: {
        height: 150,
        marginBottom: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
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
    closeButtons: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    successTexts: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
});

export default YourComponent;