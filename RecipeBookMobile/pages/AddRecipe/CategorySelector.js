// react imports
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useState, useEffect } from 'react';

// component imports
import { MultipleSelectList } from 'react-native-dropdown-select-list'

// style imports
import styles, {text_styles} from '../../style.js';

// function imports
import { category_funcs } from 'recipe-book';



function CategorySelector ({route, selected, setSelected, validated}) {
    // Get the categories for the dropdown
    const [categories, setCategories] = useState([])
    useEffect(() =>{
        const getCategories = async ()=> {
            const savory = await category_funcs.getFlavorType("Savory")
            const sweet = await category_funcs.getFlavorType("Sweet")
            const cats = savory.concat(sweet)
            const data = cats.map((item) => {return {key: item, value: item.name}})
            setCategories(data)
        }
        getCategories()
    }, []);

    return(
        <>
            <View style={dropdown_style.filler_view}></View>
            <MultipleSelectList
                data={categories}
                setSelected={(val) => setSelected(val)}
                save="key"
                maxHeight={225}
                defaultOption={route.params ? {key: route.params.preselected, value: route.params.preselected.name} : null}
                placeholder='Select categories'
                searchPlaceholder='Search'
                notFoundText='No results found'
                boxStyles={dropdown_style.dropdown_box}
                inputStyles={{color: 'grey', margin: 12}}
                labelStyles={{height: 0}}
                dropdownStyles={dropdown_style.dropdown_list}
                dropdownTextStyles={{color: 'black'}}
                badgeStyles={dropdown_style.selected}
                placeholderTextColor='grey'
            />
        </>
    )
}

export default CategorySelector


const dropdown_style = StyleSheet.create({
    filler_view: {
        borderRadius: 5,
        backgroundColor: 'white',
        width: '100%',
        height: 45,
        position: 'absolute',
        zIndex: -1
    },
    dropdown_box: {
        color: 'grey',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 12,
        alignItems: 'center',
        marginBottom: 2,
        borderWidth: 0,
    },
    dropdown_list: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: '100%',
        zIndex: 1,
        borderWidth: 0,
    },
    selected: {
        borderRadius: 5,
        marginRight: 6,
    },
})