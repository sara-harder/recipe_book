// react imports
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// style imports
import styles from '../style.js';


function Loading () {
    return (
        <SafeAreaView style={styles.app}>
            <View style={[styles.container, {justifyContent: 'center'}]}>
                <Text style={loading_style.title}>Loading...</Text>
            </View>
        </SafeAreaView>
    )
}

export default Loading


const loading_style = StyleSheet.create({
    title: {
        fontSize: 30,
        color: styles.textColor.color,
        fontFamily: styles.fontBold.fontFamily,

        marginLeft: 6,
        marginBottom: 6,

        alignSelf: 'center'
    },
});