import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CertificationSteps = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How can your application be certified?</Text>
      
      <Text style={styles.step}>Step 1:</Text>
      <Text>- Select the <Text style={[styles.maroonText, styles.step]}>{"My Application"}</Text> tab and upload the files that you would like certified. Make sure the files you upload are only 10 MB in size and are only in PDF format.</Text>
      
      <Text style={styles.step}>Step 2:</Text>
      <Text>- Next select the <Text style={[styles.maroonText, styles.step]}>{"Certification"}</Text>, where you will find the file you uploaded. Click on Apply Certification and complete all of the required fields. If your application is marked as "Returned", simply click "Re-Apply" and send in your revised application.</Text>
      
      <Text style={styles.step}>Step 3:</Text>
      <Text>- Right now, your application is being considered. Please wait for a staff member or administrator to process it. Under the "Application Status" tab, you can see its current state. After the procedure is over, it will email you or alert the system itself.</Text>

      <Text style={styles.footer}>Thank you for choosing R&E-Services! We're grateful for your support. We're here to help, so feel free to reach out anytime. We look forward to serving you again soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  step: {
    marginTop: 10,
  },
  maroonText: {
    color: 'maroon',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default CertificationSteps;
