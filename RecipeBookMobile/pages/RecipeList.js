// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

// component imports
import ListItem from '../components/ListItem.js'

// style imports
import styles from '../style.js';

// function imports
import { rec_cat_funcs } from 'recipe-book';
import { select } from '../redux/selectionSlice';

function RecipeList({route}) {
    let {category} = route.params;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [data, setData] = useState([]);

    // Get the recipes to display
    useEffect(() =>{
        const getRecipes = async ()=> {
            const recipes = await rec_cat_funcs.getRecipes(category._id)
            setData(recipes)
        }
        getRecipes()
    }, []);

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        dispatch(select(recipe.name))
        navigation.navigate("ViewRecipe", {recipe: recipe})
    }

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={({item}) => <ListItem text={item.name} navigate={() => selectRecipe(item)} />}
                />
            </View>
        </SafeAreaView>
    )
}

export default RecipeList;
