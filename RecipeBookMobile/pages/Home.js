// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// style imports
import styles, {text_styles} from '../style.js';

const Recipe = ({title, image, nav}) => {
    return(
        <Pressable onPress={nav} >
            <View style={home_style.image} ></View>
            <Text style={[text_styles.itemText, {textAlign: "center"}]}>{title}</Text>
        </Pressable>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const navigation = useNavigation()

    const data = [{
        img: "image_1",
        title: "Recipe 1",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        img: "image_2",
        title: "Recipe 2",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        img: "image_3",
        title: "Recipe 3",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        img: "image_4",
        title: "Recipe 4",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    {
        img: "image_5",
        title: "Recipe 5",
        nav: ()=>navigation.navigate("ViewRecipe")
    },
    ]

    return(
        <View>
            <View style={styles.row}>
                <Text style={text_styles.smallTitle}>{title}</Text>
                <Text style={[text_styles.itemText, {paddingTop: 12, paddingRight: 12}]}
                    onPress={nav}>See All</Text>
            </View>
            <View style={home_style.row}>
                <FlatList
                    data={data}
                    horizontal={true}
                    renderItem={({item}) => <Recipe title={item.title} image={item.img} nav={item.nav} />}
                />
            </View>
        </View>
    )
}

function HomeScreen() {
    const navigation = useNavigation()

    return(
        <SafeAreaView style={styles.app}>
            <View style={styles.container}>
                <HorizontalRecipe title="Favorites" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Recents" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Savory" nav={()=>navigation.navigate("Categories")} />
                <HorizontalRecipe title="Sweet" nav={()=>navigation.navigate("Categories")} />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;



const home_style = StyleSheet.create({
    image: {
        alignContent: "center",
        flex: 1,

        borderWidth: 2,
        borderRadius: 5,
        borderColor: styles.borderColor.color,

        minHeight: 64,
        minWidth: 80,
        maxHeight: 64,
        maxWidth: 80,

        marginLeft: 12,
        marginRight: 12

    },
    row: {
        paddingRight: 8,
        paddingBottom: 15,

        height: 100,
    }
})