// react imports
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState } from 'react';


function MapPage({route}) {
    let {recipe} = route.params;
    console.log(recipe)

    return(
        <SafeAreaView>
        </SafeAreaView>
    )
}

export default MapPage;