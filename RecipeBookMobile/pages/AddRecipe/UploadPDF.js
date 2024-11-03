// react imports
import React from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useState, useEffect } from 'react';

// component imports
import DocumentPicker from 'react-native-document-picker';

// style imports
import styles, {text_styles} from '../../style.js';

// function imports
import { uploadPDF } from 'recipe-book/backend_connection/pdf_upload';

const UploadPDF = ({ setName, Ingredient, setIngredients, setDirections, setSource }) => {
    const [autofill, setAutofill] = useState(false);
    const [file, setFile] = useState(null);

    const handleUploadPDF = async () => {
        const res = await uploadPDF(file);
        if (res) {
            const recipe = res.recipe;
            if (recipe) {
                const formatted_ingredients = recipe.ingredients?.map((ingredient) =>
                    new Ingredient(ingredient.name, ingredient.quantity, ingredient.unit)
                ) || [];
                setName(recipe.name);
                setIngredients(formatted_ingredients);
                setDirections(recipe.directions);
                setSource(recipe.source);
                setAutofill(false);
            }
        }
    };

    useEffect(() => {
        if (!autofill) {
            setFile(null);
        }
    }, [autofill]);

    const selectPDF = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setFile(result[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("PDF selection canceled");
            } else {
                console.error(err);
            }
        }
    };

    return (
        <View style={upload_styles.section} >
            {autofill ? (
                <View>
                    <Text style={text_styles.boldText}>Autofill from PDF</Text>
                    <View style={[styles.row, upload_styles.file_select]}>
                        <Pressable style={upload_styles.choose_button} onPress={selectPDF}>
                            <Text style={[text_styles.itemText, {color: 'black'}]} >Choose File</Text>
                        </Pressable>
                        <Text style={upload_styles.file_name} numberOfLines={1} ellipsizeMode="tail">
                            {file ? file.name : 'No file chosen'}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Pressable style={upload_styles.button} onPress={() => setAutofill(false)}>
                            <Text style={text_styles.itemText} >Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[upload_styles.button, file ? {} : upload_styles.disabledButton]}
                            onPress={handleUploadPDF}
                            disabled={!file}
                        >
                            <Text style={text_styles.itemText} >Upload</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={{width: '40%'}} >
                    <Pressable style={upload_styles.button} onPress={() => setAutofill(true)}>
                        <Text style={text_styles.boldText} >Autofill from PDF</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default UploadPDF;


const upload_styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    file_select: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    file_name: {
        color: 'black',
        paddingLeft: 10,
        maxWidth: '70%',
    },
    choose_button: {
        borderRightWidth: 2,
        borderColor: styles.backgroundColor.color,
        padding: 5,
        paddingRight: 10,
        alignItems: 'center',
        width: '30%',
    },
    button: {
        backgroundColor: styles.headerColor.color,

        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 8,
        borderRadius: 5,

        alignText: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
