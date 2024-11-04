// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState, useRef } from 'react';

// component imports
import CategorySelector from './CategorySelector.js';
import IngredientsList from './Ingredients.js';
import DirectionsList from './Directions.js';
import UploadPDF from './UploadPDF.js'

// style imports
import styles, {text_styles} from '../../style.js';

// function imports
import { recipe_funcs } from 'recipe-book';
import { rec_cat_funcs } from 'recipe-book';


function AddRecipe({navigation, route}) {

    class Ingredient {
        constructor(name, quantity=undefined, unit=undefined) {
          this.name = name;
          this.quantity = quantity;
          this.unit = unit;
        }
    }

    const [name, setName] = useState('')
    const [portions, setPortions] = useState(4)
    const [categories, setCategories] = useState([])
    const [ingredients, setIngredients] = useState([new Ingredient("")])
    const [directions, setDirections] = useState([""])
    const [image, setImage] = useState('')
    const [source, setSource] = useState('')

    const [validated, setValidated] = useState(false)
    const validateRecipe = () => {
        setValidated(true)
        if (name == '') return false
        if (portions <= 0 || portions > 100) return false
        if (categories.length == 0) return false
        if (ingredients.length == 1) return false
        if (directions.length == 1) return false
        return true
    }

    const scrollRef = useRef()

    // send the new recipe to the map page to map ingredients to directions
    const sendRecipe = () => {
        if (validateRecipe() == false) {
            scrollRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            });
            return
        }

        navigation.navigate("MapRecipe", {recipe: {
            name, portions, ingredients: ingredients.slice(0, ingredients.length-1),
            directions: directions.slice(0, directions.length-1), image: image.replace("C:\\fakepath\\", "../images/"),
            source, categories}})
    }

    return(
        <SafeAreaView style={styles.app}>
            <KeyboardAvoidingView style={[styles.container, form_style.form]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <FlatList
                    data={[0]}
                    ref={scrollRef}
                    renderItem={({item}) => { return(<>
                        <UploadPDF setName={setName} Ingredient={Ingredient} setIngredients={setIngredients} setDirections={setDirections} setSource={setSource}/>

                        <Text style={text_styles.itemText}>Recipe Name</Text>
                        <TextInput
                            style={form_style.input}
                            onChangeText={(text) => setName(text)}
                            value={name}
                            placeholder="Enter name"
                            placeholderTextColor='grey'
                        />

                        <Text style={text_styles.itemText}>Portions</Text>
                        <TextInput
                            style={form_style.input}
                            onChangeText={(text) => setPortions(text)}
                            value={portions.toString()}
                            keyboardType="numeric"
                            max={100}
                            min={1}
                        />

                        <Text style={text_styles.itemText}>Source</Text>
                        <TextInput
                            style={form_style.input}
                            onChangeText={(text) => setSource(text)}
                            value={source}
                            placeholder="URL, (last name) family recipe, recipe book..."
                            placeholderTextColor='grey'
                        />

                        <Text style={text_styles.itemText}>Category</Text>
                        <View style={{marginBottom: 13}}>
                            <CategorySelector route={route} selected={categories} setSelected={setCategories} validated={validated}/>
                        </View>

                        <Text style={text_styles.itemText}>Ingredients</Text>
                        <IngredientsList Ingredient={Ingredient} ingredients={ingredients} setIngredients={setIngredients} />

                        <Text style={text_styles.itemText}>Directions</Text>
                        <DirectionsList directions={directions} setDirections={setDirections} />

                        <Pressable style={form_style.button} onPress={sendRecipe}>
                            <Text style={text_styles.itemText} >Add Recipe</Text>
                        </Pressable>
                    </>)}}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddRecipe;


const form_style = StyleSheet.create({
    form: {
        width: '90%',
        alignItems: 'center'
    },
    input: {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 12,
        paddingRight: 12
    },
    scroll_container: {
        paddingBottom: 20
    },
    button: {
        backgroundColor: styles.headerColor.color,

        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 8,
        borderRadius: 5,

        alignText: 'center',
        width: '33.33333%'
    },
})
