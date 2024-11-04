// react imports
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState, useEffect } from 'react';

// style imports
import styles, {text_styles} from '../../style.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const DirectionsList = ({ directions, setDirections }) => {
    // index of last direction
    const end_idx = directions.length-1

    // when user starts typing, add a new empty input line
    useEffect(() => {
        if (directions[end_idx] !== "") {
            const copy = directions.slice()
            copy.push("")
            setDirections(copy)
        }
    }, [directions, setDirections]);

    // update the direction while user is typing. find direction to update using index
    const addDirection = (direction, index) => {
        const copy = directions.slice()
        copy[index] = direction
        setDirections(copy)
    }

    // remove the appropriate direction when trash icon is clicked
    const removeDirection = (index) => {
        const copy = directions.slice(0, index)
        setDirections(copy.concat(directions.slice(index + 1)))
        setTrash(-1)
    }

    // change the trash-can color on hover
    const [trashIdx, setTrash] = useState(-1)

    const visible = directions.length <= 1
    const [rowOpacity, setOpacity] = useState(-1)

    return (
        <>
            <FlatList
                data={directions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <View style={{justifyContent: 'center', marginBottom: 15}}>
                            <Text style={text_styles.itemText}>{index + 1}.</Text>
                        </View>
                        <TextInput
                            style={(index != end_idx || visible || rowOpacity == index) ? directions_style.input : reduced_opacity}
                            onChangeText={(text) => addDirection(text, index)}
                            value={item}
                            placeholder="Write directions"
                            placeholderTextColor='grey'
                        />
                    </View>
                )}
            />
        </>
    );
};

export default DirectionsList;


const directions_style = StyleSheet.create({
    input: {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 5,
        width: '94%',
        marginBottom: 15,
        paddingLeft: 12,
        paddingRight: 12
    },
});

const reduced_opacity = [directions_style.input, {opacity: .5}]