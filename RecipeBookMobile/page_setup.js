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
  const recipe = useSelector(state=> state.selection.recipe);
  const category = useSelector(state=> state.selection.category);
  const flavor = useSelector(state=> state.selection.flavor);

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
          options={{title: flavor}}
        />
        <Stack.Screen
          name="Recipes"
          component={RecipeList}
          options={{title: category + " Recipes"}}
        />
        <Stack.Screen
          name="ViewRecipe"
          component={ViewRecipe}
          options={{title: recipe}}
        />
      </Stack.Navigator>
  );
}

export default PageSetup;