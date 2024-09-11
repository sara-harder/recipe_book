// react imports
import React from 'react';
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useState } from 'react';

// component imports
import Menu from './MenuModal.js'
import SearchBar from './SearchModal.js'

// style imports
import styles from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Header = ({navigation, route, options}) => {
    // back button may be more complex for certain pages, otherwise use standard
    let backButton = options.goBack;
    if (backButton == undefined) backButton = navigation.goBack

    // page tells header whether back button should be visible or not
    const canGoBack = options.back

    // bool for the search popup when magnifying glass is clicked
    const [search, popSearch] = useState(false)
    // bool for the menu popup when hamburger is clicked
    const [menu, popMenu] = useState(false)

    return(
        <SafeAreaView style={header_style.header}>
            <SearchBar popup={search} close={() => popSearch(false)}/>
            <Menu popup={menu} close={() => popMenu(false)}/>
            <View style={styles.row}>
                {canGoBack ? (
                    <Text onPress={backButton} style={header_style.back}>
                        Back
                    </Text>
                ) : <Text></Text>}
                <View style={[styles.row, {justifyContent: 'right'}]}>
                    <Pressable onPress={() => {popSearch(true)}}>
                        <Icon
                            name={"magnify"}
                            size={30}
                            color={styles.textColor.color}
                            style={{paddingTop: 9}}
                        />
                    </Pressable>
                    <Pressable onPress={() => {popMenu(true)}}>
                        <Icon
                            name={"menu"}
                            size={35}
                            color={styles.textColor.color}
                            style={header_style.navbar}
                        />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Header

const header_style = StyleSheet.create({
    header: {
        minWidth: '100%',
        borderColor: styles.headerColor.color,
        backgroundColor: styles.headerColor.color,
        paddingLeft: 8,
    },
    back: {
        color: styles.secondaryTextColor.color,
        fontFamily: styles.fontRegular.fontFamily,

        paddingLeft: 10,
        paddingBottom: 0,
        paddingTop: 8
    },
    navbar: {
        paddingRight: 12,
        paddingTop: 6,
    },
})