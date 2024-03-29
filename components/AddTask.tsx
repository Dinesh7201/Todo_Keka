import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';

const AddTask = ({ navigation }) => {
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
    // Check for mandatory fields
    const missingFields = [];

    if (!newTask.trim()) {
      missingFields.push('\n*Task Title');
    }

    if (!priority) {
      missingFields.push('\n*Priority');
    }

    if (!status) {
      missingFields.push('\n*Status');
    }

    if (!dueDate) {
      missingFields.push('\n*Due Date');
    }

    if (missingFields.length > 0) {
      const missingFieldsMessage = missingFields.join(' ');
      setAlertMessage(`Please fill in the following fields: ${missingFieldsMessage}`);
      setShowAlert(true);
      return;
    }

    try {
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      const newTaskDetails = {
        dueDate,
        priority,
        category,
        status,
        description,
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      const newTaskObject = {
        id: Date.now().toString(),
        title: newTask,
        details: newTaskDetails,
      };

      const updatedTasks = [...tasks, newTaskObject];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigation.navigate('ViewTask', { taskTitle: newTask });
      setNewTask('');
      setDueDate('');
      setPriority('');
      setCategory('');
      setStatus('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <ImageBackground
      source={require('/Users/apple/Desktop/new/Todo_Keka/assets/BackGround.png')}
      style={styles.container}
    >
      <Text style={styles.title}>Add Task</Text>

      <TextInput
        style={styles.input}
        placeholder="*Enter task title"
        value={newTask}
        onChangeText={(text) => setNewTask(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter task description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text>{dueDate ? `Due Date: ${dueDate}` : 'Select due date'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter category"
        value={category}
        onChangeText={(text) => setCategory(text)}
      />

      <Picker
        style={styles.input}
        selectedValue={priority}
        onValueChange={(itemValue) => setPriority(itemValue)}
      >
        <Picker.Item label="*Select Priority" value="" />
        <Picker.Item label="High Priority" value="High" />
        <Picker.Item label="Medium Priority" value="Medium" />
        <Picker.Item label="Low Priority" value="Low" />
      </Picker>

      <Picker
        style={styles.input}
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="*Select Status" value="" />
        <Picker.Item label="New" value="New" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity onPress={addTask} style={styles.addButton}>
        <Text style={styles.actionText}>Add Task</Text>
      </TouchableOpacity>

      <Modal isVisible={showAlert} backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{alertMessage}</Text>
          <TouchableOpacity onPress={() => setShowAlert(false)} style={styles.modalButton}>
            <Text style={styles.actionText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default AddTask;
