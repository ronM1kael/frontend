import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const MainScreen = ({ route }) => {
    const [extensions, setExtensions] = useState([]);
    const [ranks, setRanks] = useState(Array(7).fill('')); // Initialize an array to store rank values
    const navigation = useNavigation(); // Access the navigation object

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}mobile-second-page`);
            setExtensions(response.data.extensions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRankChange = (index, value) => {
        const newRanks = [...ranks];
        newRanks[index] = value;
        setRanks(newRanks);
    };

    const formData = route.params ? route.params.formData : null;

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${baseURL}Mobilesubmiting`, {
                ...formData,
                ranks: ranks, // Change this to send ranks as an array
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });
    
            console.log("Request Sent Successfully", response.data);
            navigation.navigate('Home');
            setShowModal(true);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const [showmodal, setShowModal] = useState(false);

    const handleClosePDF = () => {
        setShowModal(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Community Survey For Training Needs</Text>
                <Text style={styles.intro}>
                    Ang TUP-Taguig po ay may adhikaing matulungan at mapalawak ang kaalaman ng ating mga nasasakupang barangay sa pamamagitan
                    ng pagbibigay ng seminar o pagsasanay sa aspeto teknikal. Ang pagsasanay na ito ay maaring magamit nila sa kanilang kabuhayan.
                </Text>
                <Text style={styles.instructions}>
                    Pakisagutan ang mga sumusunod nakatanungan upang malaman naming ang iyong interes at ang mga paraan upang maayos naming kayong
                    mapaglingkuran. Pakilagyan lamang ang mga sumusunod at punan ang mga patlang ayon sa inyong sagot.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.header}>List of Skill Trainings</Text>
                    <View style={styles.skillsContainer}>
                        {extensions.map((extension, index) => (
                            <Text key={index} style={styles.skillItem}>
                                {extension.topics}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subheader}>11.) Rank the following skills according to your preference</Text>
                    {[1, 2, 3, 4, 5, 6, 7].map((rank, index) => (
                        <View key={index} style={styles.rankContainer}>
                            <Text style={styles.rankLabel}>Rank {rank}:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={ranks[index]}
                                    onValueChange={(value) => handleRankChange(index, value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="--- Select ---" value="" />
                                    {extensions.map((extension, index) => (
                                        <Picker.Item key={index} label={extension.topics} value={extension.topics} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRanks(Array(7).fill(''))} style={[styles.button, styles.resetButton]}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </ScrollView>
            <Modal
                visible={showmodal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleClosePDF}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: 350, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={handleClosePDF} style={styles.closeButtons}>
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="check-circle" size={100} color="green" />
                            <Text style={[styles.successText, { marginLeft: 10 }]}>Thank you for taking the time to share your feedback with us! Your satisfaction is our priority,
                                and we're thrilled to hear about your positive experience.
                                We value your input and look forward to serving you even better in the future.
                                If you have any further comments or suggestions, please don't hesitate to reach out. Have a fantastic day!</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subheader: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    text: {
        marginBottom: 10,
    },
    skillsContainer: {
        alignItems: 'center',
    },
    skillItem: {
        marginBottom: 5,
    },
    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rankLabel: {
        marginRight: 10,
    },
    picker: {
        flex: 1,
    },
    button: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    resetButton: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    pickerContainer: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    intro: {
        marginBottom: 20,
        textAlign: 'justify',
    },
    instructions: {
        marginBottom: 20,
        textAlign: 'justify',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
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
    successText: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
});

export default MainScreen;
