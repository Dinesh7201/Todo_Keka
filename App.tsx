// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AddTask from './components/AddTask';
import ViewTask from './components/ViewTask';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ViewTask">
        
        <Stack.Screen name="ViewTask" component={ViewTask} options={{ title: 'View Task', headerShown: false }}/>
        <Stack.Screen name="AddTask" component={AddTask} options={{ title: 'Add Task' , headerShown: false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;