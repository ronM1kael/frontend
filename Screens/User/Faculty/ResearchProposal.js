import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import baseURL from '../../../assets/common/baseurl';
import baseURL2 from '../../../assets/common/baseurlnew';
import AuthGlobal from '../../../Context/Store/AuthGlobal';
import ResearchProposalInfo from './ResearchProposalInfo';

const App = () => {
    const [faculty, setFaculty] = useState({});
    const [proposals, setProposals] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [researchProposalFormVisible, setResearchProposalFormVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [researchType, setResearchType] = useState('Choose.........');
    const [researchProposalFile, setResearchProposalFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedProposal, setSelectedProposal] = useState({});
    const [researchProposalStatusModalVisible, setResearchProposalStatusModalVisible] = useState(false);
    const [reSubmitResearchProposalModalVisible, setReSubmitResearchProposalModalVisible] = useState(false);
    const [reSubmitTitle, setReSubmitTitle] = useState('');
    const [reSubmitResearchProposalFile, setReSubmitResearchProposalFile] = useState('');
    const [error, setError] = useState(null);
    const context = useContext(AuthGlobal);
    const [pdfFileName, setPdfFileName] = useState('');
    const [showPDF, setShowPDF] = useState(false);

    const handleClosePDF = () => {
        setShowPDF(false);
        setPdfFileName('');
    };

    useEffect(() => {
        fetchFacultyData();
    }, []);

    const fetchFacultyData = async () => {
        try {
            setRefreshing(true); // Start refreshing
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;

            if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
                console.error('Invalid authentication state');
                return;
            }

            const response = await axios.get(`${baseURL}mobileresearchProposal/${userProfile.id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setFaculty(response.data.faculty);
            setProposals(response.data.proposal);

            Toast.show({
                type: 'success',
                text1: 'Proposals fetched successfully',
            });

        } catch (error) {
            console.error('Error fetching faculty data:', error);

            Toast.show({
                type: 'error',
                text1: 'Error fetching proposals',
                text2: 'Please try again.',
            });

        } finally {
            setRefreshing(false); // Stop refreshing
        }
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

    const uploadResearchProposal = async () => {
        try {

            if (!researchProposalFile || !researchProposalFile.uri) { // Check if files or file URIs exist
                setError('Please choose a file'); // Set error state if any file is not selected
                return;
            }

            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;

            const formData = new FormData();
            formData.append('title', title);
            formData.append('research_type', researchType);
            formData.append('researchProposalFile', {
                uri: researchProposalFile.uri,
                name: researchProposalFile.name,
                type: 'application/pdf',
            });
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobileuploadResearchProposal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setSuccessMessage(response.data.message);
            setResearchProposalFormVisible(false);
            fetchFacultyData(); // Refresh data after submission
            Toast.show({
                type: 'success',
                text1: 'Proposal uploaded successfully',
            });
        } catch (error) {
            setErrorMessage('Failed to upload research proposal. Please try again.');
            console.error('Error uploading research proposal:', error);
            Toast.show({
                type: 'error',
                text1: 'Error uploading file',
                text2: 'Please try again.',
            });
        }
    };

    const reSubmitResearchProposal = async () => {
        try {

            if (!reSubmitResearchProposalFile || !reSubmitResearchProposalFile.uri) { // Check if files or file URIs exist
                setError('Please choose a file'); // Set error state if any file is not selected
                return;
            }

            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;
            const userId = userProfile.id;
            const proposalId = selectedProposal.resid

            const formData = new FormData();
            formData.append('proposalId', proposalId);
            formData.append('title', reSubmitTitle);
            formData.append('researchProposalFile', {
                uri: reSubmitResearchProposalFile.uri,
                name: reSubmitResearchProposalFile.name,
                type: 'application/pdf',
            });
            formData.append("user_id", userId);

            const response = await axios.post(`${baseURL}mobilereUploadResearchProposal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            setSuccessMessage(response.data.message);
            setReSubmitResearchProposalModalVisible(false);
            fetchFacultyData(); // Refresh data after resubmission
            Toast.show({
                type: 'success',
                text1: 'Proposal uploaded successfully',
            });
        } catch (error) {
            setErrorMessage('Failed to resubmit research proposal. Please try again.');
            console.error('Error resubmitting research proposal:', error);
            Toast.show({
                type: 'error',
                text1: 'Error uploading file',
                text2: 'Please try again.',
            });
        }
    };

    const toggleResearchProposalForm = () => {
        setResearchProposalFormVisible(!researchProposalFormVisible);
    };

    const openResearchProposalStatusModal = async (id) => {
        try {
            const response = await axios.get(`${baseURL}mobileresearchProposalStatus/${id}`);
            setSelectedProposal(response.data);
            setResearchProposalStatusModalVisible(true);
        } catch (error) {
            console.error('Error fetching research proposal status:', error);
        }
    };

    const openReSubmitResearchProposalModal = async (id) => {
        try {
            const response = await axios.get(`${baseURL}mobilereSubmitProposalFetchingId/${id}`);
            setSelectedProposal(response.data);
            setReSubmitTitle(response.data.title);
            setReSubmitResearchProposalModalVisible(true);
        } catch (error) {
            console.error('Error fetching proposal for resubmission:', error);
        }
    };

    const onRefresh = () => {
        fetchFacultyData();
    };

    const Viewpdf = async (fileName) => {
        try {
            const response = await fetch(`${baseURL}RPmobileshowpdf/${fileName}`);
            const data = await response.json();
            const base64Content = data.base64Content;
            const uri = `${baseURL2}/uploads/researchProposal/${fileName}`;
            setPdfFileName(uri);
            setShowPDF(true);
            console.log(uri);
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={styles.container}>
            <View style={[styles.buttonContainer, {marginBottom: 20}]}>
    <Button
        title="Submit Research Proposal"
        onPress={toggleResearchProposalForm}
        color="#333" // Set text color to black
    />
</View>
                {proposals.length > 0 ? (
                    proposals.map((proposal) => (
                        <View key={proposal.id} style={styles.proposalContainerVIEW}>
                            <Text style={styles.proposalTitleVIEW}>{proposal.title}</Text>
                            <View style={styles.statusContainerVIEW}>
                                {proposal.status === 'Research Proposal Approved By R&E Office' && (
                                    <Icon name="check-circle" size={20} color="green" style={styles.statusIconVIEW} />
                                )}
                                {proposal.status === 'Research Proposal Rejected By R&E Office' && (
                                    <Icon name="times-circle" size={20} color="red" style={styles.statusIconVIEW} />
                                )}
                                {proposal.status !== 'Research Proposal Approved By R&E Office' && proposal.status !== 'Research Proposal Rejected By R&E Office' && (
                                    <Icon name="hourglass-half" size={20} color="#333" style={styles.statusIconVIEW} />
                                )}
                                <Text style={styles.proposalStatusVIEW}>{proposal.status}</Text>
                            </View>
                            <TouchableOpacity onPress={() => openResearchProposalStatusModal(proposal.id)}>
                                <Text style={styles.detailsButtonVIEW}>View Details</Text>
                            </TouchableOpacity>
                            {proposal.status === 'Research Proposal Rejected By R&E Office' && (
                                <TouchableOpacity onPress={() => openReSubmitResearchProposalModal(proposal.id)}>
                                    <Text style={styles.resubmitButtonVIEW}>Re-Submit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainerVIEW}>
                        <Text style={styles.emptyTextVIEW}>Nothing has been uploaded here.</Text>
                        <Text style={styles.emptyTextVIEW}>Upload a research proposal.</Text>
                    </View>
                )}

                <View style={styles.container}>
                    <Modal visible={researchProposalFormVisible} animationType="slide" transparent={true}>
                        <ScrollView>
                            <View style={styles.modalBackground}>
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity onPress={toggleResearchProposalForm} style={styles.closeButton}>
                                        <Icon name="close" size={20} color="#333" />
                                    </TouchableOpacity>
                                    <ResearchProposalInfo />

                                    <Text style={styles.label}>Research Proposal Title:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                    <Text style={styles.label}>Select Research Proposal Type:</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={researchType}
                                            onValueChange={(itemValue) => setResearchType(itemValue)}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="Choose..." value="Choose..." />
                                            <Picker.Item label="Research Program" value="Research Program" />
                                            <Picker.Item label="Research Project" value="Research Project" />
                                            <Picker.Item label="Independent Study" value="Independent Study" />
                                        </Picker>
                                    </View>
                                    <Text style={styles.label}>Research Proposal File:</Text>
                                    <View style={styles.fileInput}>
                                        <Button title="Choose File" onPress={() => handleChooseFile(setResearchProposalFile)} color="grey" />
                                        <Text numberOfLines={1} ellipsizeMode="middle" style={styles.fileText}>
                                            {researchProposalFile ? researchProposalFile.name : 'No file chosen'}
                                        </Text>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <Button title="Submit" onPress={uploadResearchProposal} style={styles.button} color="#333" />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </Modal>
                </View>

                <Modal visible={researchProposalStatusModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalBackgroundSS}>
                        <View style={styles.modalContainerSS}>
                            <TouchableOpacity onPress={() => setResearchProposalStatusModalVisible(false)} style={styles.closeButton}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitleSS}>Research Proposal Status</Text>
                            <TouchableOpacity onPress={() => Viewpdf(selectedProposal.proposal_file)}>
                                <View style={styles.detailContainerSS}>
                                    <Icon name="file-pdf-o" size={20} color="#333" style={styles.iconSS} />
                                    <Text style={styles.detailTextSS}>{selectedProposal.title}</Text>
                                </View>
                                <Text style={styles.downloadNote}>Click to download the file</Text>
                            </TouchableOpacity>
                            <View style={styles.detailContainerSS}>
                                <Icon name="clipboard" size={20} color="#333" style={styles.iconSS} />
                                <Text style={styles.detailTextSS}>{selectedProposal.research_type}</Text>
                            </View>
                            <View style={styles.detailContainerSS}>
                                {selectedProposal.status === 'Research Proposal Approved By R&E Office' && (
                                    <Icon name="check-circle" size={20} color="#333" style={styles.iconSS} />
                                )}
                                {selectedProposal.status === 'Research Proposal Rejected By R&E Office' && (
                                    <Icon name="times-circle" size={20} color="#333" style={styles.iconSS} />
                                )}
                                {(selectedProposal.status !== 'Research Proposal Approved By R&E Office' && selectedProposal.status !== 'Research Proposal Rejected By R&E Office') && (
                                    <Icon name="hourglass-half" size={20} color="#333" style={styles.iconSS} />
                                )}
                                <Text style={styles.detailTextSS}>{selectedProposal.status}</Text>
                            </View>
                            <View style={styles.detailContainerSS}>
                                <Icon name="comment" size={20} color="#333" style={styles.iconSS} />
                                <Text style={styles.detailTextSS}>{selectedProposal.remarks}</Text>
                            </View>
                            <View style={styles.detailContainerSS}>
                                <Icon name="clock-o" size={20} color="#333" style={styles.iconSS} />
                                <Text style={styles.detailTextSS}>{selectedProposal.time}</Text>
                            </View>
                            <View style={styles.detailContainerSS}>
                                <Icon name="calendar" size={20} color="#333" style={styles.iconSS} />
                                <Text style={styles.detailTextSS}>{selectedProposal.date}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showPDF}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleClosePDF}
                >
                    <View style={styles.PDFcenteredView}>
                        <View style={[styles.PDFmodalView, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                            <TouchableOpacity onPress={handleClosePDF} style={styles.PDFcloseButtons}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <WebView source={{ uri: pdfFileName }} />
                            <View style={{ alignItems: 'center' }}>
                                <Icon name="check-circle" size={100} color="green" />
                                <Text style={[styles.PDFsuccessText, { marginLeft: 10 }]}>The file has been successfully downloaded.</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.container}>
                    <Modal visible={reSubmitResearchProposalModalVisible} animationType="slide" transparent={true}>
                        <View style={styles.resmodalBackground}>
                            <View style={styles.resmodalContainer}>
                                <TouchableOpacity onPress={() => setReSubmitResearchProposalModalVisible(false)} style={styles.closeButton}>
                                    <Icon name="close" size={20} color="#333" />
                                </TouchableOpacity>
                                <Text style={styles.resmodalTitle}>Re-Submit Research Proposal</Text>
                                <View style={styles.hr}></View>
                                <Text style={styles.label}>Research Proposal Title:</Text>
                                <TextInput style={styles.input} value={reSubmitTitle} onChangeText={setReSubmitTitle} />
                                <Text style={styles.label}>Research Proposal File:</Text>
                                <View style={styles.fileInput}>
                                    <Button title="Choose File" onPress={() => handleChooseFile(setReSubmitResearchProposalFile)} color="grey" />
                                    <Text numberOfLines={1} ellipsizeMode="middle" style={styles.fileText}>
                                        {reSubmitResearchProposalFile ? reSubmitResearchProposalFile.name : 'No file chosen'}
                                    </Text>
                                </View>
                                <Text style={styles.description}>
                                    <Text style={styles.bold}>Note:</Text> Please ensure that you upload the revised research proposal in this field to prevent rejection.
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button title="Submit" onPress={reSubmitResearchProposal} style={styles.button} color="#333" />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 20,
        width: '100%',
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    input: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        color: '#333',
    },
    pickerContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        color: '#333',
        backgroundColor: '#fff',
    },
    picker: {
        color: '#333',
    },
    fileInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 10,
    },
    fileText: {
        flex: 1,
        textAlign: 'center',
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        marginVertical: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    resmodalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resmodalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    resmodalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    hr: {
        borderBottomColor: 'maroon',
        borderBottomWidth: 5,
        marginBottom: 20,
    },
    description: {
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    modalBackgroundSS: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainerSS: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitleSS: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    detailContainerSS: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconSS: {
        marginRight: 10,
    },
    detailTextSS: {
        fontSize: 18,
        color: '#333',
    },
    downloadNote: {
        fontSize: 14,
        color: 'maroon',
        textAlign: 'center',
        marginTop: 5,
    },
    PDFcenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    PDFmodalView: {
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
    PDFcloseButtons: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    PDFsuccessText: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
    proposalContainerVIEW: {
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    proposalTitleVIEW: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    statusContainerVIEW: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusIconVIEW: {
        marginRight: 10,
    },
    proposalStatusVIEW: {
        fontSize: 16,
        color: '#333',
    },
    detailsButtonVIEW: {
        fontSize: 14,
        color: 'blue',
        marginBottom: 5,
    },
    resubmitButtonVIEW: {
        fontSize: 14,
        color: 'red',
        fontWeight: 'bold',
    },
    emptyContainerVIEW: {
        alignItems: 'center',
    },
    emptyTextVIEW: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    buttonContainertop: {
        marginTop: 10, // Add margin to the top
        marginBottom: 10, // Add margin to the bottom
        alignSelf: 'center', // Align button to center horizontally
    },
});

export default App;
