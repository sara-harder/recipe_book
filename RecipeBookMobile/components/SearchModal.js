// react imports
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';

// style imports
import styles, {text_styles} from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// function imports
import { recipe_funcs } from 'recipe-book';
import { selectR } from 'recipe-book/redux/selectionSlice';
import { setRecents } from 'recipe-book/redux/userSlice';


const SearchResults = ({recipes, search, close}) => {
// list component for recipe search results
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const user = useSelector(state=> state.user.value);

    // Navigate to the view recipe page when a recipe is selected
    const selectRecipe = (recipe) => {
        let recents = [recipe._id].concat(user.recents)
        if (user.recents.includes(recipe._id)) {
            const set_recents = new Set(recents)
            recents = Array.from(set_recents)
        } else recents = recents.slice(0, 15)
        dispatch(setRecents(recents))

        dispatch(selectR(recipe.name))
        navigation.navigate("AppPages", {screen: "ViewRecipe", params: {recipe: recipe}})
        close()
    }

    // leave a message for user when recipe list is empty
    if (recipes.length == 0 && search != '')  {
        return (
            <View>
                <Text style={[search_style.result, {color: 'grey'}]}>
                    No recipes found
                </Text>
            </View>
        )
    }

    // list of found recipes
    return(
        <View>
            <FlatList
                data={recipes}
                keyExtractor={(item, index)=> index.toString()}
                renderItem = { ({item}) =>
                    <Pressable onPress={() => {selectRecipe(item)}}>
                        <Text style={search_style.result}>{item.name}</Text>
                    </Pressable>
                }
            />
        </View>
    )
}


const SearchBar = ({popup, close}) => {
    const navigation = useNavigation()

    const [results, setResults] = useState([]);
    const [search, setSearch] = useState('');

    // retrieve the recipes based on the search
    useEffect(() =>{
        const getRecipes = async ()=> {
            let recipes = await recipe_funcs.searchForRecipe(search)
            if (recipes == undefined) recipes = []
            setResults(recipes)
        }
        getRecipes();
    }, [search]);

    // close the popup and clear the search
    const clear = () => {
        close()
        setSearch('')
    }

    return(
        <View>
            <Modal
                animationIn={"slideInDown"}
                animationOut={"slideOutUp"}
                isVisible={popup}
                transparent={true}
                onRequestClose={() => clear()}
                backdropTransitionOutTiming={0}
            >
                <View style={search_style.container}>
                    <View style={search_style.popup}>
                        <View style={styles.row}>
                            <TextInput
                                placeholder='Search Recipes'
                                placeholderTextColor={'grey'}
                                value={search}
                                onChangeText={(text) => setSearch(text)}
                                style={[text_styles.boldText, search_style.search]}
                            />
                            <Pressable onPress={() => clear()}>
                                <Icon
                                    name={"close"}
                                    size={30}
                                    color={'black'}
                                    style={{paddingTop: 6}}
                                />
                            </Pressable>
                        </View>
                        <SearchResults recipes={results} search={search} close={clear}/>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default SearchBar

const search_style = StyleSheet.create({
    container: {
        height: '107%',
        width: '111%',
        position: "absolute",
        left: "-6%",
        top: "-3.5%",
    },
    popup: {
        width: '100%',
        backgroundColor: 'white',
        padding: 9,
        paddingLeft: 24
    },
    search: {
        color: 'black',
        width: '80%',
        fontSize: 18,
        paddingBottom: 12,
        paddingTop: 12,
    },
    result: {
        color: 'black',
        padding: 8,
        fontSize: 16
    }
})
