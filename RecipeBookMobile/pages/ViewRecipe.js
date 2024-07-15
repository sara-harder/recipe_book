// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

// style imports
import styles, {text_styles} from '../style.js';

// function imports
import { createFlexTable } from 'recipe-book';

const Ingredient = ({name, quantity}) => {
    return(
        <View style={[styles.row, {justifyContent: "flex-start"}]}>
            <Text style={recipe_style.ingredient_quantity}>{quantity},  </Text>
            <Text style={recipe_style.ingredient_name}>{name}</Text>
        </View>
    )
}

function ViewRecipe() {
    const ingredients = [{
        name: "mayonnaisre",
        qua: "150ml"
    },
    {
        name: "Tomato Sauce",
        qua: "10g"
    },
    {
        name: "Worcestershire",
        qua: "25g"
    }]

    const directions = [{
        text: "Line of directions 2 with specified ing",
    },
    {
        text: "Dir 2",
    },
    {
        text: "Dir 3",
    }]

    const rows = createFlexTable(2, ingredients.length)

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <View style={recipe_style.image}></View>
                <View style={recipe_style.list}>
                    <Text style={text_styles.boldText}>Ingredients:</Text>
                    <View style={styles.row}>
                        <FlatList
                            style={{minWidth: "49%", maxWidth: "50%"}}
                            data={ingredients.slice(rows[0][0], rows[0][1])}
                            renderItem={({item}) => <Ingredient name={item.name} quantity={item.qua}/>}
                        />
                        <FlatList
                            style={{minWidth: "49%", maxWidth: "50%"}}
                            data={ingredients.slice(rows[1][0], rows[1][1])}
                            renderItem={({item}) => <Ingredient name={item.name} quantity={item.qua}/>}
                        />
                    </View>
                </View>
                <View style={recipe_style.list}>
                    <Text style={text_styles.boldText}>Directions:</Text>
                    <FlatList
                        data={directions}
                        renderItem={({item}) => <Text style={recipe_style.direction_text} >{item.text}</Text>}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ViewRecipe;



const recipe_style = StyleSheet.create({
    ingredient_quantity: {
        width: "30%",
        textAlign: "right",
        padding: 1,
        color: text_styles.itemText.color
    },
    ingredient_name: {
        width: "70%",
        textAlign: "left",
        padding: 1,
        color: text_styles.itemText.color
    },
    list: {
        borderWidth: 2,
        borderColor: styles.borderColor.color,
        padding: 6,
        paddingTop: 4,
        paddingBottom: 12,
        backgroundColor: styles.itemBackground.color
    },
    direction_text: {
        minWidth: "100%",
        padding: 1,
        paddingLeft: 10,
        color: text_styles.itemText.color
    },
    image: {
        width: "100%",
        height: "30%",
        borderWidth: 2,
        borderRadius:10,
        borderColor: styles.borderColor.color,
        marginBottom: 15,
    },
})
