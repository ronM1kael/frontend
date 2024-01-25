import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';

import baseURL, { baseURL2 } from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Toast from 'react-native-toast-message';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const context = useContext(AuthGlobal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}mobileshowannouncement`);
        console.log('Fetched data:', response.data);
        setAnnouncements(Object.values(response.data.announcements));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePress = async (announcement) => {
    setSelectedAnnouncement(announcement);
    console.log('Selected Announcement:', announcement);
    await fetchComments(announcement[0].announcement_id);
  };

  const fetchComments = async (announcementId) => {
    try {
      const response = await axios.get(`${baseURL}show/comments/${announcementId}`);
      console.log('Fetched comments:', response.data);
      setComments(response.data); // Assuming response.data is an array of comments
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
    setComments([]);
  };

  const handleImageError = (error, imageData) => {
    console.log(`Error loading image for ${imageData.img_path}`, error);
  };

  const handleAddComment = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      console.log('JWT Token:', jwtToken);
      const userProfile = context.stateUser.userProfile;
  
      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id || !selectedAnnouncement) {
        setError("User authentication or profile information is missing, or no announcement is selected");
        return;
      }
  
      const userId = userProfile.id;
  
      const formData = new FormData();
      formData.append('content', newComment);
      
      const announcementId = selectedAnnouncement[0]?.announcement_id;
      if (!announcementId) {
        setError('Announcement ID is undefined');
        return;
      }
      
      formData.append('announcement_id', announcementId);
      formData.append('user_id', userId);
  
      const requestUrl = `${baseURL}add/${announcementId}/comment`;
      
      const response = await axios.post(requestUrl, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (response.data.success) {
        console.log('Comment added successfully');
        Toast.show({
          type: "success",
          text1: "Comment added successfully",
        });
  
        setComments([...comments, response.data.comment]);
        setNewComment('');
      } else {
        console.error('Failed to add comment');
        // Handle error state or display an error message to the user
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
      // Handle error state or display an error message to the user
      Toast.show({
        type: "error",
        text1: "Error adding comment",
        text2: "Please try again later",
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        renderItem={({ item: announcement }) => (
          <TouchableOpacity onPress={() => handlePress(announcement)}>
            <View style={styles.card}>
              <ScrollView horizontal style={styles.imagesContent}>
                {announcement.map((imageData, index) => (
                  <View key={`${imageData.id}_${index}`}>
                    <Image
                      style={styles.productImage}
                      source={{ uri: `${baseURL2}/images/${imageData.img_path}` }}
                      onLoad={() => console.log('Image loaded')}
                      onError={(error) => handleImageError(error, imageData)}
                    />
                  </View>
                ))}
              </ScrollView>
              <Text style={styles.productName}>{announcement[0].title}</Text>
              <Text style={styles.productContent}>{announcement[0].content}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {selectedAnnouncement && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!selectedAnnouncement}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedAnnouncement[0].title}</Text>
              <Text style={styles.modalContent}>{selectedAnnouncement[0].content}</Text>

              <ScrollView horizontal style={styles.imagesContent}>
                {selectedAnnouncement.map((imageData, index) => (
                  <View key={`${imageData.id}_${index}`}>
                    <Image
                      style={styles.modalImage}
                      source={{ uri: `${baseURL2}/images/${imageData.img_path}` }}
                      onError={(error) => handleImageError(error, imageData)}
                    />
                  </View>
                ))}
              </ScrollView>

              {comments.length > 0 && (
                <View>
                  <Text style={styles.modalTitle}>Comments</Text>
                  {comments.map((comment) => (
                    <View key={comment.id}>
                      <Text>
                        {comment.commentator}: {comment.comment_content}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.commentFormContainer}>
                <TextInput
                  placeholder="Write a comment"
                  value={newComment}
                  onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
                  <Text>Add Comment</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#B0C4DE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 10,
  },
  imagesContent: {
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 5,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productContent: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalImage: {
    width: 200, // Set the width based on your preference
    height: 200,
    margin: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
  },
  commentFormContainer: {
    marginTop: 20,
  },
  addCommentButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default AnnouncementList;