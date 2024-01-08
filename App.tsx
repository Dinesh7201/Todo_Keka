// Import necessary modules
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for task
interface Task {
  title: string;
  details: {
    dueDate: string;
    priority: string;
    category: string;
    status: string;
    description: string;
  };
  id: number;
}

// App component
const TodoApp = () => {
  // State to manage tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State to manage new task input
  const [newTask, setNewTask] = useState('');
  // State to manage task details
  const [taskDetails, setTaskDetails] = useState({
    dueDate: '',
    priority: 'Low',
    category: '',
    status: 'New',
    description: '',
  });

  // Load tasks from local storage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // Load tasks from local storage
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

  // Save tasks to local storage
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Add a new task
  const addTask = () => {
    // Mandatory field checks
    if (!taskDetails.dueDate || !taskDetails.priority || !taskDetails.status || !newTask.trim() || !taskDetails.description.trim()) {
      Alert.alert('Mandatory Fields', 'Please fill in all mandatory fields: *Due Date, *Priority Levels, *Task Status, *Title, and *Description');
      return;
    }

    setTasks([
      ...tasks,
      { title: newTask, details: { ...taskDetails }, id: Date.now() },
    ]);
    setNewTask('');
    setTaskDetails({
      dueDate: '',
      priority: 'Low',
      category: '',
      status: 'New',
      description: '',
    });
  };

  // Delete a task
  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Edit a task
  const editTask = (taskId: number) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (selectedTask) {
      setNewTask(selectedTask.title);
      setTaskDetails(selectedTask.details);
      deleteTask(taskId); // Remove the existing task
    }
  };

  // Format due date as dd/mm/yyyy
  const formatDueDate = (value: string) => {
    let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (formattedValue.length >= 2) {
      formattedValue =
        formattedValue.substring(0, 2) +
        '/' +
        formattedValue.substring(2, 4);
    }
    if (formattedValue.length >= 5) {
      formattedValue =
        formattedValue.substring(0, 5) +
        '/' +
        formattedValue.substring(5, 9);
    }
    return formattedValue;
  };

  // Render task item
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskDetails}>
        <Text>Title: {item.title}</Text>
        <Text>Description: {item.details.description}</Text>
        <Text>Due Date: {item.details.dueDate}</Text>
        <Text>Priority: {item.details.priority}</Text>
        <Text>Category: {item.details.category}</Text>
        <Text>Status: {item.details.status}</Text>
      </View>

      {/* Add Edit and Delete text with styling */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => editTask(item.id)} style={styles.editButton}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Task input */}
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={newTask}
        onChangeText={(text) => setNewTask(text)}
      />

      {/* Task details input */}
      <TextInput
        style={styles.input}
        placeholder="Enter task description"
        value={taskDetails.description}
        onChangeText={(text) =>
          setTaskDetails({ ...taskDetails, description: text })
        }
      />

      {/* Due date input */}
      <TextInput
        style={styles.input}
        placeholder="Enter due date (dd/mm/yyyy)"
        value={formatDueDate(taskDetails.dueDate)}
        onChangeText={(text) =>
          setTaskDetails({ ...taskDetails, dueDate: formatDueDate(text) })
        }
        keyboardType="numeric"
        maxLength={10} // Limit to 10 characters (dd/mm/yyyy)
      />

      {/* Additional details input */}
      <Picker
        selectedValue={taskDetails.priority}
        onValueChange={(value) =>
          setTaskDetails({ ...taskDetails, priority: value as string })
        }>
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={taskDetails.category}
        onChangeText={(text) =>
          setTaskDetails({ ...taskDetails, category: text })
        }
      />

      <Picker
        selectedValue={taskDetails.status}
        onValueChange={(value) =>
          setTaskDetails({ ...taskDetails, status: value as string })
        }>
        <Picker.Item label="New" value="New" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>

      {/* Add task text with styling */}
      <TouchableOpacity onPress={addTask} style={styles.addTaskButton}>
        <Text style={styles.actionText}>Add Task</Text>
      </TouchableOpacity>

      {/* Task list */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

// Styles
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'green',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
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
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  taskDetails: {
    flex: 1,
  },
});

export default TodoApp;
