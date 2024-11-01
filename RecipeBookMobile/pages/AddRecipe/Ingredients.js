// react imports
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState, useEffect } from 'react';

// component imports
import { SelectList } from 'react-native-dropdown-select-list'

// style imports
import styles, {text_styles} from '../../style.js';

// function imports
import { category_funcs } from 'recipe-book';



function IngredientsList ({Ingredient, ingredients, setIngredients}) {
     // index of last ingredient
     const end_idx = ingredients.length-1

     // when user starts typing, add a new empty input line
     if (ingredients.length == 0 || ingredients[end_idx].name != "") {
         const copy = ingredients.slice()
         copy.push(new Ingredient(""))
         setIngredients(copy)
     }

     // update the ingredient name while user is typing. find ingredient to update using index
     const setName = (value, index) => {
         const copy = ingredients.slice()
         copy[index].name = value
         setIngredients(copy)
     }

     // update the ingredient quantity while user is typing. find ingredient to update using index
     const setQuantity = (value, index) => {
         const copy = ingredients.slice()
         copy[index].quantity = value
         setIngredients(copy)
     }

     // possible units
     const metric = ['mg', 'g', 'kg', 'ml', 'cl', 'dl', 'l']
     const imperial = ['tsp', 'tbsp', ' cup(s)', 'lb', 'oz', 'fl oz', ' pint(s)', ' quart(s)', ' gallon(s)']
     const other = [' small', ' medium', ' large', ' clove(s)', ' slice(s)', ' cube(s)']

     const units = metric.concat(imperial.concat(other)).map((item, index) => {
        return {key: index, value: item}
    })

     // update the ingredient unit when user selects. find ingredient to update using index
     const setUnit = (value, index) => {
         const copy = ingredients.slice()
         copy[index].unit = value
         setIngredients(copy)
     }


     // remove the appropriate ingredient when trash icon is clicked
     const removeIngredient = (index) => {
         const copy = ingredients.slice(0, index)
         const copy2 = ingredients.slice(index+1, end_idx)

         setIngredients(copy.concat(copy2))

         setTrash(-1)
     }

     // change the trash-can color on hover
     const [trashIdx, setTrash] = useState(-1)

     const visible = ingredients.length <= 1
     const [rowOpacity, setOpacity] = useState(-1)

     return(
         <>
            <FlatList
                data={ingredients}
                renderItem={({item, index}) => { return(
                    <View style={styles.row}>
                        <View style={{justifyContent: 'center', marginBottom: 15}}>
                            <Text style={text_styles.itemText}>{index + 1}.</Text>
                        </View>
                        <TextInput
                            style={ingredients_style.input}
                            onChangeText={(text) => setName(text, index)}
                            value={item.name}
                            placeholder="Add ingredient (Name)"
                            placeholderTextColor='grey'
                        />
                        <TextInput
                            style={item.name == '' ? reduced_opacity : ingredients_style.input}
                            onChangeText={(text) => setQuantity(text, index)}
                            value={item.quantity ? item.quantity.toString() : undefined}
                            placeholder="Quantity"
                            placeholderTextColor='grey'
                            keyboardType="numeric"
                            editable={item.name != ''}
                        />
                        <View pointerEvents={item.name != '' ? 'auto' : 'none'}>
                            <SelectList
                                setSelected={(val) => setUnit(val, index)}
                                data={units}
                                search={false}
                                save="value"
                                placeholder="Unit"
                                boxStyles={item.name == '' ?
                                    [reduced_opacity, {marginBottom: 0}]
                                :
                                    [ingredients_style.input, {marginBottom: 0}]}
                                dropdownStyles={[ingredients_style.input, {marginTop: 0}]}
                            />
                        </View>
                    </View>
                )}}
            />
         </>
     )
}

export default IngredientsList


const ingredients_style = StyleSheet.create({
    input: {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        height: 45
    },
})

const reduced_opacity = [ingredients_style.input, {opacity: .5}]