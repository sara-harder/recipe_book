import React from 'react';
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import styles from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({navigation, route, options}) => {
    let backButton = options.goBack;
    if (backButton == undefined) backButton = navigation.goBack

    const canGoBack = options.back

    return(
        <SafeAreaView style={header_style.header}>
            <View style={styles.row}>
                {canGoBack ? (
                    <Text onPress={backButton} style={header_style.back}>
                        Back
                    </Text>
                ) : <Text></Text>}
                <View style={[styles.row, {justifyContent: 'right'}]}>
                    <Icon
                        name={"magnify"}
                        size={30}
                        color={styles.textColor.color}
                        style={{paddingTop: 9}}
                    />
                    <Icon
                        name={"menu"}
                        size={35}
                        color={styles.textColor.color}
                        style={header_style.navbar}
                    />
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