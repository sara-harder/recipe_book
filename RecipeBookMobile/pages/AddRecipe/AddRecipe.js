// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState } from 'react';

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
        if (categories.size == 0) return false
        if (ingredients.length == 1) return false
        if (directions.length == 1) return false
        return true
    }

    // add the new recipe to the database
    const createRecipe = async () => {
        if (validateRecipe() == false) return
        const new_recipe = await recipe_funcs.addRecipe(name, portions, ingredients.slice(0, ingredients.length-1),
                    directions.slice(0, directions.length-1), image, source)

        // connect the recipe to the chosen categories
        for (const cat of categories) {
            rec_cat_funcs.connectRecipeCat(new_recipe._id, cat._id)
        }

        // go back to the previous page
        navigation.goBack()
    }

    return(
        <SafeAreaView style={styles.app}>
            <KeyboardAvoidingView style={[styles.container, form_style.form]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <FlatList
                    data={[0]}
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
    }
})
