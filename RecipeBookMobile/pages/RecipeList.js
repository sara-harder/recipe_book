// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// component imports
import ListItem from '../components/ListItem.js'

function RecipeList() {
    const navigation = useNavigation()

    const data = [{
        text: "Recipe 1",
        nav: () => navigation.navigate("ViewRecipe")
    },
    {
        text: "Recipe 2",
        nav: () => navigation.navigate("ViewRecipe")
    },
    {
        text: "Recipe 3",
        nav: () => navigation.navigate("ViewRecipe")
    }]

    return(
        <SafeAreaView>
            <View>
                <Text>Title</Text>
                <FlatList
                    data={data}
                    renderItem={({item}) => <ListItem text={item.text} navigate={item.nav} />}
                />
            </View>
        </SafeAreaView>
    )
}

export default RecipeList;
