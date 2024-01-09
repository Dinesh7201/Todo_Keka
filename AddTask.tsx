import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const AddTask = ({ navigation }) => {
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('New');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDueDate(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      Alert.alert('Mandatory Field', 'Please fill in the task title.');
      return;
    }

    try {
      // Get existing tasks from storage
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];

      // Add the new task with the current date and time
      const newTaskDetails = {
        dueDate,
        priority,
        category,
        status,
        description,
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      const newTaskObject = {
        id: Date.now().toString(), // Generate a unique ID for the task
        title: newTask,
        details: newTaskDetails,
      };

      const updatedTasks = [...tasks, newTaskObject];

      // Save updated tasks to storage
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // Navigate to the ViewTask screen with the new task title
      navigation.navigate('ViewTask', { taskTitle: newTask });

      // Clear input fields after adding the task
      setNewTask('');
      setDueDate('');
      setPriority('Low');
      setCategory('');
      setStatus('New');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <ImageBackground
      source={require('/Users/apple/Desktop/Todo_Keka/BackGround.png')} // Replace 'your-image-path' with the actual path to your image
      style={styles.container}
    >
      <Text style={styles.title}>Add Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={newTask}
        onChangeText={(text) => setNewTask(text)}
      />
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text>{dueDate ? `Due Date: ${dueDate}` : 'Select due date'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Picker
        style={styles.input}
        selectedValue={priority}
        onValueChange={(itemValue) => setPriority(itemValue)}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter category"
        value={category}
        onChangeText={(text) => setCategory(text)}
      />
      <Picker
        style={styles.input}
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="New" value="New" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter task description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity onPress={addTask} style={styles.addButton}>
        <Text style={styles.actionText}>Add Task</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover', // or 'stretch' for different cover behaviors
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white', // Set text color to white
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Use rgba to set a transparent background color
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  addButton: {
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

export default AddTask;
