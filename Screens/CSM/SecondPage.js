import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

const RadioButton = ({ selected, onSelect, label }) => (
  <View style={styles.radioOption}>
    <View style={styles.radioButton}>
      {selected ? <View style={styles.radioButtonInner} /> : null}
    </View>
    <Text style={styles.radioLabel} onPress={onSelect}>
      {label}
    </Text>
  </View>
);

const YourComponent = () => {
  const [cc1, setCc1] = useState('');

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Form submitted!');
  };

  const handleReset = () => {
    // Reset form fields here
    setCc1('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Client Satisfaction Measurement (CSM)</Text>
      <Text style={styles.description}>
        We would like to know what you think about the services TUP-Taguig provides, so we can make sure we are meeting
        your needs and improve our work. All personal information you provided and your responses will remain
        confidential and anonymous, and shall be disclosed only to the extent authorized by law. Thank you for your
        time!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>INSTRUCTION: Mark check your answer to the Citizen's Charter (CC) questions</Text>
        <View style={styles.formGroup}>
          <Text style={styles.legend}>CC1: Do you know about the Citizen's Charter (document of an agency's services and reqs.)?</Text>
          <RadioButton
            label="Yes, I am aware before my transaction with this office."
            selected={cc1 === "Yes, I am aware before my transaction with this office."}
            onSelect={() => setCc1("Yes, I am aware before my transaction with this office.")}
          />
          <RadioButton
            label="Yes, but I am aware only when I saw the CC of this office."
            selected={cc1 === "Yes, but I am aware only when I saw the CC of this office."}
            onSelect={() => setCc1("Yes, but I am aware only when I saw the CC of this office.")}
          />
          <RadioButton
            label="No, I am not aware of the CC"
            selected={cc1 === "No, I am not aware of the CC"}
            onSelect={() => setCc1("No, I am not aware of the CC")}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit} title="Next" />
        <Button onPress={handleReset} title="Reset" />
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
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  legend: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default YourComponent;
