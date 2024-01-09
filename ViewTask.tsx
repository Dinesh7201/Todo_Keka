import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

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
          const parsedTasks = JSON.parse(storedTasks);
          const sortedTasks = parsedTasks.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
          setTasks(sortedTasks);
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

      {/* Priority Picker */}
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

      {/* Status Picker */}
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
        {filterTasks().map((task) => (
          <View key={task.id} style={styles.taskBox}>
            <View style={styles.row}>
  <Text style={styles.label}>Due Date:</Text>
  <Text>{task.details?.dueDate || 'N/A'}</Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Priority:</Text>
  <Text style={styles.text}>{task.details?.priority || 'N/A'}</Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Category:</Text>
  <Text style={styles.text}>{task.details?.category || 'N/A'}</Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Status:</Text>
  <Text style={styles.text}>{task.details?.status || 'N/A'}</Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Title:</Text>
  <Text style={styles.text}>{task.title}</Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Description:</Text>
  <Text style={styles.text}>{task.details?.description || 'N/A'}</Text>
</View>


            <View style={styles.editDeleteContainer}>
              <TouchableOpacity onPress={() => handleEditTask(task.id)} style={styles.editButton}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>

            {/* Display date added at the bottom right corner */}
            <Text style={styles.dateTime}>
              Added on: {task.details?.dateTime || 'N/A'}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Add Task button at top right corner */}
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
    borderColor: '#333',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline', // Align items at the baseline for vertical alignment
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  text: {
    marginTop: 5, // Adjust the marginTop as needed
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
    position: 'absolute',
    top: 20,
    right: 20,
  },
  editDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
  },
  dateTime: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
});

export default ViewTask;