/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './pages/Home.js'

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: ''}}
            />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
