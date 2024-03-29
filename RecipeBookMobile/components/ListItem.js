// react imports
import React from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  View
} from 'react-native';

function ListItem({text, navigate}) {
    return(
        <View>
            <Pressable onPress={navigate} >
                <Text>{text}</Text>
            </Pressable>
        </View>
    )
}

export default ListItem
