import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import Icon from "react-native-vector-icons/FontAwesome";

const CustomerSatisfactionSurveyFormSecondPage = ({ route }) => {
    const navigation = useNavigation(); // Access the navigation object

    const [ratings, setRatings] = useState({
        rating1: '',
        rating2: '',
        rating3: '',
        rating4: '',
        rating5: '',
        rating6: '',
    });

    const handleRatingChange = (ratingName, value) => {
        setRatings({ ...ratings, [ratingName]: value });
    };

    const formData = route.params ? route.params.formData : null;

    const sendRequest = async () => {
        try {
            const response = await axios.post(`${baseURL}mobilesession2`, {
                ...formData,
                ...ratings,
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });
    
            console.log("Request Sent Successfully", response.data);
            navigation.navigate('Home'); // Navigate to the "Home" screen
            setShowModal(true); // Show modal upon successful submission
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    // Function to check if any rating is empty
    const isAnyRatingEmpty = () => {
        for (const key in ratings) {
            if (ratings[key] === '') {
                return true;
            }
        }
        return false;
    };

    const [showmodal, setShowModal] = useState(false);

    const handleClosePDF = () => {
        setShowModal(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 }}>
                            Research and Extension Services Customer Satisfaction Survey Form
                        </Text>
                        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>
                            As you proceed, kindly indicate your choice by selecting the radio button that corresponds to your answer.
                        </Text>

                        <RatingQuestion
                            question="How would you rate your overall satisfaction with the quality of our service delivery?"
                            ratingName="rating1"
                            value={ratings.rating1}
                            onValueChange={handleRatingChange}
                        />
                        <RatingQuestion
                            question="How satisfied were you with the response time to your transaction given by our office?"
                            ratingName="rating2"
                            value={ratings.rating2}
                            onValueChange={handleRatingChange}
                        />
                        <RatingQuestion
                            question="How satisfied were you with the outcome of the service provided?"
                            ratingName="rating3"
                            value={ratings.rating3}
                            onValueChange={handleRatingChange}
                        />
                        <RatingQuestion
                            question="How satisfied were you with our provision of information on the service?"
                            ratingName="rating4"
                            value={ratings.rating4}
                            onValueChange={handleRatingChange}
                        />
                        <RatingQuestion
                            question="How satisfied were you with our competence or skill in service delivery?"
                            ratingName="rating5"
                            value={ratings.rating5}
                            onValueChange={handleRatingChange}
                        />
                        <RatingQuestion
                            question="How satisfied were you with our courtesy, friendliness, politeness, fair treatment, and willingness to do more than what is expected?"
                            ratingName="rating6"
                            value={ratings.rating6}
                            onValueChange={handleRatingChange}
                        />

                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                                <TouchableOpacity onPress={() => setRatings({
                                    rating1: '',
                                    rating2: '',
                                    rating3: '',
                                    rating4: '',
                                    rating5: '',
                                    rating6: '',
                                })} style={{ backgroundColor: '#f0f0f0', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 }}>
                                    <Text style={{ color: 'maroon', fontSize: 16 }}>Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={sendRequest} disabled={isAnyRatingEmpty()} style={{ backgroundColor: isAnyRatingEmpty() ? '#ccc' : 'maroon', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 }}>
                                    <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={showmodal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleClosePDF}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={handleClosePDF} style={styles.closeButtons}>
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="check-circle" size={100} color="green" />
                            <Text style={[styles.successText, { marginLeft: 10 }]}>Thank you for your feedback! We are glad you had a positive experience. Your input is valued, and we're committed to improving. Have a great day!</Text>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const RatingQuestion = ({ question, ratingName, value, onValueChange }) => {
    return (
        <View style={{ paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 10, fontSize: 18, color: '#333' }}>{question}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <RadioBtn
                        key={rating}
                        selected={value === rating.toString()}
                        onPress={() => onValueChange(ratingName, rating.toString())}
                        label={rating.toString()}
                    />
                ))}
            </View>
        </View>
    );
};

const RadioBtn = ({ selected, onPress, label }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: selected ? 'maroon' : '#aaa', justifyContent: 'center', alignItems: 'center' }}>
                {selected && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'maroon' }} />}
            </View>
            <Text style={{ marginLeft: 10, fontSize: 16, color: '#333' }}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
})

export default CustomerSatisfactionSurveyFormSecondPage;
