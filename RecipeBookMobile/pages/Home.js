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

const Recipe = ({title, image}) => {
    return(
        <View>
            <Text>replace with {image}</Text>
            <Text>{title}</Text>
        </View>
    )
}

const HorizontalRecipe = ({title, nav}) => {
    const data = [{
        img: "image_1",
        title: "Recipe 1"
    },
    {
        img: "image_2",
        title: "Recipe 2"
    },
    {
        img: "image_3",
        title: "Recipe 3"
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
                renderItem={({item}) => <Recipe title={item.title} image={item.img} />}
            />
        </View>
    )
}

function HomeScreen() {
    const navigation = useNavigation()

    return(
        <SafeAreaView>
            <View>
                <Text></Text>
                <HorizontalRecipe title="Favorites" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Recents" nav={()=>navigation.navigate("Recipes")} />
                <HorizontalRecipe title="Savory" nav={()=>navigation.navigate("Categories")} />
                <HorizontalRecipe title="Sweet" nav={()=>navigation.navigate("Categoreis")} />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;