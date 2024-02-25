import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const App = () => {
    const [studentstats, setStudentStats] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const context = useContext(AuthGlobal);

    useEffect(() => {
        fetchStudentStats();
    }, []);

    const fetchStudentStats = async () => {
        try {
            setLoading(true);
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;

            if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
                console.error('Invalid authentication state');
                return;
            }

            const response = await fetch(`${baseURL}mobileapplication_status/status/${userProfile.id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            const data = await response.json();
            setStudentStats(data.studentstats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student stats:', error);
            setLoading(false);
        }
    };

    const openModal = async (id) => {
        try {
            setLoading(true);
            const jwtToken = await AsyncStorage.getItem('jwt');
            const response = await fetch(`${baseURL}mobileshow_application/${id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            const data = await response.json();
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

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Applications Status</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={studentstats.filter(searchFilter)}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item.id)} style={[styles.card, { borderColor: item.titleColor }]}>
                            <Text style={[styles.cardTitle, { color: item.titleColor }]}>{item.research_title}</Text>
                            <View style={styles.icon}>
                                <Text>({item.status})</Text>
                            </View>
                            <Image
                                source={{ uri: 'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png' }}
                                style={styles.image}
                            />
                            <TouchableOpacity style={styles.button} onPress={() => openModal(item.id)}>
                                <Text style={styles.buttonText}>View Details</Text>
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
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Adviser Name: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.adviser_name}</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Adviser Email: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.adviser_email}</Text>
                            </Text>
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
                                <Text style={{ textDecorationLine: 'underline', color: 'maroon', fontWeight: 'bold', fontSize: 20 }}>
                                    {selectedData.status}
                                </Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Similarity Percentage Results: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.simmilarity_percentage_results}%</Text>
                            </Text>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: 'bold' }}>Certificate: </Text>
                                <Text style={{ textDecorationLine: 'underline' }}>{selectedData.certificate}</Text>
                            </Text>
                            <Text style={styles.cardTitle}></Text>
                            <Text style={[styles.cardTitle, { textAlign: 'center' }]}>Researchers Details</Text>
                            <Text style={styles.cardTitle}></Text>
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

        </View>
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
        borderColor: '#A9A9A9',
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