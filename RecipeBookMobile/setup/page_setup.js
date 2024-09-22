import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Header from '../components/TitleHeader.js';
import { useSelector } from 'react-redux';

import HomeScreen from '../pages/Home.js'
import Categories from '../pages/Categories.js'
import RecipeList from '../pages/RecipeList.js'
import ViewRecipe from '../pages/ViewRecipe.js'

import AddRecipe from '../pages/AddRecipe/AddRecipe.js'

const Stack = createNativeStackNavigator();

const PageSetup = ({navigation}) => {
  const recipe = useSelector(state=> state.selection.recipe);
  const category = useSelector(state=> state.selection.category);
  const flavor = useSelector(state=> state.selection.flavor);

  return (
      <Stack.Navigator
        screenOptions={{
            header: Header,
            setCanGoBack: (back) => {navigation.setOptions({back: back})},
            setBack: (backFunc) => {navigation.setOptions({goBack: backFunc})}
        }}>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'My Recipes'}}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{title: flavor + " Recipes", animation: "slide_from_right"}}
        />
        <Stack.Screen
          name="Recipes"
          component={RecipeList}
          options={{title: category + " Recipes", animation: "slide_from_right"}}
        />
        <Stack.Screen
          name="ViewRecipe"
          component={ViewRecipe}
          options={{title: recipe, animation: "slide_from_right"}}
        />

        <Stack.Screen
          name="AddRecipe"
          component={AddRecipe}
          options={{title: "Add a Recipe", animation: "slide_from_bottom"}}
        />
      </Stack.Navigator>
  );
}

export default PageSetup;