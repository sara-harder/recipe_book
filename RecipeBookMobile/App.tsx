/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import header from './components/Header.js';

import HomeScreen from './pages/Home.js'
import RecipeCategories from './pages/RecipeCategories.js'
import RecipeList from './pages/RecipeList.js'
import ViewRecipe from './pages/ViewRecipe.js'

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{header: header}}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: 'My Recipes'}}
            />
            <Stack.Screen
              name="Categories"
              component={RecipeCategories}
              options={{title: ''}}
            />
            <Stack.Screen
              name="Recipes"
              component={RecipeList}
              options={{title: ''}}
            />
            <Stack.Screen
              name="ViewRecipe"
              component={ViewRecipe}
              options={{title: ''}}
            />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
