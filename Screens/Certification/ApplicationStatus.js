import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, FlatList, Image, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import baseURL2 from '../../assets/common/baseurlnew';

const App = () => {

    const [stats, setStats] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [turnitinProofPhotos, setTurnitinProofPhotos] = useState([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [turnitinProofModalVisible, setTurnitinProofModalVisible] = useState(false); // New state for Turnitin proof photos modal visibility
    const context = useContext(AuthGlobal);

    const userProfilerole = context.stateUser.userProfile;

    useFocusEffect(React.useCallback(() => {
        fetchData(); // Call fetchData when screen gains focus
    }, [context.stateUser.userProfile.id]));

    const fetchData = async () => {
        try {
            setLoading(true);
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;

            if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
                console.error('Invalid authentication state');
                return;
            }

            let url = '';
            if (userProfile.role === 'Faculty' || userProfile.role === 'Staff') {
                url = `${baseURL}mobileapplication_statusfaculty/status/${userProfile.id}`;
            } else {
                url = `${baseURL}mobileapplication_status/status/${userProfile.id}`;
            }

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            const data = await response.json();
            setStats(data.studentstats || data.facultystats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const openModal = async (id) => {
        try {
            setLoading(true);
            const userProfile = context.stateUser.userProfile;
            const jwtToken = await AsyncStorage.getItem('jwt');
            let url = '';
            if (userProfile.role === 'Faculty' || userProfile.role === 'Staff') {
                url = `${baseURL}mobileshow_applicationfaculty/${id}`;
            } else {
                url = `${baseURL}mobileshow_application/${id}`;
            }
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            const data = await response.json();
            console.log(data);
            setSelectedData(data);
            setModalVisible(true);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching specific application data:', error);
            setLoading(false);
        }
    };

    const searchFilter = (item) => {
        const query = searchQuery.toLowerCase();
        return item.research_title.toLowerCase().includes(query);
    };

    const fetchTurnitinProofPhotos = async (item) => {
        try {
            setLoadingPhotos(true);
            const jwtToken = await AsyncStorage.getItem('jwt');
            const response = await fetch(`${baseURL}turnitin-proof-photos/${item.id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            const data = await response.json();
            setTurnitinProofPhotos(data);
            setLoadingPhotos(false);
            setTurnitinProofModalVisible(true); // Show Turnitin proof photos modal after fetching photos
        } catch (error) {
            console.error('Error fetching Turnitin proof photos:', error);
            setLoadingPhotos(false);
        }
    };

    const viewTurnitinPhotos = () => {
        if (selectedData && selectedData.id) {
            fetchTurnitinProofPhotos(selectedData.id);
        } else {
            console.error('Selected data is null or does not have an id property');
        }
    };   

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.pageTitle, { textAlign: 'center', color: 'black' }]}>
                Applications Status
            </Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="black"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={stats.filter(searchFilter)}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item.id)} style={[styles.card, { borderColor: item.titleColor }]}>
                            <Text style={[styles.cardTitle, { color: item.titleColor }]}>{item.research_title}</Text>
                            <View style={styles.icon}>
                                <Text>({item.submission_frequency})</Text>
                            </View>
                            <Image
                                source={{ uri: 'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png' }}
                                style={styles.image}
                            />
                            <View style={{ backgroundColor: item.status === 'Passed' ? 'green' : item.status === 'Returned' ? 'red' : 'yellow', padding: 10, borderRadius: 5, }}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>{item.status}</Text>
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => openModal(item.id)}>
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => fetchTurnitinProofPhotos(item)}>
    <Text style={styles.buttonText}>View Turnitin Proof Photos</Text>
</TouchableOpacity>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                />
            )}
            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    {selectedData && (
                        <ScrollView>
                            <Text style={styles.cardTitle}>
                                <Text style={[{ fontStyle: 'italic', color: 'maroon', textAlign: 'center' }]}>"{selectedData.research_title}"</Text>
                            </Text>
                            <Text style={styles.cardTitle}></Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Submission Frequency: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.submission_frequency}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Initial Similarity Percentage: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.initial_simmilarity_percentage}%</Text>
                            </Text>
                            <Text style={styles.cardTitle}></Text>
                            <Text style={[styles.cardTitle, { textAlign: 'center' }]}>Research Details</Text>
                            <Text style={styles.cardTitle}></Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Thesis Type: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.thesis_type}</Text>
                            </Text>
                            {userProfilerole.role === 'Student' && (
                                <Text style={styles.label}>
                                    <Text style={{ fontWeight: 'bold' }}>Technical Adviser: </Text>
                                    <Text style={{ textDecorationLine: 'underline' }}>{selectedData.TechnicalAdviserName}</Text>
                                </Text>
                            )}
                            {userProfilerole.role === 'Student' && (
                                <Text style={styles.label}>
                                    <Text style={{ fontWeight: 'bold' }}>Technical Adviser Email: </Text>
                                    <Text style={{ textDecorationLine: 'underline' }}>{selectedData.technicalAdviserEmail}</Text>
                                </Text>
                            )}
                            {userProfilerole.role === 'Student' && (
                                <Text style={styles.label}>
                                    <Text style={{ fontWeight: 'bold' }}>Subject Adviser: </Text>
                                    <Text style={{ textDecorationLine: 'underline' }}>{selectedData.SubjectAdviserName}</Text>
                                </Text>
                            )}
                            {userProfilerole.role === 'Student' && (
                                <Text style={styles.label}>
                                    <Text style={{ fontWeight: 'bold' }}>Subject Adviser Email: </Text>
                                    <Text style={{ textDecorationLine: 'underline' }}>{selectedData.subjectAdviserEmail}</Text>
                                </Text>
                            )}
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Research Specialist: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.research_specialist}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Research Staff: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.research_staff}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Status: </Text>
                                <Text
                                    style={[
                                        { textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 20 },
                                        selectedData.status === 'Passed' ? { color: 'green' } :
                                            selectedData.status === 'Returned' ? { color: 'maroon' } :
                                                { color: 'yellow' }
                                    ]}
                                >
                                    {selectedData.status}
                                </Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Similarity Percentage Results: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.simmilarity_percentage_results}%</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Remarks: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.remarks}</Text>
                            </Text>
                            <Text style={styles.cardTitle}></Text>
                            <Text style={[styles.cardTitle, { textAlign: 'center' }]}>Researchers Details</Text>
                            <Text style={styles.cardTitle}></Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Requestor Name: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.requestor_name}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Requestor Type: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.requestor_type}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Student ID: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.tup_id}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>TUP Email: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.email_address}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Gender: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.sex}</Text>
                            </Text>
                            {userProfilerole.role === 'Student' && (
                                <Text style={styles.label}>
                                    <Text style={{ fontWeight: 'bold' }}>Course: </Text>
                                    <Text style={{ textDecorationLine: 'underline' }}>{selectedData.course}</Text>
                                </Text>
                            )}
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>College: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.college}</Text>
                            </Text>
                            {selectedData.researchers_name1 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 1: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name1}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name2 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 2: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name2}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name3 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 3: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name3}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name4 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 4: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name4}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name5 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 5: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name5}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name6 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 6: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name6}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name7 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 7: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name7}</Text>
                                    </Text>
                                </>
                            )}
                            {selectedData.researchers_name8 && (
                                <>
                                    <Text style={styles.label}>
                                        <Text style={{ fontWeight: 'bold' }}>Researcher 8: </Text>
                                        <Text style={{ textDecorationLine: 'underline' }}>{selectedData.researchers_name8}</Text>
                                    </Text>
                                </>
                            )}
                        </ScrollView>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal visible={turnitinProofModalVisible} animationType="slide">
    <View style={styles.container}>
        {loadingPhotos ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <ScrollView>
                {turnitinProofPhotos.length > 0 ? (
                    turnitinProofPhotos.map((photo, index) => (
                        <Image
                            key={index}
                            source={{ uri: `${baseURL2}/images/turnitinProofs/${photo.img_path}` }}
                            style={styles.image}
                        />
                    ))
                ) : (
                    <Text>No Turnitin proof photos available.</Text>
                )}
            </ScrollView>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={() => setTurnitinProofModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
    </View>
</Modal>



        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'grey',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    card: {
        width: '48%',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        marginRight: '2%',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    button: {
        backgroundColor: 'maroon',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    image: {
        height: 150,
        marginBottom: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
});

export default App;