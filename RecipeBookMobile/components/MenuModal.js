// react imports
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

// style imports
import styles, {text_styles} from '../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Menu = ({popup, close}) => {
    const navigation = useNavigation()
    return(
        <View>
            <Modal
                animationIn={"slideInRight"}
                animationOut={"slideOutRight"}
                isVisible={popup}
                transparent={true}
                onRequestClose={() => close()}
                backdropTransitionOutTiming={0}
            >
                <View style={menu_style.container}>
                    <View style={menu_style.popup}>
                        <Pressable onPress={() => close()}>
                            <Icon
                                name={"close"}
                                size={30}
                                color={'black'}
                                style={{alignSelf:'flex-end'}}
                            />
                        </Pressable>
                        <Pressable onPress={() => {
                                navigation.navigate("AppPages", {screen: "Home"})
                                close()
                        }}>
                            <Text style={[text_styles.smallTitle, {color: 'black'}]}>My Recipes</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Menu

const menu_style = StyleSheet.create({
    container: {
        height: '107%',
        width: '111%',
        position: "absolute",
        right: "-6%",
        top: "-3.5%",
        alignItems: 'flex-end'
    },
    popup: {
        height: '100%',
        width: '70%',
        backgroundColor: 'white',
        padding: 9,
        paddingLeft: 12
    }
})
