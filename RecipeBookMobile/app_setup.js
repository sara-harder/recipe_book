import React from 'react';
import { SafeAreaView } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PageSetup from './page_setup'

const Stack = createNativeStackNavigator();

const headerFunc = ({navigation, route, options, back}) => {
    return(
        <SafeAreaView style={{height: 0}}>
        </SafeAreaView>
    )
}

const appSetup = () => {

  return (
      <Stack.Navigator screenOptions={{header: headerFunc}}>
        <Stack.Screen
          name="AppPages"
          component={PageSetup}
          options={{title: ''}}
        />
      </Stack.Navigator>
  );
}

export default appSetup;