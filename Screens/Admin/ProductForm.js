import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthGlobal from "../../Context/Store/AuthGlobal"
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import ListItem from "./ListItem";

const CertificationForm = (props) => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);
  const [facultyFiles, setFacultyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [researchTitle, setResearchTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchFilesForUser();
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchFilesForUser = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error('Invalid authentication state');
        return;
      }

      const response = await axios.get(`${baseURL}get_files/${userProfile.id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (userProfile.role === 'Student') {
        setFiles(response.data.files);
        console.log('Student Files:', response.data.files);
      } else if (userProfile.role === 'Faculty') {
        setFacultyFiles(response.data.facultyfiles);
        console.log('Faculty Files:', response.data.facultyfiles);
      }

      Toast.show({
        type: 'success',
        text1: 'Files fetched successfully',
      });
    } catch (error) {
      console.error('Error fetching files:', error);
      Toast.show({
        type: 'error',
        text1: 'Error fetching files',
        text2: 'Please try again.',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (context.stateUser.isAuthenticated === true) {
        setSelectedFile(null);
        setResearchTitle('');
        setAbstract('');
        setError(null);
        fetchFilesForUser();
      } else {
        setSelectedFile(null);
        setResearchTitle('');
        setAbstract('');
        setError(null);
        setFiles([]);
        setFacultyFiles([]);
      }
    }, [context.stateUser.isAuthenticated])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwt');
        const userProfile = context.stateUser.userProfile;

        if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
          console.error('Invalid authentication state');
          return;
        }

        const response = await axios.get(`${baseURL}get_files/${userProfile.id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        if (userProfile.role === 'Student') {
          setFiles(response.data.files);
          console.log('Student Files:', response.data.files);
        } else if (userProfile.role === 'Faculty') {
          setFacultyFiles(response.data.facultyfiles);
          console.log('Faculty Files:', response.data.facultyfiles);
        }

        Toast.show({
          type: 'success',
          text1: 'Files fetched successfully',
        });
      } catch (error) {
        console.error('Error fetching files:', error);
        Toast.show({
          type: 'error',
          text1: 'Error fetching files',
          text2: 'Please try again.',
        });
      }
    };

    fetchData();
  }, []);

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${baseURL}delete_file/${fileId}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      setFacultyFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      Toast.show({
        type: 'success',
        text1: 'File deleted successfully',
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      Toast.show({
        type: 'error',
        text1: 'Error deleting file',
        text2: 'Please try again.',
      });
    }
  };

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
              setResearchTitle(fileNameWithoutExtension);

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
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        setError("User authentication or profile information is missing");
        return;
      }

      const userId = userProfile.id;

      const formData = new FormData();
      formData.append("research_title", researchTitle);
      formData.append("abstract", abstract);
      formData.append("research_file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: "application/pdf",
      });
      formData.append("user_id", userId);

      const response = await axios.post(`${baseURL}upload_file`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log("File uploaded successfully", response.data);
      Toast.show({
        type: 'success',
        text1: 'File uploaded successfully',
      });
      onRefresh();
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
      Toast.show({
        type: 'error',
        text1: 'Error uploading file',
        text2: 'Please try again.',
      });
    }
  };

  const handleLargeFile = async (uri) => {
    try {
      console.log(uri);
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

  const requestCameraRollPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Camera Roll permission is required to access files.");
      }
    } catch (error) {
      console.error("Error asking for camera roll permission:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await requestCameraRollPermission();
      } catch (error) {
        console.error("Error getting camera roll permission:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: "https://www.bootdey.com/image/280x280/808080/808080",
        }}
        style={styles.background}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>My Applications</Text>
        {showForm && (
          <View style={styles.card}>

<View style={styles.fileSelectionContainer}>
            <TouchableOpacity
              style={styles.buttons}
              onPress={pickDocument}
            >
              <Text style={styles.buttonTexts}>Choose File</Text>
            </TouchableOpacity>
            {selectedFile ? (
                                    <Text style={styles.fileText}>Selected File: {selectedFile.name}</Text>
                                ) : (
                                    <Text style={styles.fileText}>No File Chosen</Text>
                                )}
            </View>

            <Text style={styles.note}>Note: The uploaded PDF file should not exceed 10MB in size.</Text>

            <Text style={styles.label}>Application Title</Text>
            <TextInput
              style={styles.input}
              value={researchTitle}
              onChangeText={(text) => setResearchTitle(text)}
              multiline={true}
              numberOfLines={4}
            />

            <Text style={styles.label}>Application Abstract</Text>
            <TextInput
              style={styles.input}
              value={abstract}
              onChangeText={(text) => setAbstract(text)}
              multiline={true}
              numberOfLines={4}
            />

            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmation}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={toggleForm}
        >
          <Text style={styles.uploadButtonText}>{showForm ? "Close" : "Upload Application"}</Text>
        </TouchableOpacity>
        {/* Add margin after TouchableOpacity */}
        <View style={{ marginBottom: 20 }} />
      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ borderWidth: 2, borderColor: 'black', margin: 5 }}>
          <Text style={{ textAlign: 'center', color: 'black', fontSize: 24, padding: 10 }}>
            Application List
          </Text>
        </View>
        <FlatList
          data={context.stateUser.userProfile.role === 'Student' ? files : facultyFiles}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <ListItem key={index} item={item} index={index} deleteFile={deleteFile} />
          )}
          keyExtractor={(item) => item.id.toString()} // Ensure key is a string
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginTop: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 10,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 80,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  button: {
    width: "40%",
    height: 40,
    backgroundColor: "black",
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttons: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonTexts: {
    color: "black",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  note: {
    fontSize: 11,
    color: "#666",
    marginBottom: 20,
  },
  uploadButton: {
    width: "40%",
    height: 40,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 20,
  },
  uploadButtonText: {
    color: "black",
    fontSize: 16,
  },
};

export default CertificationForm;
