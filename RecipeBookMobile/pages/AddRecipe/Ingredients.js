// react imports
import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState, useEffect } from 'react';

// style imports
import styles, {text_styles} from '../../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// function imports
import { twoColumns } from 'recipe-book/helpers';


const UnitList = ({units, closePopup}) => {
    return(
        <FlatList
            data={units}
            style={{width: '33.33333%'}}
            renderItem={({item: unit}) => { return(
                <Pressable onPress={() => closePopup(unit)}>
                    <Text style={[text_styles.itemText, ingredients_style.unit_item]} >{unit.trim()}</Text>
                </Pressable>
            )}}
        />
    )
}


const UnitModal = ({setUnit, index, open, setOpen}) => {

     // possible units
    const metric = ['mg', 'g', 'kg', 'ml', 'cl', 'dl', 'l']
    const imperial = ['tsp', 'tbsp', ' cup(s)', 'lb', 'oz', 'fl oz', ' pint(s)', ' quart(s)', ' gallon(s)']
    const other = [' small', ' medium', ' large', ' clove(s)', ' slice(s)', ' cube(s)', ' drop(s)']

    const closePopup = (value) => {
        setUnit(value, index)
        setOpen(false)
    }

    return (
        <>
            <Modal
                animationType="fade"
                visible={open}
                transparent={true}
                onRequestClose={() => setOpen(false)}
            >
                <View style={ingredients_style.faded_background}>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                visible={open}
                transparent={true}
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={ingredients_style.modal_container} onPress={() => setOpen(false)}>
                    <Pressable style={ingredients_style.modal_content} onPress={(event) => event.stopPropagation()}>
                        <FlatList
                            data={[0]}
                            renderItem={({item}) => { return(<>
                                <View style={styles.row}>
                                    <Pressable onPress={() => closePopup(null)} style={{width: '33.33333%'}}>
                                        <Text style={[text_styles.itemText, ingredients_style.unit_item, {color: 'grey'}]} >no unit</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setOpen(false)}>
                                        <Icon
                                            name={"close"}
                                            size={30}
                                            color={'grey'}
                                            style={{padding: 2}}
                                        />
                                    </Pressable>
                                </View>
                                <View style={styles.row}>
                                    <UnitList units={metric} closePopup={closePopup} />
                                    <UnitList units={imperial} closePopup={closePopup} />
                                    <UnitList units={other} closePopup={closePopup} />
                                </View>
                            </>)}}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    )
}



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

     const [open, setOpen] = useState(false)
     const [unit_idx, setIndex] = useState(0)

     return(
         <>
            <FlatList
                data={ingredients}
                renderItem={({item, index}) => { return(
                    <View style={styles.row}>
                        <View style={{justifyContent: 'center', marginBottom: 15}}>
                            <Text style={text_styles.itemText}>{index + 1}.</Text>
                        </View>
                        <View style={[styles.row, {width: '94%'}]}>
                            <TextInput
                                style={[ingredients_style.input, {width: '49%'}]}
                                onChangeText={(text) => setName(text, index)}
                                value={item.name}
                                placeholder="Add ingredient (Name)"
                                placeholderTextColor='grey'
                            />
                            <TextInput
                                style={[{width: '29%'}, item.name == '' ? reduced_opacity : ingredients_style.input]}
                                onChangeText={(text) => setQuantity(text, index)}
                                value={item.quantity ? item.quantity.toString() : undefined}
                                placeholder="Quantity"
                                placeholderTextColor='grey'
                                keyboardType="numeric"
                                editable={item.name != ''}
                            />
                            <View pointerEvents={item.name != '' ? 'auto' : 'none'} style={{width: '19%'}} >
                                <Pressable onPress={() => {setOpen(!open)
                                        setIndex(index)}}>
                                    <TextInput
                                        style={item.name == '' ? reduced_opacity : ingredients_style.input}
                                        value={item.unit}
                                        placeholder="Unit"
                                        placeholderTextColor='grey'
                                        editable={false}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )}}
            />
            <UnitModal setUnit={setUnit} index={unit_idx} open={open} setOpen={setOpen} />
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
    modal_container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',

        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 3,
    },
    modal_content: {
        backgroundColor: 'white',
        margin: 20,
        marginBottom: 0,
        padding: 10,
        paddingTop: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: '60%'
    },
    unit_item: {
        color: 'black',
        backgroundColor: 'white',
        textAlign: 'center',
        margin: 5,
        borderWidth: 2,
        borderColor: styles.headerColor.color,
        borderRadius: 5,
        width: '90%',
        flex: 1,
        alignSelf: 'center'
    },
    faded_background: {
        height: '100%',
        backgroundColor: `${styles.backgroundColor.color}80`,
    },
})

const reduced_opacity = [ingredients_style.input, {opacity: .5}]