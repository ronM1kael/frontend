import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';

const CommunitySurveyForm = (props) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [status, setStatus] = useState('');
    const [sex, setSex] = useState('');
    const [phone, setPhone] = useState('');
    const [education_level, setEducationLevel] = useState('');
    const [employment, setEmployment] = useState('');
    const [employment_state, setEmploymentState] = useState('');
    const [training1, setTraining1] = useState('');
    const [training2, setTraining2] = useState('');
    const [training3, setTraining3] = useState('');

    const navigation = useNavigation();

    const request = props.route.params ? props.route.params.request : null;

    const handleSubmit = () => {
        const formData = {
            name,
            address,
            age,
            status,
            sex,
            phone,
            education_level,
            employment,
            employment_state,
            training1,
            training2,
            training3
        };

        // Here you can use formData for further processing, like sending it to an API or navigating to the next page
        console.log(formData);
        navigation.navigate("SecondPage2", { formData });
    };

    const handleReset = () => {
        // Reset all state variables to initial values
        setName('');
        setAddress('');
        setAge('');
        setStatus('');
        setSex('');
        setPhone('');
        setEducationLevel('');
        setEmployment('');
        setEmploymentState('');
        setTraining1('');
        setTraining2('');
        setTraining3('');
    };

    return (
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

            <View style={styles.labelContainer}>
                <Text style={styles.label}>1.) Name (Pangalan):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>2.) Address (Tirahan):</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Your Address"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                />
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>3.) Age (Edad):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.label}>4.) Status</Text>
                    <View style={styles.pickerContainers}>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="--- Select ---" value="" />
                            <Picker.Item label="Single" value="single" />
                            <Picker.Item label="Married" value="married" />
                        </Picker>
                    </View>
                </View>
                {/* Add space between pickers */}
                <View style={{ width: 20 }} />
                <View style={styles.pickerWrapper}>
                    <Text style={styles.label}>5.) Sex (Kasarian)</Text>
                    <View style={styles.pickerContainers}>
                        <Picker
                            selectedValue={sex}
                            onValueChange={(itemValue, itemIndex) => setSex(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="--- Select ---" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>6.) Contact Number (Telepono):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Contact Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.label}>7.) Education Level (Antas ng Pinagaralan):</Text>
                    <View style={styles.pickerContainers}>
                        <Picker
                            style={styles.input}
                            selectedValue={education_level}
                            onValueChange={(itemValue, itemIndex) => setEducationLevel(itemValue)}
                        >
                            <Picker.Item label="--- Select ---" value="" />
                            <Picker.Item label="Didn't finish elementary school" value="didn't_finish_elementary" />
                            <Picker.Item label="Finished elementary school" value="finished_elementary" />
                            <Picker.Item label="Didn't finish high school" value="didn't_finish_high_school" />
                            <Picker.Item label="Finished high school" value="finished_high_school" />
                            <Picker.Item label="Didn't finish vocational" value="didn't_finish_vocational" />
                            <Picker.Item label="Finished vocational course" value="finished_vocational" />
                            <Picker.Item label="Didn't finish college" value="didn't_finish_college" />
                            <Picker.Item label="Finished college" value="finished_college" />
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>8.) Have a current job? If none continue to #10 (May kasalukuyang trabaho? Kung wala magpatuloy sa #10)</Text>
                <View style={styles.radioButtonContainer}>
                    <TouchableOpacity onPress={() => setEmployment('There is')} style={[styles.radioButton, { marginRight: 20 }]}>
                        <Text style={{ marginRight: 5 }}>There is (Meron)</Text>
                        {employment === 'There is' && <View style={styles.radioSelected} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEmployment('None')} style={styles.radioButton}>
                        <Text>None (Wala)</Text>
                        {employment === 'None' && <View style={styles.radioSelected} />}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>9.) State of employment (Estado ng pagtratrabaho)</Text>
                <View style={styles.radioButtonContainer}>
                    <TouchableOpacity onPress={() => setEmploymentState('Permanent')} style={[styles.radioButton, { marginRight: 20 }]}>
                        <Text style={{ marginRight: 5 }}>Permanent</Text>
                        {employment_state === 'Permanent' && <View style={styles.radioSelected} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEmploymentState('Not permanent')} style={[styles.radioButton, { marginRight: 20 }]}>
                        <Text style={{ marginRight: 5 }}>Not permanent</Text>
                        {employment_state === 'Not permanent' && <View style={styles.radioSelected} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEmploymentState('Contractual')} style={styles.radioButton}>
                        <Text>Contractual</Text>
                        {employment_state === 'Contractual' && <View style={styles.radioSelected} />}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>10.) Have you had technical trainings? If available, provide the last three technical trainings obtained (Kayo po ba ay nagkaroon nang mga teknikal trainings? Kung meron magbigay ng huling tatlong nakuha teknikal training):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Training1"
                    value={training1}
                    onChangeText={setTraining1}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Training2"
                    value={training2}
                    onChangeText={setTraining2}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Training3"
                    value={training3}
                    onChangeText={setTraining3}
                />
            </View>

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReset} style={[styles.button, styles.resetButton]}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerContainers: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    picker: {
        paddingVertical: 10, // Adjust as needed
    },
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
        marginLeft: 5,
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
    labelContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    pickerWrapper: {
        flex: 1,
        marginBottom: 20,
    },
});

export default CommunitySurveyForm;
