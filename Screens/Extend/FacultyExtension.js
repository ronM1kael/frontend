import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import axios from 'axios'; // Import axios library
import AppointmentProposal from '../Extend/AppointmentProposal';
import Toast from "react-native-toast-message";
import MOUProposal from '../Extend/MOUProposal';
import Proposal2 from '../Extend/Proposal2';
import Proposal3 from '../Extend/Proposal3';
import Proposal4 from '../Extend/Proposal4';
import Proposal5 from '../Extend/Proposal5';  
import AppointmentProposalPRE from '../Extend/AppointmentProposalPRE';
import AppointmentProposalMID from '../Extend/AppointmentProposalMID';
import Proposal6 from '../Extend/Proposal6'
import Proposal7 from '../Extend/Proposal7';
import Proposal8 from '../Extend/Proposal8';
import Proposal9 from '../Extend/Proposal9';
import Proposal10 from '../Extend/Proposal10';
import Proposal11 from '../Extend/Proposal11';

const ExtensionApplication = () => {
  const [title, setTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAppointmentProposal, setShowAppointmentProposal] = useState(false); // State variable to manage the visibility of the modal
  const [showMOUModal, setShowMOUModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null); // State variable to store the selected application ID
  const [showProposal2Modal, setShowPROPOSAL2Modal] = useState(false);
  const [showProposal3Modal, setShowPROPOSAL3Modal] = useState(false);
  const [showProposal4Modal, setShowPROPOSAL4Modal] = useState(false);
  const [showProposal5Modal, setShowPROPOSAL5Modal] = useState(false);
  const [showAppointmentProposalPRE, setShowAppointmentProposalPRE] = useState(false);
  const [showAppointmentProposalMID, setShowAppointmentProposalMID] = useState(false);
  const [showProposal6Modal, setShowPROPOSAL6Modal] = useState(false);
  const [showProposal7Modal, setShowPROPOSAL7Modal] = useState(false);
  const [showProposal8Modal, setShowPROPOSAL8Modal] = useState(false);
  const [showProposal9Modal, setShowPROPOSAL9Modal] = useState(false);
  const [showProposal10Modal, setShowPROPOSAL10Modal] = useState(false);
  const [showProposal11Modal, setShowPROPOSAL11Modal] = useState(false);
  const context = useContext(AuthGlobal);

  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreateApplication = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      const user_id = userProfile.id;

      const response = await fetch(`${baseURL}extension/mobileapplication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ title, user_id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Application created successfully!');
        setShowCreateForm(false); // Hide the create form after successful creation
        fetchApplications(); // Fetch applications again to update the list
      } else {
        setErrorMessage('Failed to create application');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the application');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      const user_id = userProfile.id;

      const response = await axios.get(`${baseURL}faculty/mobileapplication/${user_id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.data) {
        setApplications(response.data.application);
      } else {
        setErrorMessage('Failed to fetch applications');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching applications');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApplications().then(() => setRefreshing(false));
  }, []);

  const submitProposal = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposal(true);
  };

  const PendingAppointmentProposal = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Please wait to approve your appointment",
    });
  };

  const AppointmentProposalSet = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal consultation appointment is ongoing",
      text2: "Please wait to proceed to next step.",
    });
  };

  const submitProposal1 = (id) => {
    setSelectedApplicationId(id);
    openModal(id); // Open the modal
  };

  const openModal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowMOUModal(true);
  };

  const closeMOUModal = () => {
    setShowMOUModal(false);
  };

  const submitProposalAppointmentCancelled = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposal(true);
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, appointment cancelled.",
        text2: "Please reschedule.",
      });
    }, 500); // Adjust the delay as needed
  };

  const PendingApprovalofREOffice = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal awaiting R&E Office approval.",
    });
  };

  const submitProposal2 = (id) => {
    setSelectedApplicationId(id);
    openProposal2Modal(id); // Open the modal
  };

  const openProposal2Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL2Modal(true);
  };

  const closeProposal2Modal = () => {
    setShowPROPOSAL2Modal(false)
  };

  const submitProposal1RejectedbyREOffice = (id) => {
    setSelectedApplicationId(id);
    openModal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected By R&E Office.",
        text2: "Please resubmit again.",
      });
    }, 500); // Adjust the delay as needed
  };

  const PendingApprovalDO = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "This application is pending of approval of DO",
      text2: "Please wait the result.",
    });
  };

  const submitProposal2ProposalRejectedByDO = (id) => {
    setSelectedApplicationId(id);
    openProposal2Modal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected by DO.",
        text2: "Please resubmit again.",
      });
    }, 500);
  };

  const PendingProposalApprovalByUES = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal awaiting UES approval.",
    });
  };

  const submitProposal2ProposalRejectedByUES = (id) => {
    setSelectedApplicationId(id);
    openProposal2Modal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected by UES.",
        text2: "Please resubmit again.",
      });
    }, 500);
  };

  const PendingProposalApprovalByPresident = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal awaiting President approval.",
    });
  };

  const ProposalRejectedByPresident = (id) => {
    setSelectedApplicationId(id);
    openProposal2Modal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected by President.",
        text2: "Please resubmit again.",
      });
    }, 500);
  };

  const submitProposal3 = (id) => {
    setSelectedApplicationId(id);
    openProposal3Modal(id); // Open the modal
  };

  const openProposal3Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL3Modal(true);
  };

  const closeProposal3Modal = () => {
    setShowPROPOSAL3Modal(false)
  };

  const PendingApprovalofBoard = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal awaiting Board approval.",
    });
  };

  const submitProposal2ProposalRejectedByBoard = (id) => {
    setSelectedApplicationId(id);
    openProposal2Modal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected by Board.",
        text2: "Please resubmit again.",
      });
    }, 500);
  };

  const PendingProposalApprovalByOSG = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal awaiting OSG approval.",
    });
  };

  const submitProposal2ProposalRejectedByOSG = (id) => {
    setSelectedApplicationId(id);
    openProposal2Modal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected by OSG.",
        text2: "Please resubmit again.",
      });
    }, 500);
  };

  const submitProposal4 = (id) => {
    setSelectedApplicationId(id);
    openProposal4Modal(id); // Open the modal
  };

  const openProposal4Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL4Modal(true);
  };

  const closeProposal4Modal = () => {
    setShowPROPOSAL4Modal(false);
  };

  const PendingImplementationApprovalbyREOffice = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Proposal awaiting R&E Office approval.",
    });
  };

  const submitProposal4ImplementationRejectedByREOffice = (id) => {
    setSelectedApplicationId(id);
    openProposal4Modal(id); // Open the modal
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, Proposal Rejected by R&E Office.",
        text2: "Please resubmit again.",
      });
    }, 500);
  };

  const submitProposal5 = (id) => {
    setSelectedApplicationId(id);
    openProposal5Modal(id); // Open the modal
  };

  const openProposal5Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL5Modal(true);
  };

  const closeProposal5Modal = () => {
    setShowPROPOSAL5Modal(false);
  };

  const submitProposalPRE = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposalPRE(true);
  };

  const PendingApprovalforPreSurveyConsultationAppointment = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Please wait to approve your appointment",
    });
  };

  const AppointmentCancelledforPreSurveyConsultation = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposalPRE(true);
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, appointment cancelled.",
        text2: "Please reschedule.",
      });
    }, 500); // Adjust the delay as needed
  };

  const AppointmentSetforPreSurveyConsultation = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Appointment for Pre-Seurvey Consultation is Ongoing",
      text2: "Please wait to proceed to next step.",
    });
  };

  const submitProposalMID = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposalMID(true);
  };

  const PendingApprovalforMidSurveyConsultationAppointment = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Please wait to approve your appointment",
    });
  };

  const AppointmentCancelledforMidSurveyConsultation = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposalMID(true);
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, appointment cancelled.",
        text2: "Please reschedule.",
      });
    }, 500); // Adjust the delay as needed
  };

  const AppointmentSetforMidSurveyConsultation = async () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Appointment for Mid-Survey Consultation is Ongoing",
      text2: "Please wait to proceed to next step.",
    });
  };

  const submitProposal6 = (id) => {
    setSelectedApplicationId(id);
    openProposal6Modal(id); // Open the modal
  };

  const openProposal6Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL6Modal(true);
  };

  const closeProposal6Modal = () => {
    setShowPROPOSAL6Modal(false)
  };

  const submitProposal7 = (id) => {
    setSelectedApplicationId(id);
    openProposal7Modal(id); // Open the modal
  };

  const openProposal7Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL7Modal(true);
  };

  const closeProposal7Modal = () => {
    setShowPROPOSAL7Modal(false);
  };

  const submitProposal8 = (id) => {
    setSelectedApplicationId(id);
    openProposal8Modal(id); // Open the modal
  };

  const openProposal8Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL8Modal(true);
  };

  const closeProposal8Modal = () => {
    setShowPROPOSAL8Modal(false);
  };

  const submitProposal9 = (id) => {
    setSelectedApplicationId(id);
    openProposal9Modal(id); // Open the modal
  };

  const openProposal9Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL9Modal(true);
  };

  const closeProposal9Modal = () => {
    setShowPROPOSAL9Modal(false);
  };

  const submitProposal10 = (id) => {
    setSelectedApplicationId(id);
    openProposal10Modal(id); // Open the modal
  };

  const openProposal10Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL10Modal(true);
  };

  const closeProposal10Modal = () => {
    setShowPROPOSAL10Modal(false);
  };

  const submitProposal11 = (id) => {
    setSelectedApplicationId(id);
    openProposal11Modal(id); // Open the modal
  };

  const openProposal11Modal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowPROPOSAL11Modal(true);
  };

  const closeProposal11Modal = () => {
    setShowPROPOSAL11Modal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Extension Application</Text>

      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{application.title}</Text>
              <Text style={styles.status}>{application.status}</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${application.percentage_status}%` }]}>
                  <Text style={styles.progressText}>{application.percentage_status}%</Text>
                </View>
              </View>
              {application.status == 'New Application' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal(application.id)}
                  disabled={application.status !== 'New Application'}
                />
              ) : application.status == 'Pending Approval for Proposal Consultation Appointment' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingAppointmentProposal()}
                  disabled={application.status !== 'Pending Approval for Proposal Consultation Appointment'}
                />
              ) : application.status == 'Appointment Set for Proposal Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => AppointmentProposalSet()}
                  disabled={application.status !== 'Appointment Set for Proposal Consultation'}
                />
              ) : application.status == 'Appointment Done for Proposal Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal1(application.id)}
                  disabled={application.status !== 'Appointment Done for Proposal Consultation'}
                />
              ) : application.status == 'Proposal Consultation Appointment Cancelled' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposalAppointmentCancelled(application.id)}
                  disabled={application.status !== 'Proposal Consultation Appointment Cancelled'}
                />
              ) : application.status == 'Pending Approval of R&E Office' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalofREOffice()}
                  disabled={application.status !== 'Pending Approval of R&E Office'}
                />
              ) : application.status == 'Proposal Approved by R&E Office' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal2(application.id)}
                  disabled={application.status !== 'Proposal Approved by R&E Office'}
                />
              ) : application.status == 'Proposal Rejected by R&E Office' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal1RejectedbyREOffice(application.id)}
                  disabled={application.status !== 'Proposal Rejected by R&E Office'}
                />
              ) : application.status == 'Pending Approval of DO' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalDO()}
                  disabled={application.status !== 'Pending Approval of DO'}
                />
              ) : application.status == 'Proposal Rejected By DO' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal2ProposalRejectedByDO(application.id)}
                  disabled={application.status !== 'Proposal Rejected By DO'}
                />
              ) : application.status == 'Pending Proposal Approval By UES' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingProposalApprovalByUES()}
                  disabled={application.status !== 'Pending Proposal Approval By UES'}
                />
              ) : application.status == 'Proposal Rejected By UES' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal2ProposalRejectedByUES(application.id)}
                  disabled={application.status !== 'Proposal Rejected By UES'}
                />
              ) : application.status == 'Pending Proposal Approval By President' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingProposalApprovalByPresident(application.id)}
                  disabled={application.status !== 'Pending Proposal Approval By President'}
                />
              ) : application.status == 'Proposal Approved By President' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal3(application.id)}
                  disabled={application.status !== 'Proposal Approved By President'}
                />
              ) : application.status == 'Proposal Rejected By President' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => ProposalRejectedByPresident(application.id)}
                  disabled={application.status !== 'Proposal Rejected By President'}
                />
              ) : application.status == 'Pending Approval of Board' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalofBoard()}
                  disabled={application.status !== 'Pending Approval of Board'}
                />
              ) : application.status == 'Proposal Rejected By Board' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal2ProposalRejectedByBoard(application.id)}
                  disabled={application.status !== 'Proposal Rejected By Board'}
                />
              ) : application.status == 'Pending Proposal Approval By OSG' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingProposalApprovalByOSG()}
                  disabled={application.status !== 'Pending Proposal Approval By OSG'}
                />
              ) : application.status == 'Proposal Rejected By OSG' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal2ProposalRejectedByOSG(application.id)}
                  disabled={application.status !== 'Proposal Rejected By OSG'}
                />
              ) : application.status == 'Proposal Approved By OSG' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal4(application.id)}
                  disabled={application.status !== 'Proposal Approved By OSG'}
                />
              ) : application.status == 'Pending Implementation Approval by R&E-Office' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingImplementationApprovalbyREOffice()}
                  disabled={application.status !== 'Pending Implementation Approval by R&E-Office'}
                />
              ) : application.status == 'Implementation Rejected By R&E-Office' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal4ImplementationRejectedByREOffice(application.id)}
                  disabled={application.status !== 'Implementation Rejected By R&E-Office'}
                />
              ) : application.status == 'Implementation Approved By R&E-Office' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal5(application.id)}
                  disabled={application.status !== 'Implementation Approved By R&E-Office'}
                />
              ) : application.status == 'Topics and Sub Topics Inputted' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposalPRE(application.id)}
                  disabled={application.status !== 'Topics and Sub Topics Inputted'}
                />
              ) : application.status == 'Pending Approval for Pre-Survey Consultation Appointment' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalforPreSurveyConsultationAppointment()}
                  disabled={application.status !== 'Pending Approval for Pre-Survey Consultation Appointment'}
                />
              ) : application.status == 'Appointment Cancelled for Pre-Survey Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => AppointmentCancelledforPreSurveyConsultation(application.id)}
                  disabled={application.status !== 'Appointment Cancelled for Pre-Survey Consultation'}
                />
              ) : application.status == 'Appointment Set for Pre-Survey Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => AppointmentSetforPreSurveyConsultation()}
                  disabled={application.status !== 'Appointment Set for Pre-Survey Consultation'}
                />
              ) : application.status == 'Appointment Done for Pre-Survey Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposalMID(application.id)}
                  disabled={application.status !== 'Appointment Done for Pre-Survey Consultation'}
                />
              ) : application.status == 'Pending Approval for Mid-Survey Consultation Appointment' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalforMidSurveyConsultationAppointment()}
                  disabled={application.status !== 'Pending Approval for Mid-Survey Consultation Appointment'}
                />
              ) : application.status == 'Appointment Cancelled for Mid-Survey Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => AppointmentCancelledforMidSurveyConsultation(application.id)}
                  disabled={application.status !== 'Appointment Cancelled for Mid-Survey Consultation'}
                />
              ) : application.status == 'Appointment Set for Mid-Survey Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => AppointmentSetforMidSurveyConsultation()}
                  disabled={application.status !== 'Appointment Set for Mid-Survey Consultation'}
                />
              ) : application.status == 'Appointment Done for Mid-Survey Consultation' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal6(application.id)}
                  disabled={application.status !== 'Appointment Done for Mid-Survey Consultation'}
                />
              ) : application.status == 'Inserted: Certificate, Documentation, Attendance, and Capsule Details' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal7(application.id)}
                  disabled={application.status !== 'Inserted: Certificate, Documentation, Attendance, and Capsule Details'}
                />
              ) : application.status == 'Have Prototype: Letter, NDA, COA Inserted' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal8(application.id)}
                  disabled={application.status !== 'Have Prototype: Letter, NDA, COA Inserted'}
                />
              ) : application.status == 'Prototype Pre-Evaluation Survey Not Done' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal8(application.id)}
                  disabled={application.status !== 'Prototype Pre-Evaluation Survey Not Done'}
                />
              ) : application.status == 'Prototype Pre-Evaluation Survey Done' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal9(application.id)}
                  disabled={application.status !== 'Prototype Pre-Evaluation Survey Done'}
                />
              ) : application.status == 'Prototype Mid-Evaluation Survey Not Done' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal9(application.id)}
                  disabled={application.status !== 'Prototype Mid-Evaluation Survey Not Done'}
                />
              ) : application.status == 'Prototype Mid-Evaluation Survey Done' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal10(application.id)}
                  disabled={application.status !== 'Prototype Mid-Evaluation Survey Done'}
                />
              ) : application.status == 'Prototype Post-Evaluation Survey Done' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal11(application.id)}
                  disabled={application.status !== 'Prototype Post-Evaluation Survey Done'}
                />
              ) : (
                <Button
                  title="Submit Proposal"
                  onPress={() => submitProposal10(application.id)}
                  disabled={application.status !== 'Prototype Post-Evaluation Survey Not Done'}
                />
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No applications found.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Create Application"
          onPress={() => setShowCreateForm(true)}
        />
      </View>

      {showCreateForm && (
        <View style={styles.createFormContainer}>
          <Text style={styles.formTitle}>Create an Application</Text>
          <TextInput
            style={styles.input}
            placeholder="Application Title"
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.buttonContainer}>
            <Button title="Create" onPress={handleCreateApplication} />
            <View style={{ width: 10 }} />
            <Button title="Close" onPress={() => setShowCreateForm(false)} />
          </View>
        </View>
      )}

      <AppointmentProposal
        visible={showAppointmentProposal}
        closeModal={() => setShowAppointmentProposal(false)}
        extensionId={selectedApplicationId}
      />

      <MOUProposal
        visible={showMOUModal}
        closeModal={closeMOUModal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal2
        visible={showProposal2Modal}
        closeModal={closeProposal2Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal3
        visible={showProposal3Modal}
        closeModal={closeProposal3Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal4
        visible={showProposal4Modal}
        closeModal={closeProposal4Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal5
        visible={showProposal5Modal}
        closeModal={closeProposal5Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <AppointmentProposalPRE
        visible={showAppointmentProposalPRE}
        closeModal={() => setShowAppointmentProposalPRE(false)}
        extensionId={selectedApplicationId}
      />

      <AppointmentProposalMID
        visible={showAppointmentProposalMID}
        closeModal={() => setShowAppointmentProposalMID(false)}
        extensionId={selectedApplicationId}
      />

      <Proposal6
        visible={showProposal6Modal}
        closeModal={closeProposal6Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal7
        visible={showProposal7Modal}
        closeModal={closeProposal7Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal8
        visible={showProposal8Modal}
        closeModal={closeProposal8Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal9
        visible={showProposal9Modal}
        closeModal={closeProposal9Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal10
        visible={showProposal10Modal}
        closeModal={closeProposal10Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

      <Proposal11
        visible={showProposal11Modal}
        closeModal={closeProposal11Modal} // Ensure closeModal function is passed
        proposalId={selectedApplicationId}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
  },
  progressBar: {
    height: 20,
    backgroundColor: 'green',
    justifyContent: 'center',
  },
  progressText: {
    color: '#fff',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  createFormContainer: {
    width: '80%',
  },
  formTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
});

export default ExtensionApplication;
