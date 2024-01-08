// AddTask.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTask = ({ navigation }) => {
  const handleGoBack = () => {
    // Use navigation.goBack() when you want to go back
    navigation.goBack();
  };
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('New');
  const [description, setDescription] = useState('');

  const addTask = async () => {
    if (!newTask.trim()) {
      Alert.alert('Mandatory Field', 'Please fill in the task title.');
      return;
    }
  
    try {
      // Get existing tasks from storage
      const currentDate = new Date();
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
  
      // Add the new task
      const updatedTasks = [
        ...tasks,
        {
          title: newTask,
          details: {
            dueDate,
            priority,
            category,
            status,
            description,
          },
          id: Date.now(), // Add a unique ID to the task
          addedOn: currentDate.toISOString(),
        },
      ];
  
      // Save updated tasks to storage
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
      // Navigate to ViewTask screen with the new task title
      navigation.navigate('ViewTask', { taskTitle: newTask });
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={newTask}
        onChangeText={(text) => setNewTask(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter due date"
        value={dueDate}
        onChangeText={(text) => setDueDate(text)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
