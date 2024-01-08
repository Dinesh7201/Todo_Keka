import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const ViewTask = ({ route }) => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const { taskTitle } = route.params || {};
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

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
            navigation.goBack();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const filterTasks = () => {
    let filteredTasks = tasks;

    if (selectedPriority !== 'All') {
      filteredTasks = filteredTasks.filter((task) => task.details?.priority === selectedPriority);
    }

    if (selectedStatus !== 'All') {
      filteredTasks = filteredTasks.filter((task) => task.details?.status === selectedStatus);
    }

    return filteredTasks;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPriority}
          onValueChange={(itemValue) => setSelectedPriority(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={(itemValue) => setSelectedStatus(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="New" value="New" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
      </View>

      <ScrollView style={styles.scrollView}>
        {filterTasks().map((task, index) => (
          <View key={index} style={styles.taskBox}>
            <Text>Due Date: {task.details?.dueDate || 'N/A'}</Text>
            <Text>Priority: {task.details?.priority || 'N/A'}</Text>
            <Text>Category: {task.details?.category || 'N/A'}</Text>
            <Text>Status: {task.details?.status || 'N/A'}</Text>
            <Text>Title: {task.title}</Text>
            <Text>Description: {task.details?.description || 'N/A'}</Text>

            {/* Display the date and time of adding task */}
            <Text style={styles.dateTime}>
              Added on: {new Date(task.addedOn).toLocaleString()}
            </Text>

            {/* Edit and Delete options for each task */}
            <TouchableOpacity onPress={() => handleEditTask(task.id)} style={styles.editButton}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
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
  },
  pickerContainer: {
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  taskBox: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  dateTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
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
