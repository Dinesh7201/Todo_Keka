import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  TextInput,
} from 'react-native';
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
  const [sortOrder, setSortOrder] = useState('latest');
  const [categoryQuery, setCategoryQuery] = useState('');

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
  }, [route.params?.taskTitle]);

  const navigateToAddTask = () => {
    navigation.navigate('AddTask');
  };

  

  const handleDeleteTask = async (taskId) => {
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
          onPress: async () => {
            try {
              const existingTasks = await AsyncStorage.getItem('tasks');
              const tasks = existingTasks ? JSON.parse(existingTasks) : [];
              const updatedTasks = tasks.filter((task) => task.id !== taskId);
              await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
              setTasks(updatedTasks);
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const filterAndSortTasks = () => {
    let filteredTasks = tasks;

    if (selectedPriority !== 'All') {
      filteredTasks = filteredTasks.filter((task) => task.details?.priority === selectedPriority);
    }

    if (selectedStatus !== 'All') {
      filteredTasks = filteredTasks.filter((task) => task.details?.status === selectedStatus);
    }

    if (categoryQuery.trim() !== '') {
      filteredTasks = filteredTasks.filter(
        (task) => task.details?.category && task.details?.category.includes(categoryQuery)
      );
    }

    if (sortOrder === 'dueDateTop') {
      filteredTasks = filteredTasks.sort((a, b) => moment(a.details?.dueDate) - moment(b.details?.dueDate));
    } else if (sortOrder === 'dueDateBottom') {
      filteredTasks = filteredTasks.sort((a, b) => moment(b.details?.dueDate) - moment(a.details?.dueDate));
    } else {
      // Default sorting by Task Added in descending order (latest first)
      filteredTasks = filteredTasks.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
    }

    return filteredTasks;
  };

  return (
    <ImageBackground
      source={require('/Users/apple/Desktop/new/Todo_Keka/assets/BackGround.png')}
      style={styles.container}
    >
      
      <Image source={require('/Users/apple/Desktop/new/Todo_Keka/assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Tasks</Text>
      <Text></Text>

      {/* Priority Picker */}
      <View style={styles.pickerContainer}>
        {/* Category Search */}
      <TextInput
        style={styles.input}
        placeholder="Search by Category"
        value={categoryQuery}
        onChangeText={(text) => setCategoryQuery(text)}
      />
        <Picker
          selectedValue={selectedPriority}
          onValueChange={(itemValue) => setSelectedPriority(itemValue)}
          style={styles.whitePicker}
        >
          <Picker.Item label="Select Priority" value="All" />
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
          style={styles.whitePicker}
        >
          <Picker.Item label="Select Status" value="All" />
          <Picker.Item label="New" value="New" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
      </View>

     

      {/* Sorting options */}
      <View style={styles.sortOptionsContainer}>
        <Text style={styles.sortL}>Sort by Due Date:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => handleSortOrderChange('dueDateTop')}
            style={[styles.sortButton, sortOrder === 'dueDateTop' && styles.activeSortButton]}
          >
            <Text style={styles.sortButtonText}>Ascending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSortOrderChange('dueDateBottom')}
            style={[styles.sortButton, sortOrder === 'dueDateBottom' && styles.activeSortButton]}
          >
            <Text style={styles.sortButtonText}>Decending</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView}>
        {filterAndSortTasks().map((task) => (
          <View key={task.id} style={styles.taskBox}>
            <View style={styles.row}>
              <Text style={styles.textTitle}>{task.title}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.text}>{task.details?.dueDate || 'N/A'}</Text>
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
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.text}>{task.details?.description || 'N/A'}</Text>
            </View>

            <View style={styles.editDeleteContainer}>
              
              <TouchableOpacity onPress={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.dateTime}>
              Added on: {task.details?.dateTime || 'N/A'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={navigateToAddTask} style={styles.addTaskButton}>
        <Text style={styles.actionText}>Add Task</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};



export default ViewTask;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 10,

  },
  whitePicker: {
    backgroundColor: 'white', // Set the background color to white
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
    alignItems: 'baseline',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  text: {
    marginTop: 5,
    color: 'black',
  },
  textTitle: {
    marginTop: 5,
    color: 'black',
    fontSize: 23
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
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
  // Change this part of your code
editDeleteContainer: {
  flexDirection: 'row-reverse', // Change from 'row' to 'row-reverse'
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
  sortOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
  },
  sortLabel: {
    color: 'white',
    fontWeight: 'bold',
    
  },
  sortL: {
    marginTop : 5,
    color: 'white',
    fontWeight: 'bold',
    
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sortButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  sortButtonText: {
    color: 'white',
  },
  activeSortButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ViewTask;
