import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  FlatList,
  RefreshControl
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

import Icon from "react-native-vector-icons/FontAwesome"

import ListAnnouncement from "./ListAnnouncement";

const AnnouncementForm = ({ announcementData }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [error, setError] = useState(null);

  const [selectedImages, setSelectedImages] = useState([]);

  const [listKey, setListKey] = useState(0); // Key to force re-render FlatList

  const context = useContext(AuthGlobal);

  const [announcementList, setAnnouncementList] = useState();
  const [announcementFilter, setAnnouncementFilter] = useState();
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState('');

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(async () => {
  setRefreshing(true);
  // Perform actions that need refreshing here
  
  // Example: Refetch announcements
  try {
    const response = await axios.get(`${baseURL}announcements`);
    setAnnouncementList(response.data);
    setAnnouncementFilter(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
    // Handle error state or display an error message to the user
  }

  setRefreshing(false);
}, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        multiple: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedUris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prevImages) => [...prevImages, ...selectedUris]);
        setListKey((prevKey) => prevKey + 1); // Update key to trigger re-render
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const renderImageItem = ({ item }) => (
    <Image style={styles.image} source={{ uri: item }} />
  );

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
      formData.append('title', title);
      formData.append('content', content);

      if (mainImage) {
        formData.append('mainImage', {
          uri: mainImage,
          name: 'mainImage.jpg',
          type: 'image/jpeg',
        });
      }

      selectedImages.forEach((imageUri, index) => {
        formData.append(`images[${index}]`, {
          uri: imageUri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });
      formData.append("user_id", userId);

      const response = await axios.post(`${baseURL}add-announcements`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.data.success) {
        console.log('Announcement added successfully');
        Toast.show({
          type: "success",
          text1: "Announcement added successfully",
        });
        onRefresh();
        // Reset states or navigate to a success screen
      } else {
        console.error('Failed to add announcement');
        // Handle error state or display an error message to the user
      }
    } catch (error) {
      console.error('Error adding announcement:', error.message);
      // Handle error state or display an error message to the user
      Alert.alert('Error', 'Failed to add announcement. Please try again later.');
    }
  };

  const renderAnnouncementItem = ({ item, index }) => (
    <ListAnnouncement
      item={item}
      index={index}
      deleteAnnouncement={deleteAnnouncement}
    />
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true; // Flag to track component unmounting

      const fetchData = async () => {
        try {
          // Get Token
          const token = await AsyncStorage.getItem("jwt");
          setToken(token);

          // Fetch announcements
          const response = await axios.get(`${baseURL}announcements`);

          if (isMounted) {
            // Check if component is still mounted before setting state
            setAnnouncementList(response.data);
            setAnnouncementFilter(response.data);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching announcements:', error.message);
          // Handle error state or display an error message to the user
        }
      };

      fetchData(); // Fetch data when the component gains focus

      return () => {
        // Cleanup function when component unmounts
        isMounted = false; // Update flag to signal unmounting
        setAnnouncementList(null); // Clear announcement list state
        setAnnouncementFilter(null); // Clear announcement filter state
        setLoading(true); // Set loading state to true
      };
    }, []) // Empty dependency array ensures this effect runs only on mount and unmount
  );

  const deleteAnnouncement = async (announcementId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.delete(
        `${baseURL}delete-announcement/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        console.log('Announcement deleted successfully');
        // Handle success or any necessary actions
        Toast.show({
          type: "success",
          text1: "Announcement deleted successfully",
        });
        onRefresh();
        
      } else {
        console.error('Failed to delete announcement');
        // Handle failure or display an error message
      }
    } catch (error) {
      console.error('Error deleting announcement:', error.message);
      // Handle error state or display an error message
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://www.bootdey.com/image/280x280/800000/800000",
        }}
        style={styles.background}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Announcement</Text>
        <View style={styles.card}>
          <View style={styles.inputContainer}>

            <View style={styles.containers}>
              <FlatList
                key={listKey} // Use key to trigger re-render
                data={selectedImages}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Icon style={{ color: 'white' }} name="camera" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Title</Text>
            <View
              style={{
                width: "100%",
                height: 100,
                borderColor: "#800000",
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Input Title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={{
                  width: "105%",
                }}
              />
            </View>

            <Text style={styles.label}>Content</Text>
            <View
              style={{
                width: "100%",
                height: 100,
                borderColor: "#800000",
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Input Content"
                placeholderTextColor="#999"
                value={content}
                onChangeText={(text) => setContent(text)}
                style={{
                  width: "105%",
                }}
              />
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmation}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ borderWidth: 2, borderColor: 'maroon', margin: 10 }}>
          <Text style={{ textAlign: 'center', color: 'maroon', fontSize: 24, padding: 10 }}>
            Announcement List
          </Text>
        </View>
        <FlatList
          data={announcementFilter}
          renderItem={renderAnnouncementItem}
          keyExtractor={(item) => item.id.toString()} // Assuming `id` is a unique identifier
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>

    </View>
  );
};

const styles = {
  itemContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
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
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  button: {
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
  error: {
    color: "red",
    marginBottom: 10,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10
  },
  containers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
};

export default AnnouncementForm;
