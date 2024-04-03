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
import {getHeaderTitle} from '@react-navigation/elements';

// style imports
import styles, {text_styles} from '../style.js';

const header = ({navigation, route, options, back}) => {
    const title = getHeaderTitle(options, route.name);

    return (
        <SafeAreaView style={header_style.header}>
            <View>
                <Text style={[text_styles.largeTitle, header_style.title]}>{title}</Text>
            </View>
        </SafeAreaView>
    )
}

export default header


const header_style = StyleSheet.create({
    header: {
        height: 100,
        minWidth: '100%',
        borderColor: styles.backgroundColor.color,
        borderBottomWidth: 15,
        backgroundColor: styles.headerColor.color,
    },
    title: {
        paddingTop: 15,
    }
})