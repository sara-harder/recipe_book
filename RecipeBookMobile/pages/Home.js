// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

// style imports
import styles, {text_styles} from '../style.js';

// function imports
import { helpers } from 'recipe-book';
import { select } from '../redux/selectionSlice';

const savory = "Savory"
const sweet = "Sweet"

const Recipe = ({name, image, nav}) => {
    return(
        <Pressable onPress={nav} >
            <View style={home_style.image} ></View>
            <Text style={[text_styles.itemText, {textAlign: "center"}]}>{name}</Text>
        </Pressable>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [real_data, setData] = useState([]);

    const data = [{
        image: "image_1",
        name: "Recipe 1",
        nav: ()=>navigation.navigate("ViewRecipe")
    }]

    // Get the recipes to display in this row
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            setData(data)
        }
        const getCatRecipes = async ()=> {
            const recipes = await helpers.getRandomRecipes(title)
            setData(recipes)
        }
        if (title == savory || title == sweet) getCatRecipes();
        else getUserRecipes()
    }, []);

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        dispatch(select(recipe.name))
        navigation.navigate("ViewRecipe", {recipe: recipe})
    }

    // Row of recipe examples with See All button
    return(
        <View>
            <View style={styles.row}>
                <Text style={text_styles.smallTitle}>{title}</Text>
                <Text style={[text_styles.itemText, {paddingTop: 12, paddingRight: 12}]}
                    onPress={nav}>See All</Text>
            </View>
            <View style={home_style.row}>
                <FlatList
                    data={real_data}
                    horizontal={true}
                    renderItem={({item}) => <Recipe name={item.name} image={item.image} nav={()=>selectRecipe(item)} />}
                />
            </View>
        </View>
    )
}

function HomeScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation()

    // Navigate to the category page when Sweet or Savory see all is selected
    const selectFlavor = (flavor_type) => {
        dispatch(select(flavor_type))
        navigation.navigate("Categories", {flavor_type: flavor_type})
    }

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <HorizontalRecipe title="Favorites" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Recents" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title={savory} nav={()=>selectFlavor(savory)} />
                <HorizontalRecipe title={sweet} nav={()=>selectFlavor(sweet)} />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;



const home_style = StyleSheet.create({
    image: {
        alignContent: "center",
        flex: 1,

        borderWidth: 2,
        borderRadius: 5,
        borderColor: styles.borderColor.color,

        minHeight: 64,
        minWidth: 80,
        maxHeight: 64,
        maxWidth: 80,

        marginLeft: 12,
        marginRight: 12

    },
    row: {
        paddingRight: 8,
        paddingBottom: 18,

        height: 105,
    }
})
