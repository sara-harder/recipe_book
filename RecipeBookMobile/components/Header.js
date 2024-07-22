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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const header = ({navigation, route, options, back}) => {
    const title = getHeaderTitle(options, route.name);

    return (
        <SafeAreaView style={header_style.header}>
            <View>
                {title == "My Recipes" ? <Text></Text> : (
                    <Text onPress={navigation.goBack} style={header_style.text}>
                        Back
                    </Text>
                )}
                <View style={styles.row}>
                    <Text style={text_styles.largeTitle}>{title}</Text>
                    <View style={[header_style.icon, text_styles.largeTitle]}>
                        {route.name == "ViewRecipe" ? (
                            <Icon
                                name={"heart-outline"}
                                size={35}
                                color={styles.secondaryTextColor.color}
                            />
                        ) : null}
                    </View>
                </View>
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
    text: {
        color: styles.secondaryTextColor.color,
        fontFamily: styles.fontRegular.fontFamily,

        paddingLeft: 10,
        paddingBottom: 0,
        paddingTop: 5
    },
    icon: {
        paddingRight: 15,
        paddingLeft: 0
    }
})