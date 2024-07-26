import React from 'react';
import {StyleSheet} from 'react-native';

const colors = StyleSheet.create({
    color1: {
        color: '#000000'
    },
    color2: {
        color: 'white'
    },
    color3: {
        color: '#a67c52'
    },
    color4: {
        color: '#8c6239'
    },
    color5: {
        color: '#754c24'
    },
    color6: {
        color: '#d1cdc9'
    },
    color7: {
        color: '#603913'
    },
})

const styles = StyleSheet.create({
    textColor: {
        color: colors.color1.color
    },
    highlightText: {
        color: colors.color7.color
    },
    itemBackground: {
        color: colors.color2.color
    },
    borderColor: {
        color: colors.color5.color
    },
    footerColor: {
        color: colors.color3.color
    },
    headerColor: {
        color: colors.color4.color
    },
    secondaryTextColor: {
        color: colors.color2.color
    },
    secondaryItemBackground: {
        color: colors.color5.color
    },
    backgroundColor: {
        color: colors.color6.color
    },


    fontRegular: {
        fontFamily: 'Kanit-Medium'
    },
    fontMedium: {
        fontFamily: 'Kanit-SemiBold'
    },
    fontBold: {
        fontFamily: 'Maitree-SemiBold'
    },


    app: {
        width: '100%',
        height: '100%',

        backgroundColor: colors.color6.color
    },
    container: {
        width: '95%',
        height: '98%',

        alignSelf: 'center',
    },

    bottom: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    wideRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    horizontalList: {
        maxWidth: '96%',
        marginLeft: 10
    },
});


const text_styles = StyleSheet.create({
    itemText: {
        color: styles.textColor.color,
        fontFamily: styles.fontMedium.fontFamily,

        paddingTop: 4,
        paddingBottom: 4,
    },
    boldText: {
        color: styles.textColor.color,
        fontFamily: styles.fontBold.fontFamily,

        paddingTop: 4,
        paddingBottom: 4,
    },
    inputText: {
        color: styles.textColor.color,
        fontFamily: styles.fontMedium.fontFamily,

        width: '100%',

        paddingTop: 0,
        paddingBottom: 0,
    },
    placeholder: {
        color: `${styles.textColor.color}80`,
        fontFamily: styles.fontMedium.fontFamily,

        width: '100%',

        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        fontSize: 24,
        color: styles.secondaryTextColor.color,
        fontFamily: styles.fontBold.fontFamily,
        textAlign: 'center',

        borderWidth: 1,
        borderColor: styles.borderColor.color,

        backgroundColor: styles.secondaryItemBackground.color
    },
    smallTitle: {
        fontSize: 20,
        color: styles.textColor.color,
        fontFamily: styles.fontBold.fontFamily,

        marginLeft: 8,
        marginTop: 4,
        paddingBottom: 6,
    },
    largeTitle: {
        fontSize: 30,
        color: styles.secondaryTextColor.color,
        fontFamily: styles.fontBold.fontFamily,

        padding: 12,
        paddingTop: 0,
        marginLeft: 8,
        marginTop: 10,
    },
    footnote: {
        fontSize: 11,
        color: styles.textColor.color,
        fontFamily: styles.fontRegular.fontFamily,
        lineHeight: 14,
    },
});

export default styles;

export {text_styles};