// react imports
import React from 'react';
import {
  SafeAreaView,
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


const Heart = ({favorite, setFavorite}) => {
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
                color={styles.accentColor.color}
            />
        </Pressable>
    )
}

const Header = ({navigation, route, options, back}) => {
    const dispatch = useDispatch();

    const title = getHeaderTitle(options, route.name);

    // let the header know whether the back button should be enabled
    useEffect(() => {
        options.setCanGoBack(navigation.canGoBack())
    }, [navigation.canGoBack()])


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

        // When page changes to a different recipe, update the favorite state
        useEffect(() => {
            setFavorite(start_fav)
        }, [recipe])

        // Update favorites when leave page if recipe is favorited / unfavorited
        const backButton = () => {
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
        // let the header know to use new backButton function
        useEffect(() => {
            options.setBack(backButton)
        }, [backButton])
    }


    return (
        <SafeAreaView style={header_style.header}>
            <View>
                <View style={[styles.row, {justifyContent: 'left'}]}>
                    <View style={[text_styles.largeTitle, {paddingTop: 3}]}>
                        {route.name == "ViewRecipe" ? <Heart favorite={fav} setFavorite={setFav} /> : null}
                    </View>
                    <Text style={[text_styles.largeTitle, {maxWidth: "80%"}]}>{title}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Header


const header_style = StyleSheet.create({
    header: {
        minWidth: '100%',
        borderColor: styles.backgroundColor.color,
        borderBottomWidth: 15,
        backgroundColor: styles.headerColor.color,
        paddingLeft: 8,
    },
})