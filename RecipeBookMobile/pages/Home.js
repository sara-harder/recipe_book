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

const Recipe = ({title, image, nav}) => {
    return(
        <Pressable onPress={nav} >
            <Text>replace with {image}</Text>
            <Text>{title}</Text>
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
    }]

    return(
        <View>
            <View>
                <Text>{title}</Text>
                <Pressable onPress={nav}>
                    <Text onPress={nav}>See All</Text>
                </Pressable>
            </View>
            <FlatList
                data={data}
                horizontal={true}
                renderItem={({item}) => <Recipe title={item.title} image={item.img} nav={item.nav} />}
            />
        </View>
    )
}

function HomeScreen() {
    const navigation = useNavigation()

    return(
        <SafeAreaView>
            <View>
                <Text>Title</Text>
                <HorizontalRecipe title="Favorites" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Recents" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Savory" nav={()=>navigation.navigate("Categories")} />
                <HorizontalRecipe title="Sweet" nav={()=>navigation.navigate("Categories")} />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;