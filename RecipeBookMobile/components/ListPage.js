// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

// style imports
import styles, {text_styles} from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// function imports
import { twoColumns } from 'recipe-book/helpers';


// TEMPORARY function that hard codes recipe names to image path
// react native refuses to access image path from variable
// once images are stored in cloud, will be able to access them through URL
const getImageSource = (name) => {
    switch (name) {
        case 'Carbonara':
            return require('../assets/images/carbonara.webp');
        case 'Chocolate Chip Cookies':
            return require('../assets/images/chocolate_chip_cookies.jpg');
        case 'Crepes':
            return require('../assets/images/crepes.jpg');
        case 'Htipiti Feta Dip':
            return require('../assets/images/feta_dip.jpg');
        case 'Focaccia':
            return require('../assets/images/focaccia.jpg');
        case 'Baked Mac & Cheese':
            return require('../assets/images/mac_and_cheese.jpg');
        case 'Oven Roasted Potatoes':
            return require('../assets/images/oven_roasted_potatoes.jpg');
        case 'Pasta e Piselli con Pancetta':
            return require('../assets/images/pasta_piselli.jpg');
        case 'Spinach and Feta Pasta':
            return require('../assets/images/spinach_feta.jpg');
        case 'Teriyaki Rice':
            return require('../assets/images/teriyaki.jpg');
        case 'Vegetable Curry':
            return require('../assets/images/vegetable_curry.jpg');
        case 'Waffles':
            return require('../assets/images/waffles.webp');
        default:
            return null;
    }
};


const List = ({data, navigate}) => {
    return (
        <FlatList
            style={{width: "50%"}}
            data={data}
            renderItem={({item}) => { return(
                <Pressable onPress={() => navigate(item)} >
                    {getImageSource(item.name) ?
                        <View style={[item_style.card, {padding: 0}]} >
                            <Image source={getImageSource(item.name)} style={item_style.image} />
                            <View style={item_style.text_cont}>
                                <Text style={[text_styles.itemText, {textAlign: 'center'}]}>{item.name}</Text>
                            </View>
                        </View>
                    :
                        <View style={[item_style.card]}>
                            {item.name == "New" ?
                                <View style={[text_styles.itemText, {justifyContent: 'center'}]}>
                                    <Icon
                                        name='plus'
                                        size={30}
                                        color={styles.textColor.color}
                                    />
                                </View>
                            :
                                <Text style={[text_styles.itemText, {textAlign: 'center', fontSize: 18}]}>{item.name}</Text>
                            }
                        </View>
                    }
                </Pressable>
            )}}
        />
    )
}

function ListPage({data, navigate}) {
    const [col_1, col_2] = twoColumns(data)

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <List data={col_1} navigate={navigate} />
                    <List data={col_2} navigate={navigate} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ListPage


const item_style = StyleSheet.create({
    text_cont: {
        justifyContent: "center",
        flex: 1,

        paddingLeft: 8,
        paddingRight: 8,
    },
    image: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,

        minHeight: '40%',
        maxHeight: '40%',
        minWidth: '100%',
        maxWidth: '100%',
    },
    card: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,

        borderRadius: 5,

        minHeight: 96,
        maxHeight: 96,

        margin: 8,
        padding: 8,

        backgroundColor: styles.secondaryItemBackground.color,
    },
})