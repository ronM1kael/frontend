import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Alert,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Banner from '../../Shared/Banner';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { addToCartAction } from '../../Context/Actions/cartActions';

import { WebView } from 'react-native-webview';
import baseURL2 from '../../assets/common/baseurlnew';

import Toast from "react-native-toast-message";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import mime from 'mime';

import Icon from "react-native-vector-icons/FontAwesome";

const PropertyContainer = ({ isLoggedIn }) => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [facultydata, setFacultyData] = useState([]);
  const [item, setItem] = useState([]);

  const [showPDF, setShowPDF] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartItems);

  const [returnedModal, setReturnedModal] = useState(false);
  const [pendingTechnical, setPendingTechnical] = useState(false);
  const [Passed, setPassed] = useState(false);

  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const userProfilerole = context.stateUser.userProfile;


  const handleReturnModal = (item) => {
    setItem(item);
    setReturnedModal(true);

  }

  const handlePendingTechnical = () => {
    // setPendingTechnical(true);

    Toast.show({
      topOffset: 60,
      type: "error",
      text1: "The file is waiting for approval of technical adviser.",
    });
  }

  const handlePendingSubject = () => {
    // setPendingTechnical(true);

    Toast.show({
      topOffset: 60,
      type: "error",
      text1: "The file is waiting for approval of subject adviser.",
    });
  }

  const handlePassed = () => {
    // setPendingTechnical(true);

    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "The file is already passed the certification.",
    });
  }

  const handlePending = () => {
    // setPendingTechnical(true);

    Toast.show({
      topOffset: 60,
      type: "error",
      text1: "The file is currently undergoing  for certification.",
    });
  }

  const addToCart = (selectedFile) => {
    dispatch(addToCartAction(selectedFile)); // Dispatch action to add file to cart
  };

  const isInCart = (itemId) => {
    return cartItems.some((cartItem) => cartItem.id === itemId);
  };

  const isCartEmpty = cartItems.length === 0;

  const handlePress = (itemId) => {
    if (!isCartEmpty) {
      return;
    }
    addToCart(itemId);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error('Invalid authentication state or userProfile is missing');
        return;
      }

      const response = await fetch(`${baseURL}myfiles/${userProfile.id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const result = await response.json();
      console.log('Fetched Data:', result);

      if (userProfile.role === 'Student') {
        setData(result.myfiles);
        console.log('Student Data:', result.myfiles);
      } else if (userProfile.role === 'Faculty') {
        setFacultyData(result.facultymyfiles);
        console.log('Faculty Data:', result.facultymyfiles);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
    setTimeout(() => {
      fetchData();
      setRefreshing(false);
    }, 2000);
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled) {
        console.log("Document picking canceled");
      } else if (result.assets && result.assets.length > 0) {
        const pickedAsset = result.assets[0];

        if (pickedAsset.uri) {
          const fileInfo = await FileSystem.getInfoAsync(pickedAsset.uri);

          if (fileInfo) {
            const newUri = FileSystem.documentDirectory + fileInfo.name;

            try {
              await FileSystem.copyAsync({
                from: pickedAsset.uri,
                to: newUri,
              });

              setSelectedFile({
                name: pickedAsset.name,
                uri: newUri,
              });

              handleLargeFile(newUri);

              const fileNameWithoutExtension = pickedAsset.name.replace(/\.[^/.]+$/, '');

              console.log("Document picked:", result);
            } catch (copyError) {
              console.error("Error copying file:", copyError);
            }
          } else {
            console.log("Error getting file info for the picked document");
          }
        } else {
          console.log("Invalid URI for the picked document");
        }
      } else {
        console.log("Document picking failed with unexpected result:", result);
      }
    } catch (err) {
      console.error("Error picking document", err);
    }
  };

  const handleConfirmation = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
  
      if (!selectedFile) {
        console.log("No file selected");
        return;
      }
  
      const formData = new FormData();
      formData.append("research_file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: "application/pdf",
      });
      formData.append("research_id", item.id);
  
      let response;
  
      if (userProfilerole.role === 'Faculty' || userProfilerole.role === 'Staff') {
        response = await axios.post(`${baseURL}mobilereApplyfaculty`, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      } else {
        response = await axios.post(`${baseURL}mobilereApply`, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      }
  
      console.log("File uploaded successfully", response.data);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "File uploaded successfully.",
        text2: "You can now view your file.",
      });
      handleCloseReturnModal(); // Close the modal
      onRefresh(); // Trigger refresh after file upload
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
      Toast.show({
        position: 'bottom',
        bottomOffset: 20,
        type: "error",
        text1: "Error uploading file.",
        text2: "Please try again.",
      });
    }
  };
  

  const requestCameraRollPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        // Use Alert to notify the user if permissions are not granted
        Alert.alert("Camera Roll permission is required to access files.");
      }
    } catch (error) {
      console.error("Error asking for camera roll permission:", error);
    }
  };

  const handleLargeFile = async (uri) => {
    console.log(uri);
    try {
      if (!uri) {
        console.log("Invalid URI for the document");
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (fileInfo) {
        const fileSize = fileInfo.size;

        if (fileSize > 10000000) {
          Alert.alert("File size exceeds the maximum limit.");
          return;
        }
      } else {
        console.log("Error getting file info for the document");
      }
    } catch (error) {
      console.error("Error handling large file:", error);
    }
  };

  const Viewpdf = async (fileName) => {
    try {
      const response = await fetch(`${baseURL}mobileshowpdf/${fileName}`);
      const data = await response.json();
      const base64Content = data.base64Content;
      const uri = `${baseURL2}/uploads/pdf/${fileName}`;
      setPdfFileName(uri);
      setShowPDF(true);
      console.log(uri);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleClosePDF = () => {
    setShowPDF(false);
    setPdfFileName('');
  };

  const handleCloseReturnModal = () => {
    setReturnedModal(false);
  };

  const handleClosePendingTechnical = () => {
    setPendingTechnical(false);
  };

  const renderItem = ({ item }) => (
    <>
      <TouchableOpacity
        onPress={() => {
          Viewpdf(item.research_file); // Assuming each item has a fileName property
        }}
      >
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png',
            }}
            style={styles.image}
          />
          <View style={styles.cardBody}>
            <Text style={styles.price}>{item.research_title}</Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.footerContent}></View>
            {item.file_status === "Returned" || item.file_status === "Rejected By Technical Adviser" || item.file_status === "Rejected By Subject Adviser" ? (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isCartEmpty ? null : styles.disabledButton,
                ]}
                onPress={() => handleReturnModal(item)}
                disabled={!isCartEmpty}
              >
                <Text style={styles.buttonText}>
                  Re-Apply
                </Text>
              </TouchableOpacity>
            ) : item.file_status === "Pending Technical Adviser Approval" ? (
              <TouchableOpacity
                style={[
                  styles.addButton, // Define styles for the new button
                  isCartEmpty ? null : styles.disabledButton,
                ]}
                onPress={() => handlePendingTechnical(item)} // Define the action for the new button
                disabled={!isCartEmpty}
              >
                <Text style={styles.buttonText}>
                  Apply
                </Text>
              </TouchableOpacity>
            ) : item.file_status === "Pending" ? (
              <TouchableOpacity
                style={[
                  styles.addButton, // Define styles for the new button
                  isCartEmpty ? null : styles.disabledButton,
                ]}
                onPress={() => handlePending(item)} // Define the action for the new button
                disabled={!isCartEmpty}
              >
                <Text style={styles.buttonText}>
                  Apply
                </Text>
              </TouchableOpacity>
            ) : item.file_status === "Pending Subject Adviser Approval" ? (
              <TouchableOpacity
                style={[
                  styles.addButton, // Define styles for the new button
                  isCartEmpty ? null : styles.disabledButton,
                ]}
                onPress={() => handlePendingSubject(item)} // Define the action for the new button
                disabled={!isCartEmpty}
              >
                <Text style={styles.buttonText}>
                  Apply
                </Text>
              </TouchableOpacity>
            ) : item.file_status === "Passed" ? (
              <TouchableOpacity
                style={[
                  styles.addButton, // Define styles for the new button
                  isCartEmpty ? null : styles.disabledButton,
                ]}
                onPress={() => handlePassed(item)} // Define the action for the new button
                disabled={!isCartEmpty}
              >
                <Text style={styles.buttonText}>
                  Apply Certification
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isCartEmpty ? null : styles.disabledButton,
                ]}
                onPress={() => handlePress(item)}
                disabled={!isCartEmpty}
              >
                <Text style={styles.buttonText}>
                  {isCartEmpty ? (isInCart(item.id) ? 'Added to Cart' : 'Apply') : 'One request at a time'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  const filteredData = data.filter((item) => {
    return (
      item.research_title &&
      item.research_title.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <>
      <View style={{ height: 250 }}>
        <Banner />
      </View>
      {context.stateUser.isAuthenticated ? (
        <View style={styles.container}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties..."
              onChangeText={handleSearch}
              value={searchText}
            />
          </View>
          {context.stateUser.userProfile.role === 'Student' ? (
            <FlatList
              contentContainerStyle={styles.propertyListContainer}
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={ // Attach RefreshControl to FlatList
                <RefreshControl
                  refreshing={refreshing} // Set refreshing state
                  onRefresh={onRefresh} // Handle refresh action
                />
              }
            />
          ) : context.stateUser.userProfile.role === 'Faculty' ? (
            <FlatList
              contentContainerStyle={styles.propertyListContainer}
              data={facultydata} // Use facultydata instead of filteredData for faculty
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={ // Attach RefreshControl to FlatList
                <RefreshControl
                  refreshing={refreshing} // Set refreshing state
                  onRefresh={onRefresh} // Handle refresh action
                />
              }
            />
          ) : null}
          <Modal
            visible={showPDF}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClosePDF}
          >
            <View style={styles.centeredView}>
              <View style={[styles.modalView, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                <TouchableOpacity onPress={handleClosePDF} style={styles.closeButtons}>
                  <Icon name="close" size={20} />
                </TouchableOpacity>
                <WebView source={{ uri: pdfFileName }} />
                <View style={{ alignItems: 'center' }}>
                  <Icon name="check-circle" size={100} color="green" />
                  <Text style={[styles.successText, { marginLeft: 10 }]}>The file has been successfully downloaded.</Text>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={returnedModal} transparent={false}>
            <View style={styles.containers}>
              <Image
                source={{
                  uri: "https://www.bootdey.com/image/280x280/800000/800000",
                }}
                style={styles.backgrounds}
              />
              <View style={styles.formContainers}>
                <Text style={styles.titles}>Upload a File</Text>
                <View style={styles.cards}>
                  <Text style={styles.description}>Enter the revised application file in this field:</Text>
                  <View style={styles.inputContainers}>
                    <TouchableOpacity
                      style={styles.buttons}
                      onPress={pickDocument}
                    >
                      <Text style={styles.buttonTexts}>Choose File</Text>
                    </TouchableOpacity>
                  
                    {selectedFile ? (
                                    <Text>Selected File: {selectedFile.name}</Text>
                                ) : (
                                    <Text>No File Chosen</Text>
                                )}

                    <Text style={styles.note}>(Note: Make sure the uploaded application file is under the pdf format and should not exceed 10MB in size.)</Text>
                  </View>

                  {error ? <Text style={styles.errors}>{error}</Text> : null}
                  <TouchableOpacity
                    style={[styles.buttonss, { marginBottom: 10 }]}
                    onPress={() => {
                      handleConfirmation();
                      fetchData(); // Refresh data after confirmation
                    }}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCloseReturnModal}
                    style={[styles.closeButton, { backgroundColor: 'grey' }]}
                  >
                    <Text style={{ color: 'maroon' }}>Close</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Modal>


          <Modal visible={pendingTechnical} transparent={false}>
            <View style={{ flex: 1 }}>
              <Text>PENDING</Text>
              <TouchableOpacity onPress={handleClosePendingTechnical}>
                <Text>Close Modal</Text>
              </TouchableOpacity>
            </View>
          </Modal>

        </View>
      ) : null}

    </>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: 'grey',
  },
  container: {
    flex: 1,
  },
  searchInputContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  propertyListContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  image: {
    height: 150,
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardBody: {
    marginBottom: 10,
    padding: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardFooter: {
    padding: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containers: {
    flex: 1,
  },
  backgrounds: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  formContainers: {
    justifyContent: "center",
    alignItems: "center",
  },
  titles: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    marginTop: 20,
  },
  cards: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 20,
  },
  inputContainers: {
    marginBottom: 20,
  },
  buttons: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "maroon",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTexts: {
    color: "black",
  },
  errors: {
    color: "red",
    marginBottom: 10,
  },
  buttonss: {
    width: "100%",
    height: 40,
    backgroundColor: "maroon",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: "#666", // Adjust the color according to your preference
    marginBottom: 10, // Adjust the margin bottom as per your design preference
  },
  note: {
    fontSize: 12,
    color: "#666", // You can adjust the color according to your preference
    marginTop: 5, // Adjust the margin top as per your design preference
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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

export default PropertyContainer;