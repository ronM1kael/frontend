import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";

const CustomerSatisfactionSurveyForm = (props) => {

    const [email, setEmail] = useState('');
    const [rated_department, setRatedDepartment] = useState('');
    const [transaction_purpose, setTransactionPurpose] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [facilitator, setFacilitator] = useState('');
    const [name, setName] = useState('');
    const [email_address, setEmailAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [company, setCompany] = useState('');
    const [customer_feedback, setCustomerFeedback] = useState('');
    const [customer_remarks, setCustomerRemarks] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [allInputsFilled, setAllInputsFilled] = useState(false);

    const formatDateForDatabase = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    };

    useEffect(() => {
        // Check if all required fields are filled
        const areAllInputsFilled = !!email && !!rated_department && !!transaction_purpose && !!email_address && !!phone && !!address && !!company && !!customer_feedback && !!customer_remarks;
        setAllInputsFilled(areAllInputsFilled);
    }, [email, rated_department, transaction_purpose, email_address, phone, address, company, customer_feedback, customer_remarks]);

    const handleReset = () => {
        // Reset form fields here
        setEmail('');
        setRatedDepartment('');
        setTransactionPurpose('');
        setFacilitator('');
        setName('');
        setEmailAddress('');
        setPhone('');
        setAddress('');
        setCompany('');
        setCustomerFeedback('');
        setCustomerRemarks('');
    };

    const request = props.route.params ? props.route.params.request : null;
    const navigation = useNavigation();

    const handleSubmit = () => {
        // Check if any required field is empty
        if (!email || !rated_department || !transaction_purpose || !email_address || !phone || !address || !company || !customer_feedback || !customer_remarks) {
            // Show toast message
            alert('Please fill all required fields');
            return; // Prevent further execution
        }

        const formData = {
            email,
            rated_department,
            transaction_purpose,
            date: formatDateForDatabase(date),
            time: time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            facilitator,
            name,
            email_address,
            phone,
            address,
            company,
            customer_feedback,
            customer_remarks,
        };

        // Here you can use formData for further processing, like sending it to an API or navigating to the next page
        console.log(formData);

        // For example, if you want to navigate to the next page with the form data
        navigation.navigate("SecondPage", { formData });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 }}>
                Research and Extension Services Customer Satisfaction Survey Form
            </Text>
            <Text style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>
                As you proceed, kindly indicate your choice by selecting the radio button that corresponds to your answer.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            {/* Department Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    selectedValue={rated_department}
                    onValueChange={itemValue => setRatedDepartment(itemValue)}>
                    <Picker.Item label="--- Select Department ---" value="" />
                    <Picker.Item label="Research and Development Services" value="Research and Development Services" />
                    <Picker.Item label="Community Extension Services" value="Community Extension Services" />
                    <Picker.Item label="Innovation and Technology Support Office" value="Innovation and Technology Support Office" />
                </Picker>
            </View>

            {/* Transaction Purpose Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    selectedValue={transaction_purpose}
                    onValueChange={itemValue => setTransactionPurpose(itemValue)}>
                    <Picker.Item label="--- Select Purpose ---" value="" />
                    <Picker.Item label="Consultation / Assistance" value="Consultation / Assistance" />
                    <Picker.Item label="Technology transfer / Patent / Intellectual Property" value="Technology transfer / Patent / Intellectual Property" />
                    <Picker.Item label="Certificate of Similarity" value="Certificate of Similarity" />
                    <Picker.Item label="Submit document / Terminal report / Certifying document" value="Submit document / Terminal report / Certifying document" />
                </Picker>
            </View>

            {/* Date Picker */}
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}>
                <Text>{formatDateForDatabase(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        setDate(selectedDate || date);
                    }}
                />
            )}

            {/* Time Picker */}
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowTimePicker(true)}>
                <Text>{time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(Platform.OS === 'ios');
                        setTime(selectedTime || time);
                    }}
                />
            )}

            {/* Facilitator Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    selectedValue={facilitator}
                    onValueChange={itemValue => setFacilitator(itemValue)}>
                    <Picker.Item label="--- Select Facilitator ---" value="" />
                    <Picker.Item label="Macapagal, Laarnie" value="Macapagal, Laarnie" />
                    <Picker.Item label="Santos, Rico" value="Santos, Rico" />
                    <Picker.Item label="Camento, Ma. Victoria" value="Camento, Ma. Victoria" />
                    <Picker.Item label="Morgado, Jane" value="Morgado, Jane" />
                    <Picker.Item label="Africa, Ramil" value="Africa, Ramil" />
                    <Picker.Item label="Salve, Maureen" value="Salve, Maureen" />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Your Name (Optional)"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email_address}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />

            <TextInput
                style={styles.input}
                placeholder="Company/Office"
                value={company}
                onChangeText={setCompany}
            />

            {/* Customer Feedback Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    selectedValue={customer_feedback}
                    onValueChange={itemValue => setCustomerFeedback(itemValue)}>
                    <Picker.Item label="--- Select Feedback Type ---" value="" />
                    <Picker.Item label="Compliment" value="Compliment" />
                    <Picker.Item label="Complaint" value="Complaint" />
                    <Picker.Item label="Suggestion" value="Suggestion" />
                </Picker>
            </View>

            {/* Customer Remarks Input */}
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write your remarks/feedback"
                value={customer_remarks}
                onChangeText={setCustomerRemarks}
                multiline
            />

            {/* Buttons */}
            <TouchableOpacity onPress={handleReset} style={styles.button}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, { backgroundColor: allInputsFilled ? 'maroon' : '#adb5bd' }]}
                disabled={!allInputsFilled}>
                <Text style={[styles.buttonText, { color: allInputsFilled ? 'white' : '#212529' }]}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'maroon',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 48,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    picker: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        marginBottom: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#adb5bd',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#212529',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        marginBottom: 20,
    }
});

export default CustomerSatisfactionSurveyForm;
