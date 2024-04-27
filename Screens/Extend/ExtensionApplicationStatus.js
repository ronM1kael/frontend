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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchExtensionData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [fetchExtensionData]);

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
                        <View style={styles.separator} />
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusValue}>{selectedExtension?.status}</Text>
                        </View>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${selectedExtension?.percentage_status}%` }]}>
                                <Text style={styles.progressText}>{selectedExtension?.percentage_status}%</Text>
                            </View>
                        </View>
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
        alignItems: 'center',
        marginBottom: 10,
    },
    statusValue: {
        fontSize: 18,
        color: '#333333',
    },
});

export default MOBILEfacultyApplicationStatus;