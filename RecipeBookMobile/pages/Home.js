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

// style imports
import styles, {text_styles} from '../style.js';

// function imports
import { helpers } from 'recipe-book';

const Recipe = ({name, image, nav}) => {
    return(
        <Pressable onPress={nav} >
            <View style={home_style.image} ></View>
            <Text style={[text_styles.itemText, {textAlign: "center"}]}>{name}</Text>
        </Pressable>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const navigation = useNavigation()

    const [real_data, setData] = useState([]);

    const data = [{
        image: "image_1",
        name: "Recipe 1",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        image: "image_2",
        name: "Recipe 2",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        image: "image_3",
        name: "Recipe 3",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        image: "image_4",
        name: "Recipe 4",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        image: "image_5",
        name: "Recipe 5",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    ]

    // Pull all products from the database
    useEffect(() =>{
        const getUserRecipes = async ()=> {
            setData(data)
        }
        const getCatRecipes = async ()=> {
            const recipes = await helpers.getRandomRecipes(title)
            setData(recipes)
        }
        if (title == "Savory" || title == "Sweet") getCatRecipes();
        else getUserRecipes()
    }, []);

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
                    renderItem={({item}) => <Recipe name={item.name} image={item.image} nav={()=>navigation.navigate("ViewRecipe", {recipe: item})} />}
                />
            </View>
        </View>
    )
}

function HomeScreen() {
    const navigation = useNavigation()

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <HorizontalRecipe title="Favorites" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Recents" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Savory" nav={()=>navigation.navigate("Categories")} />
                <HorizontalRecipe title="Sweet" nav={()=>navigation.navigate("Categories")} />
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
