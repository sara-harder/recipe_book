// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
  View
} from 'react-native';

// style imports
import styles, {text_styles} from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// function imports
import { twoColumns } from 'recipe-book/helpers';

const List = ({data, navigate}) => {
    return (
        <FlatList
            style={{width: "50%"}}
            data={data}
            renderItem={({item}) => { return(
                <Pressable onPress={() => navigate(item)} >
                    <View style={[item_style.no_image]}>
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
    no_image: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,

        borderRadius: 5,

        minHeight: 80,
        maxHeight: 80,

        margin: 8,
        padding: 8,

        backgroundColor: styles.secondaryItemBackground.color,
    },
})