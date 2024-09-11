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
import { useDispatch, useSelector } from 'react-redux';

// component imports
import ListPage from '../components/ListPage.js'
import Loading from '../components/LoadingScreen.js'

// style imports
import styles from '../style.js';

// function imports
import { recipe_funcs, rec_cat_funcs } from 'recipe-book';
import { selectR } from 'recipe-book/redux/selectionSlice';
import { setRecents } from 'recipe-book/redux/userSlice';

const favorites = "Favorite"
const recents = "Recent"


function RecipeList({route}) {
    let {category} = route.params;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useSelector(state=> state.user.value);

    // Get the recipes to display
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            let ids;
            if (category == favorites) ids = user.favorites
            else ids = user.recents

            const recipes = []
            for (const id of ids) {
                const recipe = await recipe_funcs.getRecipe(id)
                recipes.push(recipe)
            }
            setData(recipes)

            setLoading(false);
        }

        const getRecipes = async ()=> {
            const recipes = await rec_cat_funcs.getRecipes(category._id)
            if (recipes == undefined) {
                alert("There are currently no recipes in this category")
                navigation.navigate("Categories", {flavor_type: category.flavor_type})
            }

            setData(recipes)

            setLoading(false)
        }

        if (category == favorites || category == recents) getUserRecipes();
        else getRecipes()
    }, [user]);

    // Show loading screen while waiting for data
    if (loading) {
        return <Loading />
    }

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        } else recents = recents.slice(0, 15)
        dispatch(setRecents(recents))

        dispatch(selectR(recipe.name))
        navigation.navigate("ViewRecipe", {recipe: recipe})
    }

    return(
        <ListPage data={data} navigate={(item) => selectRecipe(item)} />
    )
}

export default RecipeList;
