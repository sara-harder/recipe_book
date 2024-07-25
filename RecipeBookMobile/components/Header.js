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
import { useDispatch, useSelector } from 'react-redux';
import { getHeaderTitle } from '@react-navigation/elements';

// style imports
import styles, {text_styles} from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// function imports
import { setFavorites } from 'recipe-book/redux/userSlice';


const Heart = ({route, favorite, setFavorite}) => {
    const [icon, setIcon] = useState("heart-outline");

    // Toggle heart icon if favorite is selected or not
    useEffect(() => {
        if (favorite) setIcon("heart");
        else setIcon("heart-outline");
    }, [favorite]);

    return (
        <Pressable onPress={() => setFavorite(!favorite)}>
            <Icon
                name={icon}
                size={35}
                color={styles.secondaryTextColor.color}
            />
        </Pressable>
    )
}

const header = ({navigation, route, options, back}) => {
    const dispatch = useDispatch();

    const title = getHeaderTitle(options, route.name);
    let backButton = navigation.goBack;

    let fav = false;
    let setFav = () => {};

    // Enable selecting / deselecting favorite recipes on View Recipe page
    if (route.name == "ViewRecipe"){
        // Determine if recipe is already in favorites
        const favorites = useSelector(state=> state.user.value.favorites);
        const {recipe} = route.params
        const start_fav = favorites.includes(recipe._id)

        // Create favorite state variable, modifiable in Heart component
        const [favorite, setFavorite] = useState(start_fav)
        fav = favorite
        setFav = setFavorite

        // Update favorites when leave page if recipe is favorited / unfavorited
        backButton = () => {
            if (start_fav != favorite) {
                if (favorite) dispatch(setFavorites(favorites.concat(recipe._id)))
                else {
                    const i = favorites.indexOf(recipe._id)
                    const new_favs = favorites.slice()
                    new_favs.splice(i, 1)
                    dispatch(setFavorites(new_favs))
                }
            }

            navigation.goBack()
        }
    }

    return (
        <SafeAreaView style={header_style.header}>
            <View>
                {title == "My Recipes" ? <Text></Text> : (
                    <Text onPress={backButton} style={header_style.text}>
                        Back
                    </Text>
                )}
                <View style={styles.row}>
                    <Text style={text_styles.largeTitle}>{title}</Text>
                    <View style={[header_style.icon, text_styles.largeTitle]}>
                        {route.name == "ViewRecipe" ? <Heart route={route} favorite={fav} setFavorite={setFav} /> : null}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default header


const header_style = StyleSheet.create({
    header: {
        height: 100,
        minWidth: '100%',
        borderColor: styles.backgroundColor.color,
        borderBottomWidth: 15,
        backgroundColor: styles.headerColor.color,
    },
    text: {
        color: styles.secondaryTextColor.color,
        fontFamily: styles.fontRegular.fontFamily,

        paddingLeft: 10,
        paddingBottom: 0,
        paddingTop: 5
    },
    icon: {
        paddingRight: 15,
        paddingLeft: 0
    }
})