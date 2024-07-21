import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import header from './components/Header.js';
import { useSelector } from 'react-redux';

import HomeScreen from './pages/Home.js'
import Categories from './pages/Categories.js'
import RecipeList from './pages/RecipeList.js'
import ViewRecipe from './pages/ViewRecipe.js'

const Stack = createNativeStackNavigator();

const PageSetup = () => {
  const selection = useSelector(state=> state.selection.value);

  return (
      <Stack.Navigator screenOptions={{header: header}}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'My Recipes'}}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{title: selection}}
        />
        <Stack.Screen
          name="Recipes"
          component={RecipeList}
          options={{title: 'Recipes'}}
        />
        <Stack.Screen
          name="ViewRecipe"
          component={ViewRecipe}
          options={{title: selection}}
        />
      </Stack.Navigator>
  );
}

export default PageSetup;