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
import Loading from '../components/LoadingScreen.js'

// style imports
import styles from '../style.js';

// function imports
import { recipe_funcs, rec_cat_funcs } from 'recipe-book';
import { selectR } from '../redux/selectionSlice';

const favorites = "Favorite"
const recents = "Recent"

const user = {
    favorites: [],
    recents: []
}

function RecipeList({route}) {
    let {category} = route.params;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the recipes to display
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            let ids;
            if (category == favorites) ids = user.favorites
            else ids = user.recents

            const data = []
            for (const id of ids) {
                const recipe = await recipe_funcs.getRecipe(id)
                data.push(recipe)
            }
            setData(data)

            setLoading(false);
        }

        const getRecipes = async ()=> {
            const recipes = await rec_cat_funcs.getRecipes(category._id)
            setData(recipes)

            setLoading(false)
        }

        if (category == favorites || category == recents) getUserRecipes();
        else getRecipes()
    }, []);

    // Show loading screen while waiting for data
    if (loading) {
        return <Loading />
    }

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        dispatch(selectR(recipe.name))
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
