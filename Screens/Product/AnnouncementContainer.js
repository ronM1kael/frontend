import React, { useEffect, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
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
  SafeAreaView
} from 'react-native';
import axios from 'axios';

import baseURL from '../../assets/common/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Toast from 'react-native-toast-message';
import baseURL2 from '../../assets/common/baseurlnew';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const context = useContext(AuthGlobal);

  const fetchData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;
      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error('Invalid authentication state');
        return;
      }

      const response = await axios.get(`${baseURL}mobilehomepage/${userProfile.id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      setAnnouncements(Object.values(response.data.announcements));
      setIsLoggedIn(!!context.stateUser.isAuthenticated);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [context.stateUser.isAuthenticated, refresh])
  );

  const handlePress = async (announcement) => {
    setSelectedAnnouncement(announcement);
    await fetchComments(announcement[0].announcement_id);
  };

  const fetchComments = async (announcementId) => {
    try {
      const response = await axios.get(`${baseURL}show/comments/${announcementId}`);
      setComments(response.data);
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
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id || !selectedAnnouncement) {
        console.error("User authentication or profile information is missing, or no announcement is selected");
        return;
      }

      const userId = userProfile.id;
      const fname = userProfile.fname;
      const mname = userProfile.mname;
      const lname = userProfile.lname;

      const formData = new FormData();
      formData.append('content', newComment);
      formData.append('announcement_id', selectedAnnouncement[0]?.announcement_id);
      formData.append('user_id', userId);
      formData.append('fname', fname);
      formData.append('mname', mname);
      formData.append('lname', lname);

      const response = await axios.post(`${baseURL}add-comment/${selectedAnnouncement[0]?.announcement_id}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.data.comment) {
        Toast.show({
          type: "success",
          text1: "Comment added successfully",
        });
        setComments([...comments, response.data.comment]);
        setNewComment('');
        resetState();
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
      Toast.show({
        type: "error",
        text1: "Error adding comment",
        text2: "Please try again later",
      });
    }
  };

  const resetState = () => {
    setNewComment('');
    setRefresh(prev => !prev);
    closeModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={announcements}
        renderItem={({ item: announcement }) => (
          <TouchableOpacity onPress={() => handlePress(announcement)}>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: `https://tse4.mm.bing.net/th?id=OIP.sRdQAfzOzF_ZjC3dnAZVSQHaGw&pid=Api&P=0&h=180` }}
                  style={{ width: 40, height: 40, marginLeft: 20, marginTop: 20 }}
                />
                <Text style={styles.productName}>
                  {announcement[0].fname} {announcement[0].mname} {announcement[0].lname}
                </Text>
              </View>
              <Text style={styles.productContent}>
                ({announcement[0].role}) {announcement[0].created_time}
              </Text>
              <Text style={styles.title}>
                {announcement[0].title}
              </Text>
              <Text style={styles.content}>
                {announcement[0].content}
              </Text>
              <ScrollView horizontal style={styles.imagesContent}>
                {announcement.map((imageData, index) => (
                  <View key={`${imageData.id}_${index}`}>
                    <Image
                      style={styles.productImage}
                      source={{ uri: `${baseURL2}/images/${imageData.img_path}` }}
                      onError={(error) => handleImageError(error, imageData)}
                    />
                  </View>
                ))}
              </ScrollView>
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

              {!isLoggedIn && (
                <Text>Please log in to add a comment</Text>
              )}

              {isLoggedIn && (
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
              )}
            </ScrollView>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'gray',
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
    marginLeft: 20
  },
  productContent: {
    fontSize: 16,
    color: '#888',
    marginTop: -15,
    marginBottom: 30,
    marginLeft: 80
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
    width: 200,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginLeft: 15
  },
  content: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 15
  },
});

export default AnnouncementList;
