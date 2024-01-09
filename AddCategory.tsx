import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AddCategory = ({ onCancel, onSaveCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const saveCategory = () => {
    if (newCategory.trim() !== '') {
      onSaveCategory(newCategory);
      onCancel();
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>Enter New Category:</Text>
      <TextInput
        style={styles.input}
        placeholder="Category Name"
        value={newCategory}
        onChangeText={(text) => setNewCategory(text)}
      />
      <TouchableOpacity onPress={saveCategory} style={styles.modalButton}>
        <Text style={styles.actionText}>Save Category</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel} style={styles.modalButton}>
        <Text style={styles.actionText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'blue',
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

export default AddCategory;
