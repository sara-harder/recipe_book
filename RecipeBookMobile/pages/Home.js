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

const Recipe = ({title}) => {
    return(
        <View>
            <Text>{title}</Text>
        </View>
    )
}

const HorizontalRecipe = ({title}) => {
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
                <Text>See All</Text>
            </View>
            <FlatList
                data={data}
                horizontal={true}
                keyExtractor={item => item.id}
                renderItem={({item}) => <Recipe title={item.title} />}
            />
        </View>
    )
}

function HomeScreen() {
    return(
        <SafeAreaView>
            <View>
                <Text></Text>
                <HorizontalRecipe title="Favorites" />
                <HorizontalRecipe title="Recents" />
                <HorizontalRecipe title="Savory" />
                <HorizontalRecipe title="Sweet" />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;