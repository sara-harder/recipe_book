// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

const Ingredient = ({name, quantity}) => {
    return(
        <View>
            <Text>{quantity}, </Text>
            <Text>{name}</Text>
        </View>
    )
}

function ViewRecipe() {
    const ingredients = [{
        name: "Ing 1",
        qua: "15g"
    },
    {
        name: "Ing 2",
        qua: "10g"
    },
    {
        name: "Ing 3",
        qua: "25g"
    }]

    const directions = [{
        text: "Dir 1",
    },
    {
        text: "Dir 2",
    },
    {
        text: "Dir 3",
    }]

    return(
        <SafeAreaView>
            <View>
                <Text>Title</Text>
                <Text>Image</Text>
                <FlatList
                    data={ingredients}
                    renderItem={({item}) => <Ingredient name={item.name} quantity={item.qua}/>}
                />
                <FlatList
                    data={directions}
                    renderItem={({item}) => <Text>{item.text}</Text>}
                />
            </View>
        </SafeAreaView>
    )
}

export default ViewRecipe;
