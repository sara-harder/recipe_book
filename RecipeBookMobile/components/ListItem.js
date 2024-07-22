// react imports
import React from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  View
} from 'react-native';

// style imports
import styles, {text_styles} from '../style.js';

function ListItem({text, navigate}) {
    return(
        <Text onPress={navigate} style={item_style.item}>{text}</Text>
    )
}

export default ListItem


const item_style = StyleSheet.create({
    item: {
        fontSize: 24,
        color: styles.secondaryTextColor.color,
        fontFamily: styles.fontBold.fontFamily,
        textAlign: 'center',

        borderRadius: 20,
        borderColor: styles.borderColor.color,

        backgroundColor: styles.secondaryItemBackground.color,

        margin: 12,
        padding: 16
    }
})
