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

function RecipeCategories() {
    const navigation = useNavigation()

    const data = [{
        text: "Cat 1",
        nav: () => navigation.navigate("Recipes")
    },
    {
        text: "Cat 2",
        nav: () => navigation.navigate("Recipes")
    },
    {
        text: "Cat 3",
        nav: () => navigation.navigate("Recipes")
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

export default RecipeCategories;
