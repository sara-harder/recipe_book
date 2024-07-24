// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

// style imports
import styles, {text_styles} from '../style.js';

// function imports
import { helpers } from 'recipe-book';

const Ingredient = ({name, quantity, unit}) => {
    return(
        <View style={[styles.row, {justifyContent: "flex-start"}]}>
            <Text style={recipe_style.ingredient_quantity}>{quantity}{unit}  </Text>
            <Text style={recipe_style.ingredient_name}>{name}</Text>
        </View>
    )
}

function ViewRecipe({route}) {
    let {recipe} = route.params;

    const ingredients = recipe.ingredients
    const rows = [[0, Math.ceil(ingredients.length/2)], [Math.ceil(ingredients.length/2), ingredients.length]]

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={recipe_style.image}></View>
                    <View style={recipe_style.list}>
                        <Text style={text_styles.boldText}>Ingredients:</Text>
                        <View style={styles.row}>
                            <View style={{minWidth: "49%", maxWidth: "50%"}}>
                                {ingredients.slice(rows[0][0], rows[0][1]).map((item, index) => {
                                   return (
                                       <Ingredient name={item.name} quantity={item.quantity} unit={item.unit} key={index}/>
                                   )
                                })}
                            </View>
                            <View style={{minWidth: "49%", maxWidth: "50%"}}>
                                {ingredients.slice(rows[1][0], rows[1][1]).map((item, index) => {
                                    return (
                                        <Ingredient name={item.name} quantity={item.quantity} unit={item.unit} key={index}/>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                    <View style={recipe_style.list}>
                        <Text style={text_styles.boldText}>Directions:</Text>
                        <View>
                            {recipe.directions.map((item, index) => {
                                return(
                                    <Text style={recipe_style.direction_text} key={index}>{index+1}. {item}</Text>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
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
        height: 175,
        borderWidth: 2,
        borderRadius:10,
        borderColor: styles.borderColor.color,
        marginBottom: 15,
    },
})
