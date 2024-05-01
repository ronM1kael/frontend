import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const YourComponent = () => {
    const [email, setEmail] = useState('');
    const [office, setOffice] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [assistedBy, setAssistedBy] = useState('');

    const handleSubmit = () => {
        // Handle form submission here
        console.log('Form submitted!');
    };

    const handleReset = () => {
        // Reset form fields here
        setEmail('');
        setOffice('');
        setDate('');
        setTime('');
        setEmailAddress('');
        setName('');
        setType('');
        setPurpose('');
        setAssistedBy('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Client Satisfaction Measurement (CSM)</Text>
            <Text style={styles.description}>
                We would like to know what you think about the services TUP-Taguig provides, 
                so we can make sure we are meeting your needs and improve our work. 
                All personal information you provided and your responses will remain confidential and anonymous, 
                and shall be disclosed only to the extent authorized by law. Thank you for your time!
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Office Being Rated:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={office}
                    onValueChange={(itemValue, itemIndex) => setOffice(itemValue)}
                >
                    <Picker.Item label="--- Select Office ---" value="" />
                    <Picker.Item label="Extension Office" value="Extension Office" />
                    <Picker.Item label="Research Office" value="Research Office" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Date"
                    value={date}
                    onChangeText={setDate}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Time:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Time"
                    value={time}
                    onChangeText={setTime}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Answer"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name (Optional):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Answer"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Are you a/an?</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={type}
                    onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                >
                    <Picker.Item label="--- Select ---" value="" />
                    <Picker.Item label="Student" value="Student" />
                    <Picker.Item label="Employee" value="Employee" />
                    <Picker.Item label="Alumni" value="Alumni" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Purpose of Transaction:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Answer"
                    value={purpose}
                    onChangeText={setPurpose}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name of specific person who assisted you in your transaction:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Answer"
                    value={assistedBy}
                    onChangeText={setAssistedBy}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button onPress={handleReset} title="Reset" />
                <Button onPress={handleSubmit} title="Next" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
    },
    picker: {
        borderWidth: 1,
        borderColor: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default YourComponent;
