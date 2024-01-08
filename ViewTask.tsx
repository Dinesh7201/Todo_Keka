import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ViewTask = ({ route }) => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const { taskTitle } = route.params || {};

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, [route.params?.taskTitle, tasks.length]);

  const navigateToAddTask = () => {
    navigation.navigate('AddTask');
  };

  const handleEditTask = (taskId) => {
    navigation.navigate('EditTask', { taskId });
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
            AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text><Text></Text>
      <ScrollView style={styles.scrollView}>
        {tasks.slice().reverse().map((task, index) => (
          <View key={index} style={styles.taskContainer}>
            <View style={styles.taskDetails}>
              <Text>Due Date: {task.details?.dueDate || 'N/A'}</Text>
              <Text>Priority: {task.details?.priority || 'N/A'}</Text>
              <Text>Category: {task.details?.category || 'N/A'}</Text>
              <Text>Status: {task.details?.status || 'N/A'}</Text>
              <Text>Title: {task.title}</Text>
              <Text>Description: {task.details?.description || 'N/A'}</Text>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => handleEditTask(task.id)} style={styles.editButton}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={navigateToAddTask} style={styles.addTaskButton}>
        <Text style={styles.actionText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1, // Add this line to set border width
    borderColor: '#333', // Add this line to set border color
    borderLeftWidth: 5, // Add this line to set left border width
    borderLeftColor: 'darkgreen', // Add this line to set left border color
    borderRightWidth: 5, // Add this line to set right border width
    borderRightColor: 'darkgreen', // Add this line to set right border color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskDetails: {
    flex: 1,
  },
  taskActions: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  editButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  addTaskButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ViewTask;
