// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

// component imports
import ListItem from '../components/ListItem.js'

// style imports
import styles from '../style.js';

// function imports
import { category_funcs } from 'recipe-book';

function Categories({route}) {
    let {flavor_type} = route.params;

    const navigation = useNavigation()

    const [data, setData] = useState([]);

    // Get the categories to display
    useEffect(() =>{
        const getCategories = async ()=> {
            const categories = await category_funcs.getFlavorType(flavor_type)
            setData(categories)
        }
        getCategories()
    }, []);

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={({item}) => <ListItem text={item.name} navigate={item.nav} />}
                />
            </View>
        </SafeAreaView>
    )
}

export default Categories;
