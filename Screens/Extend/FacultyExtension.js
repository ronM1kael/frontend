import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
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
import Icon from "react-native-vector-icons/FontAwesome";
import Notification from './Notification';
import ImplementationProper from './ImplementationProper';

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
  const [showImplementationProper, setShowImplementationProper] = useState(false);
  const context = useContext(AuthGlobal);

  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [showProposalNotification, setShowProposalNotification] = useState({
    proposal1: false,
    proposal2: false,
    proposal3: false,
    proposal4: false,
    proposal5: false,
    proposal6: false,
    proposal7: false,
    proposal8: false,
    proposal9: false,
    proposal10: false,
    proposal11: false,
    proposal12: false,
  });

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
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Application created successfully!",
        });
        setShowCreateForm(false); // Hide the create form after successful creation
        fetchApplications(); // Fetch applications again to update the list
      } else {
        setErrorMessage('Failed to create application');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the application');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchApplications();
    }, [fetchApplications])
  );

  const fetchApplications = useCallback(async () => {
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
  }, [context.stateUser.userProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApplications();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [fetchApplications]);

  const submitProposal = async (id) => {
    setSelectedApplicationId(id);
    setShowAppointmentProposal(true);
  };

  const ProposalApprovedByBoardandOSG = async (id) => {
    setSelectedApplicationId(id);
    setShowImplementationProper(true);
  };

  const PendingAppointmentProposal = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal1: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal1: false }), 2000); // Close proposal notification after 2 seconds
  };

  const AppointmentProposalSet = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal2: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal2: false }), 2000); // Close proposal notification after 2 seconds
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
    setShowProposalNotification({ ...showProposalNotification, proposal3: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal3: false }), 2000); // Close proposal notification after 2 seconds

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

  const PendingApprovalDOUESPresident = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal4: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal4: false }), 2000); // Close proposal notification after 2 seconds
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

  const PendingApprovalofBoardOSG = (id) => {
    setShowProposalNotification({ ...showProposalNotification, proposal5: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal5: false }), 2000); // Close proposal notification after 2 seconds
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

  const PendingApprovalforImplementationProperAppointment = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal6: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal6: false }), 2000); // Close proposal notification after 2 seconds
  };

  const AppointmentSetforImplementationProper = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal7: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal7: false }), 2000); // Close proposal notification after 2 seconds
  };

  const ImplementationProperAppointmentCancelled = async (id) => {
    setSelectedApplicationId(id);
    setShowImplementationProper(true);
    setTimeout(() => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Sorry, appointment cancelled.",
        text2: "Please reschedule.",
      });
    }, 500); // Adjust the delay as needed
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
    setShowProposalNotification({ ...showProposalNotification, proposal8: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal8: false }), 2000); // Close proposal notification after 2 seconds
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
    setShowProposalNotification({ ...showProposalNotification, proposal9: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal9: false }), 2000); // Close proposal notification after 2 seconds
  };

  const submitProposalMID = async (id) => {
    // Implement proposal submission logic here
    setSelectedApplicationId(id);
    setShowAppointmentProposalMID(true);
  };

  const PendingApprovalforMidSurveyConsultationAppointment = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal10: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal10: false }), 2000); // Close proposal notification after 2 seconds
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
    setShowProposalNotification({ ...showProposalNotification, proposal11: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal11: false }), 2000); // Close proposal notification after 2 seconds
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

  const toggleCreateForm = () => {
    setShowCreateForm(prevState => !prevState); // Toggle the state
    setTitle(''); // Reset the title when closing the form
  };
  const ProcessDone = async () => {
    setShowProposalNotification({ ...showProposalNotification, proposal12: true });
    setTimeout(() => setShowProposalNotification({ ...showProposalNotification, proposal12: false }), 2000); // Close proposal notification after 2 seconds
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
              <View style={styles.statusContainer}>
                <Icon name="bookmark" size={20} color="maroon" style={styles.icon} />
                <Text style={styles.statusText}>{application.status}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${application.percentage_status}%` }]}>
                  <Text style={styles.progressText}>{application.percentage_status}%</Text>
                </View>
              </View>
              {application.status == 'New Application' ? (
                <TouchableOpacity
                  onPress={() => submitProposal(application.id)}
                  disabled={application.status !== 'New Application'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval for Proposal Consultation Appointment' ? (
                <TouchableOpacity
                  onPress={PendingAppointmentProposal}
                  disabled={application.status !== 'Pending Approval for Proposal Consultation Appointment'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Set for Proposal Consultation' ? (
                <TouchableOpacity
                  onPress={AppointmentProposalSet}
                  disabled={application.status !== 'Appointment Set for Proposal Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Done for Proposal Consultation' ? (
                <TouchableOpacity
                  onPress={() => submitProposal1(application.id)}
                  disabled={application.status !== 'Appointment Done for Proposal Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Proposal Consultation Appointment Cancelled' ? (
                <TouchableOpacity
                  onPress={() => submitProposalAppointmentCancelled(application.id)}
                  disabled={application.status !== 'Proposal Consultation Appointment Cancelled'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval of R&E Office' ? (
                <TouchableOpacity
                  onPress={() => PendingApprovalofREOffice()}
                  disabled={application.status !== 'Pending Approval of R&E Office'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Proposal Approved by R&E Office' ? (
                <TouchableOpacity
                  onPress={() => submitProposal2(application.id)}
                  disabled={application.status !== 'Proposal Approved by R&E Office'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Proposal Rejected by R&E Office' ? (
                <TouchableOpacity
                  onPress={() => submitProposal1RejectedbyREOffice(application.id)}
                  disabled={application.status !== 'Proposal Rejected by R&E Office'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval of DO, UES and President' ? (
                <TouchableOpacity
                  onPress={() => PendingApprovalDOUESPresident()}
                  disabled={application.status !== 'Pending Approval of DO, UES and President'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval of DO' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalDO()}
                  disabled={application.status !== 'Pending Approval of DO'}
                />
              ) : application.status == 'Proposal Rejected By DO' ? (
                <TouchableOpacity
                  onPress={() => submitProposal2ProposalRejectedByDO(application.id)}
                  disabled={application.status !== 'Proposal Rejected By DO'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Proposal Approval By UES' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingProposalApprovalByUES()}
                  disabled={application.status !== 'Pending Proposal Approval By UES'}
                />
              ) : application.status == 'Proposal Rejected By UES' ? (
                <TouchableOpacity
                  onPress={() => submitProposal2ProposalRejectedByUES(application.id)}
                  disabled={application.status !== 'Proposal Rejected By UES'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Proposal Approval By President' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingProposalApprovalByPresident(application.id)}
                  disabled={application.status !== 'Pending Proposal Approval By President'}
                />
              ) : application.status == 'Proposal Approved By DO, UES and President' ? (
                <TouchableOpacity
                  onPress={() => submitProposal3(application.id)}
                  disabled={application.status !== 'Proposal Approved By DO, UES and President'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Proposal Rejected By President' ? (
                <TouchableOpacity
                  onPress={() => ProposalRejectedByPresident(application.id)}
                  disabled={application.status !== 'Proposal Rejected By President'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval of Board and OSG' ? (
                <TouchableOpacity
                  onPress={() => PendingApprovalofBoardOSG()}
                  disabled={application.status !== 'Pending Approval of Board and OSG'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval of Board' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingApprovalofBoard()}
                  disabled={application.status !== 'Pending Approval of Board'}
                />
              ) : application.status == 'Proposal Rejected By Board' ? (
                <TouchableOpacity
                  onPress={() => submitProposal2ProposalRejectedByBoard(application.id)}
                  disabled={application.status !== 'Proposal Rejected By Board'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Proposal Approval By OSG' ? (
                <Button
                  title="Submit Proposal"
                  onPress={() => PendingProposalApprovalByOSG()}
                  disabled={application.status !== 'Pending Proposal Approval By OSG'}
                />
              ) : application.status == 'Proposal Rejected By OSG' ? (
                <TouchableOpacity
                  onPress={() => submitProposal2ProposalRejectedByOSG(application.id)}
                  disabled={application.status !== 'Proposal Rejected By OSG'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Proposal Approved By Board and OSG' ? (
                <TouchableOpacity
                  onPress={() => ProposalApprovedByBoardandOSG(application.id)}
                  disabled={application.status !== 'Proposal Approved By Board and OSG'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval for Implementation Proper Appointment' ? (
                <TouchableOpacity
                  onPress={PendingApprovalforImplementationProperAppointment}
                  disabled={application.status !== 'Pending Approval for Implementation Proper Appointment'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Implementation Proper Appointment Cancelled' ? (
                <TouchableOpacity
                  onPress={() => ImplementationProperAppointmentCancelled(application.id)}
                  disabled={application.status !== 'Implementation Proper Appointment Cancelled'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Set for Implementation Proper' ? (
                <TouchableOpacity
                  onPress={AppointmentSetforImplementationProper}
                  disabled={application.status !== 'Appointment Set for Implementation Proper'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
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
              ) : application.status == 'Appointment Done for Implementation Proper' ? (
                <TouchableOpacity
                  onPress={() => submitProposal5(application.id)}
                  disabled={application.status !== 'Appointment Done for Implementation Proper'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Topics and Sub Topics Inputted' ? (
                <TouchableOpacity
                  onPress={() => submitProposalPRE(application.id)}
                  disabled={application.status !== 'Topics and Sub Topics Inputted'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval for Pre-Survey Consultation Appointment' ? (
                <TouchableOpacity
                  onPress={() => PendingApprovalforPreSurveyConsultationAppointment()}
                  disabled={application.status !== 'Pending Approval for Pre-Survey Consultation Appointment'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Cancelled for Pre-Survey Consultation' ? (
                <TouchableOpacity
                  onPress={() => AppointmentCancelledforPreSurveyConsultation(application.id)}
                  disabled={application.status !== 'Appointment Cancelled for Pre-Survey Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Set for Pre-Survey Consultation' ? (
                <TouchableOpacity
                  onPress={() => AppointmentSetforPreSurveyConsultation()}
                  disabled={application.status !== 'Appointment Set for Pre-Survey Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Done for Pre-Survey Consultation' ? (
                <TouchableOpacity
                  onPress={() => submitProposalMID(application.id)}
                  disabled={application.status !== 'Appointment Done for Pre-Survey Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Pending Approval for Mid-Survey Consultation Appointment' ? (
                <TouchableOpacity
                  onPress={() => PendingApprovalforMidSurveyConsultationAppointment()}
                  disabled={application.status !== 'Pending Approval for Mid-Survey Consultation Appointment'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Cancelled for Mid-Survey Consultation' ? (
                <TouchableOpacity
                  onPress={() => AppointmentCancelledforMidSurveyConsultation(application.id)}
                  disabled={application.status !== 'Appointment Cancelled for Mid-Survey Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Set for Mid-Survey Consultation' ? (
                <TouchableOpacity
                  onPress={() => AppointmentSetforMidSurveyConsultation()}
                  disabled={application.status !== 'Appointment Set for Mid-Survey Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Appointment Done for Mid-Survey Consultation' ? (
                <TouchableOpacity
                  onPress={() => submitProposal6(application.id)}
                  disabled={application.status !== 'Appointment Done for Mid-Survey Consultation'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Inserted: Certificate, Documentation, Attendance, and Capsule Details' ? (
                <TouchableOpacity
                  onPress={() => submitProposal7(application.id)}
                  disabled={application.status !== 'Inserted: Certificate, Documentation, Attendance, and Capsule Details'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Have Prototype: Letter, NDA, COA Inserted' ? (
                <TouchableOpacity
                  onPress={() => submitProposal8(application.id)}
                  disabled={application.status !== 'Have Prototype: Letter, NDA, COA Inserted'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Prototype Pre-Evaluation Survey Not Done' ? (
                <TouchableOpacity
                  onPress={() => submitProposal8(application.id)}
                  disabled={application.status !== 'Prototype Pre-Evaluation Survey Not Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Prototype Pre-Evaluation Survey Done' ? (
                <TouchableOpacity
                  onPress={() => submitProposal9(application.id)}
                  disabled={application.status !== 'Prototype Pre-Evaluation Survey Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Prototype Mid-Evaluation Survey Not Done' ? (
                <TouchableOpacity
                  onPress={() => submitProposal9(application.id)}
                  disabled={application.status !== 'Prototype Mid-Evaluation Survey Not Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Prototype Mid-Evaluation Survey Done' ? (
                <TouchableOpacity
                  onPress={() => submitProposal10(application.id)}
                  disabled={application.status !== 'Prototype Mid-Evaluation Survey Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Prototype Post-Evaluation Survey Done' ? (
                <TouchableOpacity
                  onPress={() => submitProposal11(application.id)}
                  disabled={application.status !== 'Prototype Post-Evaluation Survey Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : application.status == 'Process Done' ? (
                <TouchableOpacity
                  onPress={() => ProcessDone()}
                  disabled={application.status !== 'Process Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => submitProposal10(application.id)}
                  disabled={application.status !== 'Prototype Post-Evaluation Survey Not Done'}
                  style={styles.proposalButton}
                >
                  <Text style={styles.buttonTextproposal}>Submit Proposal</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No applications found.</Text>
          </View>
        )}
      </ScrollView>

      {showProposalNotification.proposal1 && <Notification message="Please wait to approve your appointment" />}
      {showProposalNotification.proposal2 && <Notification message="Proposal consultation appointment is ongoing please wait to proceed to next step." />}
      {showProposalNotification.proposal3 && <Notification message="This proposal is currently undergoing approval of R&E Office." />}
      {showProposalNotification.proposal4 && <Notification message="This application is pending of approval of DO, UES and President; Please wait the result." />}
      {showProposalNotification.proposal5 && <Notification message="This application is pending of approval of Board and OSG, Please wait the result." />}
      {showProposalNotification.proposal6 && <Notification message="This application is pending of approval for implementation proper appointment, Please wait the result." />}
      {showProposalNotification.proposal7 && <Notification message="Implementation proper appointment is ongoing please wait to proceed to next step." />}
      {showProposalNotification.proposal8 && <Notification message="Appointment for Pre-Survey Consultation is Pending; Please wait the approval to proceed in next step." />}
      {showProposalNotification.proposal9 && <Notification message="Appointment for Pre-Seurvey Consultation is Ongoing; Please wait to be done to process the next step." />}
      {showProposalNotification.proposal10 && <Notification message="Appointment for Mid-Survey Consultation is Pending; Please wait the approval to proceed in next step." />}
      {showProposalNotification.proposal11 && <Notification message="Appointment for Mid-Survey Consultation is Pending; Please wait the approval to proceed in next step." />}
      {showProposalNotification.proposal12 && <Notification message="This application is already completed." />}

      <View>
        <View style={{ backgroundColor: 'black', padding: 10, borderRadius: 5 }}>
          <Button
            title={showCreateForm ? "Create Application" : "Create Application"}
            onPress={toggleCreateForm}
            color="#333" // Dark grey text color
            style={{ fontSize: 18, fontWeight: 'bold', borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}
          />
        </View>

        {showCreateForm && (
          <View style={styles.createFormContainer}>
            <Text style={[styles.formTitle, styles.leftAlign]}>Create an Application</Text>
            <TextInput
              style={styles.input}
              placeholder="Application Title"
              value={title}
              onChangeText={setTitle}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.blackButtons} onPress={handleCreateApplication}>
                <Text style={styles.buttonTexts}>Create</Text>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
            </View>
          </View>
        )}
      </View>

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

      <ImplementationProper
        visible={showImplementationProper}
        closeModal={() => setShowImplementationProper(false)}
        extensionId={selectedApplicationId}
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
    fontWeight: 'bold',
    color: '#333', // Dark color for better readability
  },
  statusContainer: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center items vertically
    marginRight: 10, // Add margin to the right of the container
  },
  icon: {
    marginRight: 5, // Add margin to the right of the icon
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    fontStyle: 'italic',
    color: '#888', // Lighter color for a subdued look
    textAlign: 'right', // Align text to the right
  },
  progressBarContainer: {
    height: 40,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    justifyContent: 'center',
  },

  progressText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
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
    marginTop: 20, // Added margin to the top
  },
  formTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  leftAlign: {
    textAlign: 'left', // Align to the left
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  blackButtons: {
    backgroundColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonTexts: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  proposalButton: {
    backgroundColor: '#333', // Black background
    borderRadius: 8, // Rounded corners
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: 'center', // Center the button horizontally
  },
  buttonTextproposal: {
    color: '#FFF', // White text color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExtensionApplication;
