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
import ListPage from '../components/ListPage.js'
import Loading from '../components/LoadingScreen.js'

// style imports
import styles from '../style.js';

// function imports
import { category_funcs } from 'recipe-book';
import { selectC } from 'recipe-book/redux/selectionSlice';

function Categories({route}) {
    let {flavor_type} = route.params;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the categories to display
    useEffect(() =>{
        const getCategories = async ()=> {
            const categories = await category_funcs.getFlavorType(flavor_type)
            setData(categories)

            setLoading(false)
        }
        getCategories()
    }, []);

    // Show loading screen while waiting for data
    if (loading) {
        return <Loading />
    }

    // Navigate to the RecipeList page when a Category is selected
    const selectCategory = (category) => {
        dispatch(selectC(category.name))
        navigation.navigate("Recipes", {category: category})
    }

    return(
        <ListPage data={data} navigate={(item) => selectCategory(item)} />
    )
}

export default Categories;
