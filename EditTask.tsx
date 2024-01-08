import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params || {};
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('New');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadTaskDetails = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          const tasks = JSON.parse(storedTasks);
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            setDueDate(task.details?.dueDate || '');
            setPriority(task.details?.priority || 'Low');
            setCategory(task.details?.category || '');
            setStatus(task.details?.status || 'New');
            setDescription(task.details?.description || '');
          }
        }
      } catch (error) {
        console.error('Error loading task details:', error);
      }
    };

    loadTaskDetails();
  }, [taskId]);

  const updateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              details: {
                dueDate,
                priority,
                category,
                status,
                description,
              },
            };
          }
          return t;
        });

        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        // Navigate back to ViewTask screen after updating the task
        navigation.navigate('ViewTask', { taskTitle: tasks.find((t) => t.id === taskId)?.title });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
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
      <TouchableOpacity onPress={updateTask} style={styles.updateButton}>
        <Text style={styles.actionText}>Update Task</Text>
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditTask;
